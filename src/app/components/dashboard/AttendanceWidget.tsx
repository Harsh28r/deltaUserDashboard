"use client";

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Alert, Spinner } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import {
  getAttendanceStatus,
  checkIn,
  checkOut,
} from '@/app/api/attendance/attendanceService';
import type { AttendanceStatus as AttendanceStatusType } from '@/app/(DashboardLayout)/types/attendance';
import {
  getCurrentLocation,
  reverseGeocode,
  getPlatformInfo,
  getStatusColor,
  getStatusText,
  formatHours,
} from '@/utils/attendanceUtils';

const AttendanceWidget = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatusType | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedSelfie, setCapturedSelfie] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'checkin' | 'checkout'>('checkin');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
    accuracy: number;
  } | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Fetch attendance status
  const fetchAttendanceStatus = async () => {
    try {
      setLoading(true);
      const status = await getAttendanceStatus();
      setAttendanceStatus(status);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch attendance status');
      setAttendanceStatus({
        status: 'not-checked-in',
        attendance: null,
        canCheckIn: true,
        canCheckOut: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  // Start camera for selfie
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setError('Failed to access camera. Please allow camera permission.');
      setShowCameraModal(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Capture selfie from video
  const captureSelfie = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedSelfie(imageData);
        stopCamera();
        
        // Auto-fetch location when photo is captured
        try {
          setLocationLoading(true);
          const location = await getCurrentLocation();
          const address = await reverseGeocode(location.latitude, location.longitude);
          setCurrentLocation({
            ...location,
            address,
          });
          setSuccess('Photo and location captured!');
        } catch (err: any) {
          setError('Failed to get location. Please enable location access.');
        } finally {
          setLocationLoading(false);
        }
      }
    }
  };

  // Open camera modal for check-in/check-out
  const openCameraForAction = (type: 'checkin' | 'checkout') => {
    setActionType(type);
    setCapturedSelfie(null);
    setCurrentLocation(null);
    setError('');
    setSuccess('');
    setShowCameraModal(true);
    setTimeout(() => startCamera(), 100);
  };

  // Close camera modal
  const closeCameraModal = () => {
    stopCamera();
    setShowCameraModal(false);
    setCapturedSelfie(null);
    setCurrentLocation(null);
  };

  // Handle check-in with selfie
  const handleCheckIn = async () => {
    if (!currentLocation) {
      setError('Please wait for location to be captured');
      return;
    }

    if (!capturedSelfie) {
      setError('Please capture a selfie first');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      await checkIn({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: currentLocation.address,
        accuracy: currentLocation.accuracy,
        selfie: capturedSelfie,
        platform: getPlatformInfo(),
      });
      setSuccess('Checked in successfully!');
      closeCameraModal();
      await fetchAttendanceStatus();
    } catch (err: any) {
      setError(err.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle check-out with selfie
  const handleCheckOut = async () => {
    if (!currentLocation) {
      setError('Please wait for location to be captured');
      return;
    }

    if (!capturedSelfie) {
      setError('Please capture a selfie first');
      return;
    }

    try {
      setActionLoading(true);
      setError('');
      await checkOut({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        address: currentLocation.address,
        accuracy: currentLocation.accuracy,
        selfie: capturedSelfie,
      });
      setSuccess('Checked out successfully!');
      closeCameraModal();
      await fetchAttendanceStatus();
    } catch (err: any) {
      setError(err.message || 'Check-out failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate hours worked
  const getHoursWorked = () => {
    const checkInTime = attendanceStatus?.attendance?.checkInTime || attendanceStatus?.attendance?.checkIn?.time;
    if (!checkInTime) return 0;
    const checkInDate = new Date(checkInTime);
    const now = new Date();
    const diff = now.getTime() - checkInDate.getTime();
    return diff / (1000 * 60 * 60);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <Icon icon="solar:user-check-rounded-bold" className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Attendance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          <Badge color={getStatusColor(attendanceStatus?.status || 'absent')} size="lg">
            {getStatusText(attendanceStatus?.status || 'Not Checked In')}
          </Badge>
        </div>

        {/* Alerts */}
        {error && (
          <Alert color="failure" onDismiss={() => setError('')} className="text-sm">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="success" onDismiss={() => setSuccess('')} className="text-sm">
            {success}
          </Alert>
        )}

        {/* Time Display */}
        <div className="text-center py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </div>
          {attendanceStatus?.attendance && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Working for <span className="font-semibold">{formatHours(getHoursWorked())}</span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {attendanceStatus?.attendance && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <Icon icon="solar:login-3-bold" className="text-xl text-green-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 dark:text-gray-400">Check-In</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {attendanceStatus.attendance.checkIn?.time
                  ? new Date(attendanceStatus.attendance.checkIn.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--:--'}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
              <Icon icon="solar:clock-circle-bold" className="text-xl text-blue-600 mx-auto mb-1" />
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Hours</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {formatHours(attendanceStatus.attendance.totalHours)}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {attendanceStatus?.canCheckIn && (
            <Button
              color="success"
              onClick={() => openCameraForAction('checkin')}
              disabled={actionLoading}
              className="w-full"
            >
              <Icon icon="solar:camera-bold" className="mr-2 text-lg" />
              Check In
            </Button>
          )}

          {attendanceStatus?.canCheckOut && (
            <Button
              color="failure"
              onClick={() => openCameraForAction('checkout')}
              disabled={actionLoading}
              className="w-full"
            >
              <Icon icon="solar:camera-bold" className="mr-2 text-lg" />
              Check Out
            </Button>
          )}

          <Link href="/apps/attendance/my-history" className={attendanceStatus?.canCheckIn && attendanceStatus?.canCheckOut ? '' : 'col-span-2'}>
            <Button color="light" className="w-full">
              <Icon icon="solar:history-bold" className="mr-2 text-lg" />
              View History
            </Button>
          </Link>
        </div>

        {/* On Break Indicator */}
        {attendanceStatus?.attendance?.isOnBreak && (
          <div className="flex items-center justify-center space-x-2 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 rounded-lg p-3">
            <Icon icon="solar:cup-hot-bold" className="text-lg" />
            <span className="text-sm font-medium">Currently on break</span>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {actionType === 'checkin' ? 'Check-In Selfie' : 'Check-Out Selfie'}
                  </h3>
                  <Button size="sm" color="light" onClick={closeCameraModal}>
                    <Icon icon="solar:close-circle-bold" className="text-xl" />
                  </Button>
                </div>

                {/* Camera View */}
                {!capturedSelfie && (
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-auto max-h-[50vh] object-cover"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <Button
                        size="lg"
                        color="success"
                        onClick={captureSelfie}
                        disabled={!cameraStream}
                        className="rounded-full shadow-lg"
                      >
                        <Icon icon="solar:camera-bold" className="text-2xl mr-2" />
                        Capture
                      </Button>
                    </div>
                  </div>
                )}

                {/* Captured Photo Preview */}
                {capturedSelfie && (
                  <div className="space-y-3">
                    <img
                      src={capturedSelfie}
                      alt="Captured selfie"
                      className="w-full h-auto max-h-[50vh] rounded-lg object-cover"
                    />
                    
                    {/* Location Info */}
                    {locationLoading && (
                      <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                        <Spinner size="sm" className="mr-2" />
                        Fetching location...
                      </div>
                    )}
                    
                    {currentLocation && (
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Icon icon="solar:map-point-bold" className="text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Location</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {currentLocation.address}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Accuracy: {currentLocation.accuracy.toFixed(0)}m
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        color="success"
                        onClick={actionType === 'checkin' ? handleCheckIn : handleCheckOut}
                        disabled={actionLoading || !currentLocation || locationLoading}
                        className="flex-1"
                      >
                        {actionLoading ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : (
                          <Icon icon="solar:check-circle-bold" className="mr-2 text-lg" />
                        )}
                        Confirm {actionType === 'checkin' ? 'Check-In' : 'Check-Out'}
                      </Button>
                      <Button
                        color="light"
                        onClick={() => {
                          setCapturedSelfie(null);
                          setCurrentLocation(null);
                          setTimeout(() => startCamera(), 100);
                        }}
                        disabled={actionLoading}
                      >
                        <Icon icon="solar:refresh-bold" className="text-lg" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {!capturedSelfie && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-100">
                      <Icon icon="solar:info-circle-bold" className="inline mr-1" />
                      Position your face in the frame and capture photo. Location will be auto-fetched.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}
    </Card>
  );
};

export default AttendanceWidget;


"use client";
import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { getCurrentLocation, reverseGeocode, LocationData } from '@/app/utils/locationUtils';

interface LocationCaptureProps {
  onLocationCaptured: (location: LocationData) => void;
  onLocationError: (error: any) => void;
  initialLocation?: { lat: number; lng: number } | null;
  showMap?: boolean;
  className?: string;
}

const LocationCapture: React.FC<LocationCaptureProps> = ({
  onLocationCaptured,
  onLocationError,
  initialLocation,
  showMap = false,
  className = ""
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    if (initialLocation) {
      // Convert initial location to LocationData format
      const locationData: LocationData = {
        lat: initialLocation.lat,
        lng: initialLocation.lng,
        address: '',
        placeName: '',
        accuracy: 0,
        timestamp: Date.now()
      };
      setLocation(locationData);
    }
  }, [initialLocation]);

  const captureLocation = async () => {
    try {
      setIsCapturing(true);
      setError(null);

      // Get current location with high accuracy
      const locationData = await getCurrentLocation({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });

      // Reverse geocode to get address details
      try {
        const geocodedData = await reverseGeocode(locationData.lat, locationData.lng);
        locationData.address = geocodedData.address || '';
        locationData.placeName = geocodedData.placeName || '';
      } catch (geocodeError) {
        console.warn('Reverse geocoding failed:', geocodeError);
        // Continue without address data
      }

      setLocation(locationData);
      setPermission('granted');
      onLocationCaptured(locationData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to capture location';
      setError(errorMessage);
      setPermission('denied');
      onLocationError(err);
    } finally {
      setIsCapturing(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
    setPermission('prompt');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!location && !isCapturing && (
        <div className="text-center">
          <Button
            color="orange"
            onClick={captureLocation}
            disabled={isCapturing}
            className="flex items-center gap-2"
          >
            <Icon icon="lucide:map-pin" className="w-4 h-4" />
            Capture Location
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Get precise GPS coordinates and address
          </p>
        </div>
      )}

      {isCapturing && (
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="text-sm text-gray-600">Capturing location...</p>
          <p className="text-xs text-gray-500">Please allow location access</p>
        </div>
      )}

      {location && (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <Icon icon="lucide:check-circle" className="w-4 h-4" />
              <span className="font-medium">Location Captured</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <div><strong>Coordinates:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</div>
              {location.address && <div><strong>Address:</strong> {location.address}</div>}
              {location.placeName && <div><strong>Place:</strong> {location.placeName}</div>}
              <div><strong>Accuracy:</strong> ±{location.accuracy}m</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              color="orange"
              onClick={captureLocation}
              className="flex items-center gap-1"
            >
              <Icon icon="lucide:refresh-cw" className="w-3 h-3" />
              Recapture
            </Button>
            <Button
              size="sm"
              color="gray"
              onClick={clearLocation}
              className="flex items-center gap-1"
            >
              <Icon icon="lucide:x" className="w-3 h-3" />
              Clear
            </Button>
          </div>
        </div>
      )}

      {error && (
        <Alert color="failure">
          <Icon icon="lucide:alert-circle" className="w-4 h-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}
    </div>
  );
};

export default LocationCapture;

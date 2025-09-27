"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Label, TextInput, Alert, Select, Modal, FileInput } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import LocationCapture from "@/app/components/LocationCapture";
import LocationMap from "@/app/components/LocationMap";
import { LocationData, getCurrentLocation } from "@/app/utils/locationUtils";
import PermissionGate from "@/app/components/auth/PermissionGate";

interface LocalLocationData { lat: number; lng: number; }

interface ChannelPartnerData {
  name: string; phone: string; firmName: string; location: string; address: string;
  mahareraNo: string; pinCode: string; photo?: string; isActive?: boolean;
}

type FormErrors = { [key: string]: string };

interface Project { _id: string; name: string; description?: string; }

interface FormData {
  channelPartnerData: ChannelPartnerData;
  projectId: string;
  location: LocalLocationData;
  selfie: string;
  selfieFile: File | null;
}

const convertToLocalLocationData = (location: LocationData): LocalLocationData => ({ lat: location.lat, lng: location.lng });
const getDetailedLocationString = (location: LocalLocationData): string => `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;

const AddCPSourcingPage: React.FC = () => {
  const router = useRouter();
  const { token, projectAccess } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isCheckingCPPhone, setIsCheckingCPPhone] = useState(false);
  const [cpAutoFilled, setCpAutoFilled] = useState(false);
  const phoneLookupCacheRef = useRef<Record<string, any>>({});
  const phoneDebounceRef = useRef<any>(null);
  const phoneAbortRef = useRef<AbortController | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isEditingCP, setIsEditingCP] = useState(false);
  const [editCPData, setEditCPData] = useState<ChannelPartnerData>({ name: "", phone: "", firmName: "", location: "", address: "", mahareraNo: "", pinCode: "" });
  const [editCPPhoto, setEditCPPhoto] = useState<string>("");
  const [editCPPhotoFile, setEditCPPhotoFile] = useState<File | null>(null);
  const [editCPErrors, setEditCPErrors] = useState<FormErrors>({});
  const [editCPStatus, setEditCPStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });
  const [currentCPId, setCurrentCPId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    channelPartnerData: { name: "", phone: "", firmName: "", location: "", address: "", mahareraNo: "", pinCode: "", photo: "" },
    projectId: "",
    location: { lat: 0, lng: 0 },
    selfie: "",
    selfieFile: null,
  });

  const [capturedLocation, setCapturedLocation] = useState<LocalLocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { if (token) { fetchProjects(); } }, [token]);
  useEffect(() => () => { if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); } }, [cameraStream]);

  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const response = await fetch(API_ENDPOINTS.PROJECTS, { method: "GET", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      if (response.ok) { const data = await response.json(); setProjects(data.projects || data || []); }
    } finally { setIsLoadingProjects(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('channelPartnerData.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, channelPartnerData: { ...prev.channelPartnerData, [field]: value } }));
      if (field === 'phone') setCpAutoFilled(false);
    } else {
      setFormData(prev => ({ ...prev, [name]: value } as any));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const lookupCPByPhone = async (digits: string) => {
    if (!token) return;
    const cached = phoneLookupCacheRef.current[digits];
    if (cached) { applyCPMatch(cached); return; }
    if (phoneAbortRef.current) phoneAbortRef.current.abort();
    const controller = new AbortController(); phoneAbortRef.current = controller;
    setIsCheckingCPPhone(true);
    try {
      const resp = await fetch(`${API_ENDPOINTS.CHANNEL_PARTNERS}?phone=${encodeURIComponent(digits)}`, { method: 'GET', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, signal: controller.signal });
      if (!resp.ok) { setCpAutoFilled(false); return; }
      const data = await resp.json().catch(() => ({}));
      const list = data.channelPartners || data || [];
      const match = Array.isArray(list) ? list.find((p: any) => (p?.phone || '').replace(/\D/g, '') === digits) : null;
      if (match) { phoneLookupCacheRef.current[digits] = match; applyCPMatch(match); } else { setCpAutoFilled(false); }
    } finally { setIsCheckingCPPhone(false); }
  };

  const applyCPMatch = (match: any) => {
    setFormData(prev => ({ ...prev, channelPartnerData: { ...prev.channelPartnerData, name: match.name || prev.channelPartnerData.name, firmName: match.firmName || prev.channelPartnerData.firmName, location: match.location || prev.channelPartnerData.location, address: match.address || prev.channelPartnerData.address, mahareraNo: match.mahareraNo || prev.channelPartnerData.mahareraNo, pinCode: match.pinCode || prev.channelPartnerData.pinCode, phone: match.phone || prev.channelPartnerData.phone } }));
    setCpAutoFilled(true); setCurrentCPId(match._id || null);
  };

  const openEditModal = () => { if (!currentCPId) return; setEditCPData({ ...formData.channelPartnerData }); setEditCPPhoto(formData.channelPartnerData.photo || ""); setEditCPPhotoFile(null); setEditCPErrors({}); setEditCPStatus({ type: "idle" }); setEditModalOpen(true); };
  const closeEditModal = () => { setEditModalOpen(false); setEditCPData({ name: "", phone: "", firmName: "", location: "", address: "", mahareraNo: "", pinCode: "" }); setEditCPPhoto(""); setEditCPPhotoFile(null); setEditCPErrors({}); setEditCPStatus({ type: "idle" }); };
  const handleEditCPChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setEditCPData(prev => ({ ...prev, [name]: value })); if (editCPErrors[name]) setEditCPErrors(prev => ({ ...prev, [name]: "" })); };
  const handleEditCPFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/')) { setEditCPErrors(prev => ({ ...prev, photo: "Please select a valid image file" })); return; } if (file.size > 5 * 1024 * 1024) { setEditCPErrors(prev => ({ ...prev, photo: "File size must be less than 5MB" })); return; } const preview = URL.createObjectURL(file); setEditCPPhotoFile(file); setEditCPPhoto(preview); if (editCPErrors.photo) setEditCPErrors(prev => ({ ...prev, photo: "" })); };
  const removeEditCPPhoto = () => { if (editCPPhoto && editCPPhoto.startsWith('blob:')) URL.revokeObjectURL(editCPPhoto); setEditCPPhoto(""); setEditCPPhotoFile(null); };
  const validateEditCPForm = () => { const n: FormErrors = {}; if (!editCPData.name.trim()) n.name = "Name is required"; if (!editCPData.phone.trim()) n.phone = "Phone number is required"; else if (!/^[0-9]{10}$/.test(editCPData.phone.replace(/\D/g, ""))) n.phone = "Please enter a valid 10-digit phone number"; if (!editCPData.firmName.trim()) n.firmName = "Firm name is required"; if (!editCPData.location.trim()) n.location = "Location is required"; if (!editCPData.address.trim()) n.address = "Address is required"; if (!editCPData.pinCode.trim()) n.pinCode = "PIN code is required"; else if (!/^[0-9]{6}$/.test(editCPData.pinCode)) n.pinCode = "Please enter a valid 6-digit PIN code"; setEditCPErrors(n); return Object.keys(n).length === 0; };
  const handleEditCPSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!validateEditCPForm()) return; if (isEditingCP || !currentCPId) return; setIsEditingCP(true); setEditCPStatus({ type: "idle" }); try { if (!token) throw new Error("No token found. Please sign in first."); const submit = new FormData(); submit.append('name', editCPData.name.trim()); submit.append('phone', editCPData.phone.trim()); submit.append('firmName', editCPData.firmName.trim()); submit.append('location', editCPData.location.trim()); submit.append('address', editCPData.address.trim()); submit.append('mahareraNo', editCPData.mahareraNo.trim() || ''); submit.append('pinCode', editCPData.pinCode.trim()); const resp = await fetch(API_ENDPOINTS.UPDATE_CHANNEL_PARTNER(currentCPId), { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: submit, credentials: "include", mode: "cors" }); if (!resp.ok) { const body = await resp.json().catch(() => ({})); throw new Error(body?.message || `Request failed with ${resp.status}`); } if (editCPPhotoFile) { try { const photoData = new FormData(); photoData.append('photo', editCPPhotoFile); const pr = await fetch(API_ENDPOINTS.UPLOAD_CHANNEL_PARTNER_PHOTO(currentCPId), { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: photoData, credentials: "include", mode: "cors" }); if (!pr.ok) console.warn("Photo upload failed"); } catch (pe) { console.warn("Photo upload failed:", pe); } } setEditCPStatus({ type: "success", message: "Channel partner updated successfully!" }); setFormData(prev => ({ ...prev, channelPartnerData: { ...editCPData } })); setTimeout(() => { closeEditModal(); }, 1500); } catch (err: any) { setEditCPStatus({ type: "error", message: err?.message || "Something went wrong." }); } finally { setIsEditingCP(false); } };

  const handleLocationCaptured = (location: LocationData) => { const local = convertToLocalLocationData(location); setCapturedLocation(local); setLocationError(null); setFormData(prev => ({ ...prev, location: local })); };
  const handleLocationError = (error: any) => { setLocationError(error?.message || 'Failed to capture location'); setCapturedLocation(null); };

  const removeSelfie = () => { if (formData.selfie && formData.selfie.startsWith('blob:')) URL.revokeObjectURL(formData.selfie); setFormData(prev => ({ ...prev, selfie: "", selfieFile: null })); };
  const startCamera = async () => { try { setIsCapturing(true); try { const loc = await getCurrentLocation(); const local = convertToLocalLocationData(loc); setFormData(prev => ({ ...prev, location: local })); setCapturedLocation(local); setLocationError(null); setLocationPermission('granted'); } catch (le: any) { setLocationError(le?.message || 'Failed to capture detailed location'); setLocationPermission('denied'); setCapturedLocation(null); } const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }); setCameraStream(stream); if (videoRef.current) { (videoRef.current as any).srcObject = stream; } } catch (e) { setStatus({ type: "error", message: "Could not access camera. Please check permissions." }); setIsCapturing(false); } };
  const stopCamera = () => { if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null); } setIsCapturing(false); };
  const captureSelfie = () => { if (!videoRef.current || !canvasRef.current) return; const video = videoRef.current; const canvas = canvasRef.current; const ctx = canvas.getContext('2d'); if (!ctx) return; canvas.width = video.videoWidth; canvas.height = video.videoHeight; ctx.drawImage(video, 0, 0, canvas.width, canvas.height); canvas.toBlob((blob) => { if (blob) { const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' }); const url = URL.createObjectURL(blob); setFormData(prev => ({ ...prev, selfieFile: file, selfie: url })); if (errors.selfie) setErrors(prev => ({ ...prev, selfie: "" })); stopCamera(); } }, 'image/jpeg', 0.8); };

  const validateForm = (): boolean => {
    const n: FormErrors = {};
    if (!formData.channelPartnerData.name.trim()) n['channelPartnerData.name'] = "Partner name is required";
    if (!formData.channelPartnerData.phone.trim()) n['channelPartnerData.phone'] = "Phone number is required"; else if (!/^[0-9]{10}$/.test(formData.channelPartnerData.phone.replace(/\D/g, ""))) n['channelPartnerData.phone'] = "Please enter a valid 10-digit phone number";
    if (!formData.channelPartnerData.firmName.trim()) n['channelPartnerData.firmName'] = "Firm name is required";
    if (!formData.channelPartnerData.location.trim()) n['channelPartnerData.location'] = "Location is required";
    if (!formData.channelPartnerData.address.trim()) n['channelPartnerData.address'] = "Address is required";
    if (!formData.channelPartnerData.pinCode.trim()) n['channelPartnerData.pinCode'] = "PIN code is required"; else if (!/^[0-9]{6}$/.test(formData.channelPartnerData.pinCode)) n['channelPartnerData.pinCode'] = "Please enter a valid 6-digit PIN code";
    if (!formData.projectId) n.projectId = "Project selection is required";
    if (!capturedLocation || (formData.location.lat === 0 && formData.location.lng === 0)) n.location = "Please capture your location before submitting";
    if (!formData.selfieFile) n.selfie = "Selfie is required";
    setErrors(n); return Object.keys(n).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!validateForm()) return; if (isSubmitting) return; setIsSubmitting(true); setStatus({ type: "idle" });
    try {
      if (!token) throw new Error("No token found. Please sign in first.");
      const submit = new FormData();
      submit.append('channelPartnerData[name]', formData.channelPartnerData.name.trim());
      submit.append('channelPartnerData[phone]', formData.channelPartnerData.phone.trim());
      submit.append('channelPartnerData[firmName]', formData.channelPartnerData.firmName.trim());
      submit.append('channelPartnerData[location]', formData.channelPartnerData.location.trim());
      submit.append('channelPartnerData[address]', formData.channelPartnerData.address.trim());
      submit.append('channelPartnerData[mahareraNo]', formData.channelPartnerData.mahareraNo.trim() || 'Not Available');
      submit.append('channelPartnerData[pinCode]', formData.channelPartnerData.pinCode.trim());
      submit.append('projectId', formData.projectId);
      submit.append('location[lat]', formData.location.lat.toString());
      submit.append('location[lng]', formData.location.lng.toString());
      if (formData.selfieFile) submit.append('selfie', formData.selfieFile);
      const resp = await fetch(API_ENDPOINTS.CREATE_CP_SOURCING, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: submit, credentials: "include", mode: "cors" });
      if (!resp.ok) { const body = await resp.json().catch(() => ({})); throw new Error(body?.message || `Request failed with ${resp.status}`); }
      await resp.json().catch(() => null);
      setStatus({ type: "success", message: "CP sourcing record created successfully!" });
      if (formData.selfie && formData.selfie.startsWith('blob:')) URL.revokeObjectURL(formData.selfie);
      setFormData({ channelPartnerData: { name: "", phone: "", firmName: "", location: "", address: "", mahareraNo: "", pinCode: "", photo: "" }, projectId: "", location: { lat: 0, lng: 0 }, selfie: "", selfieFile: null });
      setTimeout(() => { router.push("/apps/cp-sourcing"); }, 2000);
    } catch (err: any) { setStatus({ type: "error", message: err?.message || "Something went wrong." }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button color="gray" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add CP Sourcing</h1>
          <p className="text-gray-600">Create a new channel partner sourcing record</p>
        </div>
      </div>

      <Card className="max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {status.type === "success" && (
            <Alert color="success" className="mb-4">
              <Icon icon="lucide:check-circle" className="w-4 h-4" />
              <span className="ml-2">{status.message}</span>
            </Alert>
          )}
          {status.type === "error" && (
            <Alert color="failure" className="mb-4">
              <Icon icon="lucide:alert-circle" className="w-4 h-4" />
              <span className="ml-2">{status.message}</span>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold text-gray-900">Channel Partner Information</h3>
              {cpAutoFilled && currentCPId && (
                <PermissionGate permissions={["cp-sourcing:update", "channel-partner:update"]}>
                  <Button size="sm" color="blue" onClick={() => router.push(`/apps/cp-sourcing/edit/${currentCPId}`)} className="flex items-center gap-2">
                    <Icon icon="lucide:edit" className="w-4 h-4" />
                    Edit CP Sourcing
                  </Button>
                </PermissionGate>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="channelPartnerData.phone" value="Phone Number *" />
                <TextInput id="channelPartnerData.phone" name="channelPartnerData.phone" type="tel" placeholder="Enter 10-digit phone number" value={formData.channelPartnerData.phone} onChange={(e) => { handleChange(e); const digits = e.target.value.replace(/\D/g, ""); if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current); if (digits.length === 10) { phoneDebounceRef.current = setTimeout(() => lookupCPByPhone(digits), 200); } }} onBlur={() => { const digits = formData.channelPartnerData.phone.replace(/\D/g, ""); if (digits.length === 10) lookupCPByPhone(digits); }} color={errors['channelPartnerData.phone'] ? "failure" : "gray"} helperText={errors['channelPartnerData.phone']} />
                {isCheckingCPPhone && (<p className="text-xs text-gray-500 mt-1">Checking channel partners…</p>)}
                {cpAutoFilled && !isCheckingCPPhone && (<p className="text-xs text-blue-600 mt-1">Existing channel partner found. Details auto-filled.</p>)}
              </div>
              <div>
                <Label htmlFor="channelPartnerData.name" value="Partner Name *" />
                <TextInput id="channelPartnerData.name" name="channelPartnerData.name" type="text" placeholder="Enter partner name" value={formData.channelPartnerData.name} onChange={handleChange} disabled={cpAutoFilled} color={errors['channelPartnerData.name'] ? "failure" : "gray"} helperText={errors['channelPartnerData.name']} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.firmName" value="Firm Name *" />
                <TextInput id="channelPartnerData.firmName" name="channelPartnerData.firmName" type="text" placeholder="Enter firm/company name" value={formData.channelPartnerData.firmName} onChange={handleChange} disabled={cpAutoFilled} color={errors['channelPartnerData.firmName'] ? "failure" : "gray"} helperText={errors['channelPartnerData.firmName']} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.location" value="Location *" />
                <TextInput id="channelPartnerData.location" name="channelPartnerData.location" type="text" placeholder="Enter city/location" value={formData.channelPartnerData.location} onChange={handleChange} disabled={cpAutoFilled} color={errors['channelPartnerData.location'] ? "failure" : "gray"} helperText={errors['channelPartnerData.location']} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="channelPartnerData.address" value="Address *" />
                <TextInput id="channelPartnerData.address" name="channelPartnerData.address" type="text" placeholder="Enter complete address" value={formData.channelPartnerData.address} onChange={handleChange} disabled={cpAutoFilled} color={errors['channelPartnerData.address'] ? "failure" : "gray"} helperText={errors['channelPartnerData.address']} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.mahareraNo" value="MAHARERA Number (Optional)" />
                <TextInput id="channelPartnerData.mahareraNo" name="channelPartnerData.mahareraNo" type="text" placeholder="Enter MAHARERA registration number (optional)" value={formData.channelPartnerData.mahareraNo} onChange={handleChange} disabled={cpAutoFilled} color={errors['channelPartnerData.mahareraNo'] ? "failure" : "gray"} helperText={errors['channelPartnerData.mahareraNo'] || "Optional field"} />
              </div>
              <div>
                <Label htmlFor="channelPartnerData.pinCode" value="PIN Code *" />
                <TextInput id="channelPartnerData.pinCode" name="channelPartnerData.pinCode" type="text" placeholder="Enter 6-digit PIN code" value={formData.channelPartnerData.pinCode} onChange={handleChange} disabled={cpAutoFilled} color={errors['channelPartnerData.pinCode'] ? "failure" : "gray"} helperText={errors['channelPartnerData.pinCode']} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Project & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="projectId" value="Project *" />
                <Select id="projectId" name="projectId" value={formData.projectId} onChange={handleChange} disabled={isLoadingProjects}>
                  <option value="">Select a project</option>
                  {(projectAccess?.canAccessAll
                    ? projects
                    : (
                        (projectAccess?.assignedProjects?.length
                          ? projects.filter((p) => projectAccess.assignedProjects!.some((ap: any) => ap.id === p._id))
                          : projects.filter((p) => (projectAccess?.allowedProjects || []).includes(p._id))
                        )
                      )
                    ).map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
                </Select>
                {errors.projectId && (<p className="text-sm text-red-600 mt-1">{errors.projectId}</p>)}
                {isLoadingProjects && (<p className="text-sm text-gray-500 mt-1">Loading projects...</p>)}
              </div>
              <div className="space-y-4">
                <Label value="Location Capture *" />
                <LocationCapture onLocationCaptured={handleLocationCaptured} onLocationError={handleLocationError} initialLocation={capturedLocation} showMap={true} className="w-full" />
                {locationError && (
                  <Alert color="failure" className="mt-2">
                    <Icon icon="lucide:alert-circle" className="w-4 h-4" />
                    <span className="ml-2">{locationError}</span>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Selfie Capture</h3>
            <div className="max-w-2xl">
              <Label htmlFor="selfie" value="Selfie *" />
              <div className="space-y-4">
                {isCapturing ? (
                  <div className="space-y-4">
                    {capturedLocation ? (
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-800">
                            <Icon icon="lucide:check-circle" className="w-5 h-5" />
                            <span className="font-medium">Detailed Location Captured Successfully</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">{getDetailedLocationString(capturedLocation)}</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2"><Icon icon="lucide:map-pin" className="w-4 h-4" />Location Coordinates</h4>
                          <div className="text-xs"><div><span className="font-medium text-blue-700">Coordinates:</span> {capturedLocation.lat.toFixed(4)}, {capturedLocation.lng.toFixed(4)}</div></div>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Icon icon="lucide:map" className="w-4 h-4" />Location Map</h4>
                          <LocationMap location={capturedLocation} height="200px" width="100%" showPopup={true} popupContent={getDetailedLocationString(capturedLocation)} className="rounded-lg" />
                        </div>
                      </div>
                    ) : locationError ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-800"><Icon icon="lucide:alert-circle" className="w-5 h-5" /><span className="font-medium">Location Capture Failed</span></div>
                        <p className="text-sm text-red-700 mt-1">{locationError}</p>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-800"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div><span className="font-medium">Capturing Detailed Location...</span></div>
                        <p className="text-sm text-blue-700 mt-1">Getting precise coordinates, address details, and reverse geocoding information...</p>
                        <div className="mt-2 text-xs text-blue-600">
                          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div><span>Getting GPS coordinates</span></div>
                          <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div><span>Reverse geocoding address</span></div>
                          <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div><span>Extracting building and landmark details</span></div>
                        </div>
                      </div>
                    )}
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center"><div className="bg-white/20 backdrop-blur-sm rounded-full p-4"><Icon icon="lucide:camera" className="w-8 h-8 text-white" /></div></div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button color="orange" onClick={captureSelfie} className="flex items-center gap-2"><Icon icon="lucide:camera" className="w-4 h-4" />Capture Selfie</Button>
                      <Button color="gray" onClick={stopCamera} className="flex items-center gap-2"><Icon icon="lucide:x" className="w-4 h-4" />Cancel</Button>
                    </div>
                    {locationPermission === 'granted' && (<div className="flex items-center gap-2 text-green-600 text-sm"><Icon icon="lucide:map-pin" className="w-4 h-4" />Location captured: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}</div>)}
                    {locationPermission === 'denied' && (<div className="flex items-center gap-2 text-yellow-600 text-sm"><Icon icon="lucide:alert-triangle" className="w-4 h-4" />Location access denied. Please enter coordinates manually.</div>)}
                  </div>
                ) : formData.selfie ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative"><img src={formData.selfie} alt="Selfie preview" className="w-32 h-32 object-cover rounded-lg border border-gray-300" /></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{formData.selfieFile ? formData.selfieFile.name : "Selfie captured"}</p>
                        {locationPermission === 'granted' && (<p className="text-xs text-green-600 mt-1">Location: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}</p>)}
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" color="orange" onClick={startCamera} className="flex items-center gap-1"><Icon icon="lucide:camera" className="w-3 h-3" />Retake</Button>
                          <Button size="sm" color="failure" onClick={removeSelfie} className="flex items-center gap-1"><Icon icon="lucide:trash-2" className="w-3 h-3" />Remove</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex w-full items-center justify-center">
                      <div className="flex flex-col items-center space-y-4">
                        <Button color="orange" onClick={startCamera} className="flex items-center gap-2 px-8 py-4"><Icon icon="lucide:camera" className="w-6 h-6" />Capture Selfie with Detailed Location</Button>
                        <div className="text-center">
                          <p className="text-sm text-blue-600 mb-2 flex items-center justify-center gap-1"><Icon icon="lucide:map-pin" className="w-4 h-4" />Detailed location will be captured automatically</p>
                          <p className="text-xs text-gray-600 mb-2">Including building names, streets, landmarks, and exact address</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center"><p className="text-xs text-gray-500">Camera will automatically capture detailed location including building names, streets, landmarks, and exact address</p></div>
                  </div>
                )}
                {errors.selfie && (<p className="text-sm text-red-600">{errors.selfie}</p>)}
                {!formData.selfie && !errors.selfie && !isCapturing && (<p className="text-xs text-gray-500">Selfie is required for identification purposes</p>)}
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" color="gray" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            <PermissionGate permission="cp-sourcing:create">
              <Button type="submit" color="orange" disabled={isSubmitting} className="flex items-center gap-2">
                {isSubmitting ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Creating...</>) : (<><Icon icon="lucide:plus" className="w-4 h-4" />Create CP Sourcing</>)}
              </Button>
            </PermissionGate>
          </div>
        </form>
      </Card>

      <Modal show={editModalOpen} onClose={closeEditModal} size="4xl">
        <Modal.Header>Edit Channel Partner Details</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditCPSubmit} className="space-y-6">
            {editCPStatus.type === "success" && (<Alert color="success" className="mb-4"><Icon icon="lucide:check-circle" className="w-4 h-4" /><span className="ml-2">{editCPStatus.message}</span></Alert>)}
            {editCPStatus.type === "error" && (<Alert color="failure" className="mb-4"><Icon icon="lucide:alert-circle" className="w-4 h-4" /><span className="ml-2">{editCPStatus.message}</span></Alert>)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><Label htmlFor="edit-name" value="Name *" /><TextInput id="edit-name" name="name" type="text" placeholder="Enter full name" value={editCPData.name} onChange={handleEditCPChange} color={editCPErrors.name ? "failure" : "gray"} helperText={editCPErrors.name} /></div>
              <div><Label htmlFor="edit-phone" value="Phone Number *" /><TextInput id="edit-phone" name="phone" type="tel" placeholder="Enter 10-digit phone number" value={editCPData.phone} onChange={handleEditCPChange} color={editCPErrors.phone ? "failure" : "gray"} helperText={editCPErrors.phone} /></div>
              <div><Label htmlFor="edit-firmName" value="Firm Name *" /><TextInput id="edit-firmName" name="firmName" type="text" placeholder="Enter firm/company name" value={editCPData.firmName} onChange={handleEditCPChange} color={editCPErrors.firmName ? "failure" : "gray"} helperText={editCPErrors.firmName} /></div>
              <div><Label htmlFor="edit-location" value="Location *" /><TextInput id="edit-location" name="location" type="text" placeholder="Enter city/location" value={editCPData.location} onChange={handleEditCPChange} color={editCPErrors.location ? "failure" : "gray"} helperText={editCPErrors.location} /></div>
              <div className="md:col-span-2"><Label htmlFor="edit-address" value="Address *" /><TextInput id="edit-address" name="address" type="text" placeholder="Enter complete address" value={editCPData.address} onChange={handleEditCPChange} color={editCPErrors.address ? "failure" : "gray"} helperText={editCPErrors.address} /></div>
              <div><Label htmlFor="edit-mahareraNo" value="MAHARERA Number (Optional)" /><TextInput id="edit-mahareraNo" name="mahareraNo" type="text" placeholder="Enter MAHARERA registration number" value={editCPData.mahareraNo} onChange={handleEditCPChange} color={editCPErrors.mahareraNo ? "failure" : "gray"} helperText={editCPErrors.mahareraNo || "Optional field"} /></div>
              <div><Label htmlFor="edit-pinCode" value="PIN Code *" /><TextInput id="edit-pinCode" name="pinCode" type="text" placeholder="Enter 6-digit PIN code" value={editCPData.pinCode} onChange={handleEditCPChange} color={editCPErrors.pinCode ? "failure" : "gray"} helperText={editCPErrors.pinCode} /></div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-photo" value="Photo (Optional)" />
                <div className="space-y-4">
                  {editCPPhoto ? (
                    <div className="flex items-center gap-4">
                      <div className="relative"><img src={editCPPhoto} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-300" /></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{editCPPhotoFile ? editCPPhotoFile.name : "Current photo"}</p>
                        <Button size="sm" color="failure" onClick={removeEditCPPhoto} className="mt-2"><Icon icon="lucide:trash-2" className="w-3 h-3 mr-1" />Remove</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      <Label htmlFor="edit-photo-upload" className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                          <Icon icon="lucide:cloud-upload" className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                        </div>
                        <FileInput id="edit-photo-upload" onChange={handleEditCPFileChange} accept="image/*" className="hidden" />
                      </Label>
                    </div>
                  )}
                  {editCPErrors.photo && (<p className="text-sm text-red-600">{editCPErrors.photo}</p>)}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" color="gray" onClick={closeEditModal} disabled={isEditingCP}>Cancel</Button>
              <PermissionGate permissions={["cp-sourcing:update", "channel-partner:update"]}>
                <Button type="submit" color="orange" disabled={isEditingCP} className="flex items-center gap-2">{isEditingCP ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Updating...</>) : (<><Icon icon="lucide:save" className="w-4 h-4" />Update Channel Partner</>)}</Button>
              </PermissionGate>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddCPSourcingPage;



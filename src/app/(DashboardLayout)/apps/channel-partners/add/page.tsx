"use client";
import React, { useState, useRef } from "react";
import { Button, Card, Label, TextInput, Alert, FileInput } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";

interface FormData {
  name: string;
  phone: string;
  firmName: string;
  location: string;
  address: string;
  mahareraNo: string;
  pinCode: string;
  photo: string;
  photoFile: File | null;
}

interface FormErrors {
  [key: string]: string;
}

const AddChannelPartnerPage = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    firmName: "",
    location: "",
    address: "",
    mahareraNo: "",
    pinCode: "",
    photo: "",
    photoFile: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          photo: "Please select a valid image file"
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          photo: "File size must be less than 5MB"
        }));
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photo: previewUrl
      }));

      // Clear any previous errors
      if (errors.photo) {
        setErrors(prev => ({
          ...prev,
          photo: ""
        }));
      }
    }
  };

  const removePhoto = () => {
    if (formData.photo && formData.photo.startsWith('blob:')) {
      URL.revokeObjectURL(formData.photo);
    }
    setFormData(prev => ({
      ...prev,
      photo: "",
      photoFile: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.firmName.trim()) {
      newErrors.firmName = "Firm name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // MAHARERA number is optional

    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN code is required";
    } else if (!/^[0-9]{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Please enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setStatus({ type: "idle" });

    try {
      if (!token) {
        throw new Error("No token found. Please sign in first.");
      }

      // Prepare form data for API
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('phone', formData.phone.trim());
      submitData.append('firmName', formData.firmName.trim());
      submitData.append('location', formData.location.trim());
      submitData.append('address', formData.address.trim());
      submitData.append('mahareraNo', formData.mahareraNo.trim() || 'Not Available');
      submitData.append('pinCode', formData.pinCode.trim());
      
      // Add photo file if available
      if (formData.photoFile) {
        submitData.append('photo', formData.photoFile);
      }

      const response = await fetch(API_ENDPOINTS.CREATE_CHANNEL_PARTNER, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message || `Request failed with ${response.status}`);
      }

      const data = await response.json().catch(() => null);
      setStatus({ type: "success", message: "Channel partner created successfully!" });
      
      // Reset form after success
      if (formData.photo && formData.photo.startsWith('blob:')) {
        URL.revokeObjectURL(formData.photo);
      }
      setFormData({
        name: "",
        phone: "",
        firmName: "",
        location: "",
        address: "",
        mahareraNo: "",
        pinCode: "",
        photo: "",
        photoFile: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/apps/channel-partners");
      }, 2000);

    } catch (err: any) {
      setStatus({ type: "error", message: err?.message || "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          color="gray"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Channel Partner</h1>
          <p className="text-gray-600">Create a new channel partner in your network</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" value="Name *" />
              <TextInput
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                color={errors.name ? "failure" : "gray"}
                helperText={errors.name}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" value="Phone Number *" />
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                color={errors.phone ? "failure" : "gray"}
                helperText={errors.phone}
              />
            </div>

            {/* Firm Name */}
            <div>
              <Label htmlFor="firmName" value="Firm Name *" />
              <TextInput
                id="firmName"
                name="firmName"
                type="text"
                placeholder="Enter firm/company name"
                value={formData.firmName}
                onChange={handleChange}
                color={errors.firmName ? "failure" : "gray"}
                helperText={errors.firmName}
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" value="Location *" />
              <TextInput
                id="location"
                name="location"
                type="text"
                placeholder="Enter city/location"
                value={formData.location}
                onChange={handleChange}
                color={errors.location ? "failure" : "gray"}
                helperText={errors.location}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label htmlFor="address" value="Address *" />
              <TextInput
                id="address"
                name="address"
                type="text"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleChange}
                color={errors.address ? "failure" : "gray"}
                helperText={errors.address}
              />
            </div>

            {/* MAHARERA Number (Optional) */}
            <div>
              <Label htmlFor="mahareraNo" value="MAHARERA Number (Optional)" />
              <TextInput
                id="mahareraNo"
                name="mahareraNo"
                type="text"
                placeholder="Enter MAHARERA registration number"
                value={formData.mahareraNo}
                onChange={handleChange}
                color={errors.mahareraNo ? "failure" : "gray"}
                helperText={errors.mahareraNo}
              />
            </div>

            {/* PIN Code */}
            <div>
              <Label htmlFor="pinCode" value="PIN Code *" />
              <TextInput
                id="pinCode"
                name="pinCode"
                type="text"
                placeholder="Enter 6-digit PIN code"
                value={formData.pinCode}
                onChange={handleChange}
                color={errors.pinCode ? "failure" : "gray"}
                helperText={errors.pinCode}
              />
            </div>

            {/* Photo Upload */}
            <div className="md:col-span-2">
              <Label htmlFor="photo" value="Photo (Optional)" />
              <div className="space-y-4">
                {formData.photo ? (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={formData.photo}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {formData.photoFile ? formData.photoFile.name : "Photo preview"}
                      </p>
                      <Button
                        size="sm"
                        color="failure"
                        onClick={removePhoto}
                        className="mt-2"
                      >
                        <Icon icon="lucide:trash-2" className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-center">
                    <Label
                      htmlFor="photo-upload"
                      className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <Icon
                          icon="lucide:cloud-upload"
                          className="w-8 h-8 text-gray-400 mb-2"
                        />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <FileInput
                        id="photo-upload"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </Label>
                  </div>
                )}
                {errors.photo && (
                  <p className="text-sm text-red-600">{errors.photo}</p>
                )}
                {!formData.photo && !errors.photo && (
                  <p className="text-xs text-gray-500">
                    You can add a photo later by editing the channel partner
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              color="gray"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="orange"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                  Create Channel Partner
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddChannelPartnerPage;

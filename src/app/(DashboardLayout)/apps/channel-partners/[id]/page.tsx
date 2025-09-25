"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Badge, Alert, Modal } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import PermissionGate from "@/app/components/auth/PermissionGate";

interface ChannelPartner {
  _id: string;
  name: string;
  phone: string;
  firmName: string;
  location: string;
  address: string;
  mahareraNo: string;
  pinCode: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

const ChannelPartnerDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [channelPartner, setChannelPartner] = useState<ChannelPartner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const partnerId = params.id as string;

  // Fetch channel partner data
  useEffect(() => {
    if (token && partnerId) {
      fetchChannelPartner();
    }
  }, [token, partnerId]);

  const fetchChannelPartner = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.CHANNEL_PARTNER_BY_ID(partnerId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch channel partner: ${response.status}`);
      }

      const data = await response.json();
      const partner = data.channelPartner || data;
      setChannelPartner(partner);
    } catch (err: any) {
      console.error("Error fetching channel partner:", err);
      setError(err.message || "Failed to fetch channel partner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!channelPartner) return;

    try {
      setIsDeleting(true);
      const response = await fetch(API_ENDPOINTS.DELETE_CHANNEL_PARTNER(channelPartner._id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete channel partner: ${response.status}`);
      }

      // Redirect to channel partners list
      router.push("/apps/channel-partners");
    } catch (err: any) {
      console.error("Error deleting channel partner:", err);
      setError(err.message || "Failed to delete channel partner");
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading channel partner...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert color="failure" className="mb-4">
          <Icon icon="lucide:alert-circle" className="w-4 h-4" />
          <span className="ml-2">{error}</span>
        </Alert>
        <Button
          color="gray"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (!channelPartner) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Icon icon="lucide:user-x" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Channel Partner Not Found</h3>
          <p className="text-gray-600 mb-4">The channel partner you're looking for doesn't exist.</p>
          <Button
            color="orange"
            onClick={() => router.push("/apps/channel-partners")}
            className="flex items-center gap-2"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            Back to Channel Partners
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
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
            <h1 className="text-2xl font-bold text-gray-900">{channelPartner.name}</h1>
            <p className="text-gray-600">Channel Partner Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PermissionGate permissions={["channel-partner:update", "channel-partners:update"]}>
            <Button
              color="blue"
              onClick={() => router.push(`/apps/channel-partners/edit/${channelPartner._id}`)}
              className="flex items-center gap-2"
            >
              <Icon icon="lucide:edit" className="w-4 h-4" />
              Edit
            </Button>
          </PermissionGate>
          <PermissionGate permissions={["channel-partner:delete", "channel-partners:delete"]}>
            <Button
              color="failure"
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Icon icon="lucide:trash-2" className="w-4 h-4" />
              Delete
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="text-center">
            <div className="flex flex-col items-center">
              {channelPartner.photo ? (
                <img
                  src={`http://localhost:5000/api/channel-partner/${channelPartner._id}/photo`}
                  alt={channelPartner.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-orange-100"
                />
              ) : (
                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4 border-4 border-orange-200">
                  <Icon icon="lucide:user" className="w-12 h-12 text-orange-600" />
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-2">{channelPartner.name}</h2>
              <Badge 
                color={channelPartner.isActive ? 'success' : 'failure'} 
                size="lg"
                className="mb-4"
              >
                {channelPartner.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <p className="text-gray-600 text-sm">
                Member since {formatDate(channelPartner.createdAt)}
              </p>
            </div>
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon icon="lucide:phone" className="w-4 h-4 text-gray-400" />
                    {channelPartner.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon icon="lucide:map-pin" className="w-4 h-4 text-gray-400" />
                    {channelPartner.location}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Firm Name</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Icon icon="lucide:building" className="w-4 h-4 text-gray-400" />
                  {channelPartner.firmName}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <p className="text-gray-900 flex items-start gap-2">
                  <Icon icon="lucide:home" className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="flex-1">{channelPartner.address}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">MAHARERA Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon icon="lucide:file-text" className="w-4 h-4 text-gray-400" />
                    {channelPartner.mahareraNo || 'Not Available'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">PIN Code</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon icon="lucide:hash" className="w-4 h-4 text-gray-400" />
                    {channelPartner.pinCode}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon icon="lucide:calendar-plus" className="w-4 h-4 text-gray-400" />
                    {formatDate(channelPartner.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Icon icon="lucide:calendar-edit" className="w-4 h-4 text-gray-400" />
                    {formatDate(channelPartner.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Header>Delete Channel Partner</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Icon icon="lucide:alert-triangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to delete this channel partner?
            </h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete{" "}
              <strong>{channelPartner.name}</strong> and all associated data.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button color="failure" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete Channel Partner'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChannelPartnerDetailsPage;


"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Table, Badge, Modal, Alert } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";

interface LeadStatus {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const LeadStatusesPage = () => {
  const router = useRouter();
  const { token, user, userPermissions } = useAuth();
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch lead statuses
  useEffect(() => {
    if (token) {
      fetchLeadStatuses();
    }
  }, [token]);

  const fetchLeadStatuses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = API_ENDPOINTS.LEAD_STATUSES;
      console.log('Fetching lead statuses from:', apiUrl);
      console.log('Token present:', !!token);
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token');
      console.log('User permissions:', userPermissions);
      console.log('User role:', user?.role);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      console.log('Backend response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        console.error('Error details:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`Failed to fetch lead statuses: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Backend data received:', data);
      const statuses = data.leadStatuses || data || [];
      setLeadStatuses(statuses);
    } catch (err: any) {
      console.error("Error fetching lead statuses:", err);
      setError(err.message || "Failed to fetch lead statuses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (status: LeadStatus) => {
    setSelectedStatus(status);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStatus) return;

    try {
      setIsDeleting(true);
      const response = await fetch(API_ENDPOINTS.DELETE_LEAD_STATUS(selectedStatus._id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete lead status: ${response.status}`);
      }

      // Remove from local state
      setLeadStatuses(prev => prev.filter(s => s._id !== selectedStatus._id));
      setDeleteModalOpen(false);
      setSelectedStatus(null);
      setError(null);
    } catch (err: any) {
      console.error("Error deleting lead status:", err);
      setError(err.message || "Failed to delete lead status");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead statuses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Statuses</h1>
          <p className="text-gray-600">Manage lead status categories</p>
        </div>
        <Button
          color="orange"
          onClick={() => router.push('/apps/lead-statuses/add')}
          className="flex items-center gap-2"
        >
          <Icon icon="lucide:plus" className="w-4 h-4" />
          Add Lead Status
        </Button>
      </div>

      {error && (
        <Alert color="failure" className="mb-4">
          <Icon icon="lucide:alert-circle" className="w-4 h-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}

      <Card>
        {leadStatuses.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="lucide:flag" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Lead Statuses</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first lead status.</p>
            <Button
              color="orange"
              onClick={() => router.push('/apps/lead-statuses/add')}
              className="flex items-center gap-2"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              Add Lead Status
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Color</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Created</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {leadStatuses.map((status) => (
                  <Table.Row key={status._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {status.name}
                    </Table.Cell>
                    <Table.Cell>{status.description || 'N/A'}</Table.Cell>
                    <Table.Cell>
                      {status.color && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border" 
                            style={{ backgroundColor: status.color }}
                          ></div>
                          <span className="text-sm text-gray-600">{status.color}</span>
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={status.isActive ? 'success' : 'failure'} 
                        size="sm"
                      >
                        {status.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{formatDate(status.createdAt)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          color="gray"
                          onClick={() => router.push(`/apps/lead-statuses/${status._id}`)}
                          title="View Details"
                        >
                          <Icon icon="lucide:eye" className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          color="blue"
                          onClick={() => router.push(`/apps/lead-statuses/edit/${status._id}`)}
                          title="Edit"
                        >
                          <Icon icon="lucide:edit" className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          color="failure"
                          onClick={() => handleDelete(status)}
                          title="Delete"
                        >
                          <Icon icon="lucide:trash-2" className="w-3 h-3" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Modal.Header>Delete Lead Status</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Icon icon="lucide:alert-triangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to delete this lead status?
            </h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete{" "}
              <strong>{selectedStatus?.name}</strong> and all associated data.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button color="failure" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              'Delete Lead Status'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeadStatusesPage;

"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Badge, Alert, TextInput, Label, Textarea, Card } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/app/utils/api/endpoints";

interface LeadSource {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

const LeadSourcesManager = () => {
  const { token } = useAuth();
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState<LeadSource | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (token) {
      fetchLeadSources();
    }
  }, [token]);

  const fetchLeadSources = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.LEAD_SOURCES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        const sourcesArray = data.leadSources || data || [];
        setLeadSources(Array.isArray(sourcesArray) ? sourcesArray : []);
        setError(null);
      } else {
        setError(`Failed to fetch lead sources: ${response.status} ${response.statusText}`);
        setLeadSources([]);
      }
    } catch (err) {
      setError("Network error: Failed to fetch lead sources. Please check your connection.");
      console.error("Error fetching lead sources:", err);
      setLeadSources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setAlertMessage({ type: 'error', message: 'Please enter a lead source name' });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (editingSource) {
        // Update existing lead source
        const response = await fetch(API_ENDPOINTS.UPDATE_LEAD_SOURCE(editingSource._id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            isActive: formData.isActive
          }),
        });

        if (response.ok) {
          setAlertMessage({ type: 'success', message: 'Lead source updated successfully!' });
          fetchLeadSources();
        } else {
          let errorMessage = 'Failed to update lead source';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            errorMessage = `Update failed: ${response.status} ${response.statusText}`;
          }
          setAlertMessage({ type: 'error', message: errorMessage });
        }
      } else {
        // Create new lead source
        const response = await fetch(API_ENDPOINTS.CREATE_LEAD_SOURCE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            isActive: formData.isActive
          }),
        });

        if (response.ok) {
          setAlertMessage({ type: 'success', message: 'Lead source created successfully!' });
          fetchLeadSources();
        } else {
          let errorMessage = 'Failed to create lead source';
          try {
            const responseText = await response.text();
            try {
              const errorData = JSON.parse(responseText);
              errorMessage = errorData.message || errorData.error || errorData.details || errorMessage;
            } catch (parseError) {
              errorMessage = responseText || `Creation failed: ${response.status} ${response.statusText}`;
            }
          } catch (textError) {
            errorMessage = `Creation failed: ${response.status} ${response.statusText}`;
          }
          
          setAlertMessage({ 
            type: 'error', 
            message: `Lead source creation failed (${response.status}): ${errorMessage}` 
          });
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving lead source:", error);
      setAlertMessage({ type: 'error', message: 'Network error: Failed to save lead source. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead source?")) return;

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_LEAD_SOURCE(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Lead source deleted successfully!' });
        fetchLeadSources();
      } else {
        let errorMessage = 'Failed to delete lead source';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          errorMessage = `Delete failed: ${response.status} ${response.statusText}`;
        }
        setAlertMessage({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error("Error deleting lead source:", error);
      setAlertMessage({ type: 'error', message: 'Network error: Failed to delete lead source. Please check your connection.' });
    }
  };

  const handleEdit = (source: LeadSource) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      description: source.description || "",
      isActive: source.isActive !== undefined ? source.isActive : true,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSource(null);
    setFormData({ name: "", description: "", isActive: true });
  };

  const handleAddNew = () => {
    setEditingSource(null);
    setFormData({ name: "", description: "", isActive: true });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Lead Sources Management</h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Manage your lead sources and track where your leads come from
          </p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto lg:ml-auto">
          <Button onClick={handleAddNew} color="primary" className="w-full lg:w-auto">
            <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
            Add New Source
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {alertMessage && (
        <Alert
          color={alertMessage.type === 'success' ? 'success' : 'failure'}
          onDismiss={() => setAlertMessage(null)}
        >
          {alertMessage.message}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert color="failure" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Card */}
      <Card className="p-6">
        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {leadSources.length}
          </div>
          <div className="text-base text-gray-600 dark:text-gray-400 font-medium">
            Total Lead Sources
          </div>
        </div>
      </Card>

      {/* Lead Sources Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell className="min-w-[150px]">Name</Table.HeadCell>
              <Table.HeadCell className="min-w-[200px]">Description</Table.HeadCell>
              <Table.HeadCell className="min-w-[100px]">Status</Table.HeadCell>
              <Table.HeadCell className="min-w-[120px]">Created</Table.HeadCell>
              <Table.HeadCell className="min-w-[150px]">Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {leadSources.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Icon icon="solar:info-circle-line-duotone" className="mx-auto text-4xl mb-2" />
                      <p>No lead sources found</p>
                      <p className="text-sm">Create your first lead source to get started</p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                leadSources.map((source) => (
                  <Table.Row key={source._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {source.name}
                    </Table.Cell>
                    <Table.Cell className="text-gray-600 dark:text-gray-400">
                      {source.description || "No description"}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={source.isActive !== false ? "success" : "failure"} size="sm">
                        {source.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {source.createdAt ? new Date(source.createdAt).toLocaleDateString() : 'N/A'}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="xs"
                          color="info"
                          onClick={() => handleEdit(source)}
                          className="text-xs"
                        >
                          <Icon icon="solar:pen-line-duotone" className="mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => handleDelete(source._id)}
                          className="text-xs"
                        >
                          <Icon icon="solar:trash-bin-trash-line-duotone" className="mr-1" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onClose={handleCloseModal} size="lg">
        <Modal.Header>
          {editingSource ? 'Edit Lead Source' : 'Add New Lead Source'}
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" value="Name *" />
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter lead source name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description" value="Description" />
                <Textarea
                  id="description"
                  placeholder="Enter description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="isActive" value="Active" />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Icon icon="solar:check-circle-line-duotone" className="mr-2" />
              )}
              {editingSource ? 'Update' : 'Create'}
            </Button>
            <Button color="gray" onClick={handleCloseModal} className="w-full sm:w-auto">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default LeadSourcesManager;
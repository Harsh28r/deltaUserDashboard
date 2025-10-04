"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Badge, Alert } from "flowbite-react";
import { Icon } from "@iconify/react";
import { ApiService } from "@/app/utils/api/endpoints";
import { useAuth } from "@/app/context/AuthContext";
import { useWebSocket } from "@/app/context/WebSocketContext";
import { toast } from "@/hooks/use-toast";
import WebSocketStatus from "@/app/components/WebSocketStatus";

interface LeadStatus {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const LeadStatusesManager = () => {
  const { user, projectAccess } = useAuth();
  const { socket, connected } = useWebSocket();
  
  // Check permissions for lead status management
  const isSuperAdmin = user?.role === 'superadmin' || user?.role === 'admin';
  const hasLeadStatusPermission = user?.permissions?.allowed?.includes('lead-status:write') || 
                                 user?.permissions?.allowed?.includes('lead-status:manage');
  const canManageLeadStatuses = isSuperAdmin || (projectAccess?.canAccessAll === true) || hasLeadStatusPermission;
  
  // Debug logging
  console.log('LeadStatusesManager - Debug:', {
    user: user,
    userRole: user?.role,
    isSuperAdmin,
    projectAccess,
    canManageLeadStatuses
  });
  
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<LeadStatus | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    isActive: true,
  });

  const colorOptions = [
    { value: "#3B82F6", label: "Blue", class: "bg-blue-500" },
    { value: "#10B981", label: "Green", class: "bg-green-500" },
    { value: "#F59E0B", label: "Yellow", class: "bg-yellow-500" },
    { value: "#EF4444", label: "Red", class: "bg-red-500" },
    { value: "#8B5CF6", label: "Purple", class: "bg-purple-500" },
    { value: "#06B6D4", label: "Cyan", class: "bg-cyan-500" },
  ];

  useEffect(() => {
    fetchLeadStatuses();
  }, []);

  // WebSocket event listeners for real-time lead status updates
  useEffect(() => {
    if (!socket) return;

    const handleLeadStatusCreated = (data: { leadStatus: LeadStatus; createdBy: { _id: string; name: string } }) => {
      console.log('Lead status created:', data);
      setLeadStatuses(prev => [data.leadStatus, ...prev]);
      toast({
        title: "New Lead Status",
        description: `${data.createdBy.name} created a new lead status: ${data.leadStatus.name}`,
      });
    };

    const handleLeadStatusUpdated = (data: { leadStatus: LeadStatus; updatedBy: { _id: string; name: string } }) => {
      console.log('Lead status updated:', data);
      setLeadStatuses(prev => prev.map(ls => ls.id === data.leadStatus.id ? data.leadStatus : ls));
      toast({
        title: "Lead Status Updated",
        description: `${data.updatedBy.name} updated lead status: ${data.leadStatus.name}`,
      });
    };

    const handleLeadStatusDeleted = (data: { leadStatusId: string; deletedBy: { _id: string; name: string } }) => {
      console.log('Lead status deleted:', data);
      setLeadStatuses(prev => prev.filter(ls => ls.id !== data.leadStatusId));
      toast({
        title: "Lead Status Deleted",
        description: `${data.deletedBy.name} deleted a lead status`,
      });
    };

    // Register event listeners
    socket.on('lead-status-created', handleLeadStatusCreated);
    socket.on('lead-status-updated', handleLeadStatusUpdated);
    socket.on('lead-status-deleted', handleLeadStatusDeleted);

    // Cleanup
    return () => {
      socket.off('lead-status-created', handleLeadStatusCreated);
      socket.off('lead-status-updated', handleLeadStatusUpdated);
      socket.off('lead-status-deleted', handleLeadStatusDeleted);
    };
  }, [socket]);

  const fetchLeadStatuses = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getLeadStatuses();
      
      // Debug logging to see API response structure
      console.log('Lead Statuses API Response:', response);
      
      // Ensure we have an array
      setLeadStatuses(Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch lead statuses");
      console.error("Error fetching lead statuses:", err);
      // Set empty array on error to prevent map errors
      setLeadStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStatus) {
        await ApiService.updateLeadStatus(editingStatus.id, formData);
      } else {
        await ApiService.createLeadStatus(formData);
      }
      setShowModal(false);
      setEditingStatus(null);
      setFormData({ name: "", description: "", color: "#3B82F6", isActive: true });
      fetchLeadStatuses();
    } catch (err) {
      setError("Failed to save lead status");
      console.error("Error saving lead status:", err);
    }
  };

  const handleEdit = (status: LeadStatus) => {
    setEditingStatus(status);
    setFormData({
      name: status.name,
      description: status.description || "",
      color: status.color,
      isActive: status.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead status?")) {
      try {
        await ApiService.deleteLeadStatus(id);
        fetchLeadStatuses();
      } catch (err) {
        setError("Failed to delete lead status");
        console.error("Error deleting lead status:", err);
      }
    }
  };

  const openModal = () => {
    setEditingStatus(null);
    setFormData({ name: "", description: "", color: "#3B82F6", isActive: true });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading lead statuses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Statuses</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your lead statuses and pipeline stages</p>
          {/* Debug info - remove in production */}
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            <strong>Debug:</strong> canManageLeadStatuses = {(canManageLeadStatuses ?? false).toString()}, 
            isSuperAdmin = {isSuperAdmin.toString()}, 
            userRole = {user?.role || 'undefined'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <WebSocketStatus size="sm" />
          {canManageLeadStatuses && (
            <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
              <Icon icon="solar:add-circle-line-duotone" className="mr-2" height={20} />
              Add Lead Status
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
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
             {Array.isArray(leadStatuses) ? leadStatuses.map((status) => (
              <Table.Row key={status.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {status.name}
                </Table.Cell>
                <Table.Cell className="text-gray-600 dark:text-gray-400">
                  {status.description || "No description"}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {colorOptions.find(c => c.value === status.color)?.label || "Custom"}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Badge color={status.isActive ? "success" : "failure"}>
                    {status.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-gray-600 dark:text-gray-400">
                  {new Date(status.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    {canManageLeadStatuses && (
                      <>
                        <Button
                          size="sm"
                          color="blue"
                          onClick={() => handleEdit(status)}
                        >
                          <Icon icon="solar:pen-line-duotone" height={16} />
                        </Button>
                        <Button
                          size="sm"
                          color="failure"
                          onClick={() => handleDelete(status.id)}
                        >
                          <Icon icon="solar:trash-bin-minimalistic-line-duotone" height={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </Table.Cell>
                             </Table.Row>
             )) : null}
           </Table.Body>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          {editingStatus ? "Edit Lead Status" : "Add New Lead Status"}
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter lead status name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`p-2 rounded-md border-2 ${
                        formData.color === color.value 
                          ? 'border-blue-500' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className={`w-full h-6 rounded ${color.class}`}></div>
                      <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                        {color.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingStatus ? "Update" : "Create"}
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default LeadStatusesManager;


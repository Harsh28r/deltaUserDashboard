
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Button, Card, Badge, Alert, Modal, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useLeadPermissions } from "@/hooks/use-permissions";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import { useWebSocket } from "@/app/context/WebSocketContext";
import { API_BASE_URL } from "@/lib/config";
import { useParams, useRouter } from "next/navigation";
import { LeadFormData, StatusFormData, AlertMessage, FormField } from "../types";
import { useLeadDetails } from "../hooks/useLeadDetails";
import { useLeadData } from "../hooks/useLeadData";
import LeadOverview from "../components/LeadOverview";
import LeadInfo from "../components/LeadInfo";
import ActivityTimeline from "../components/ActivityTimeline";
import StatusHistory from "../components/StatusHistory";
import EditLeadModal from "../components/EditLeadModal";
import WebSocketStatus from "@/app/components/WebSocketStatus";
import { toast } from "@/hooks/use-toast";
import DateTimePicker from "../components/DateTimePicker";

const LeadDetailPage = () => {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // Custom hooks for data fetching
  const { lead, activities, isLoading, alertMessage, setAlertMessage, refreshLead } = useLeadDetails(leadId);
  const { leadStatuses, leadSources, projects, users, channelPartners, cpSourcingOptions } = useLeadData();
  const { canUpdateLeadStatus } = useLeadPermissions();
  
  // WebSocket integration
  const { socket, connected, subscribeToLeads, unsubscribeFromLeads } = useWebSocket();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [statusDynamicFields, setStatusDynamicFields] = useState<Record<string, any>>({});

  // Form data
  const [statusFormData, setStatusFormData] = useState<StatusFormData>({
    newStatus: '',
    statusRemark: ''
  });

  // WebSocket subscription
  useEffect(() => {
    if (connected) {
      subscribeToLeads();
    }

    return () => {
      if (connected) {
        unsubscribeFromLeads();
      }
    };
  }, [connected, subscribeToLeads, unsubscribeFromLeads]);

  // Listen for WebSocket events for real-time updates
  useEffect(() => {
    if (!socket || !leadId) return;

    const handleLeadUpdated = (data: { lead: any; updatedBy: { _id: string; name: string } }) => {
      console.log('Lead updated via WebSocket:', data);
      // Only refresh if this is the current lead being viewed
      if (data.lead._id === leadId) {
        refreshLead();
        toast({
          title: "Lead Updated",
          description: `${data.updatedBy.name} updated this lead`,
        });
      }
    };

    const handleLeadStatusChanged = (data: { lead: any; changedBy: { _id: string; name: string } }) => {
      console.log('Lead status changed via WebSocket:', data);
      // Only refresh if this is the current lead being viewed
      if (data.lead._id === leadId) {
        refreshLead();
        toast({
          title: "Status Changed",
          description: `${data.changedBy.name} changed the status of this lead`,
        });
      }
    };

    const handleLeadAssigned = (data: { lead: any; assignedBy: { _id: string; name: string } }) => {
      console.log('Lead assigned via WebSocket:', data);
      // Only refresh if this is the current lead being viewed
      if (data.lead._id === leadId) {
        refreshLead();
        toast({
          title: "Lead Assigned",
          description: `${data.assignedBy.name} assigned this lead`,
        });
      }
    };

    const handleLeadDeleted = (data: { leadId: string; deletedBy: { _id: string; name: string } }) => {
      console.log('Lead deleted via WebSocket:', data);
      // If this lead was deleted, redirect to leads list
      if (data.leadId === leadId) {
        toast({
          title: "Lead Deleted",
          description: `${data.deletedBy.name} deleted this lead`,
          variant: "destructive",
        });
        setTimeout(() => {
          router.push('/apps/leads');
        }, 2000);
      }
    };

    // Register event listeners
    socket.on('lead-updated', handleLeadUpdated);
    socket.on('lead-status-changed', handleLeadStatusChanged);
    socket.on('lead-assigned', handleLeadAssigned);
    socket.on('lead-deleted', handleLeadDeleted);

    // Cleanup
    return () => {
      socket.off('lead-updated', handleLeadUpdated);
      socket.off('lead-status-changed', handleLeadStatusChanged);
      socket.off('lead-assigned', handleLeadAssigned);
      socket.off('lead-deleted', handleLeadDeleted);
    };
  }, [socket, leadId, refreshLead, router]);

  const handleEditLead = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const getFieldsForStatus = (statusId: string) => {
    const st = leadStatuses.find(s => s._id === statusId) as any;
    return (st?.formFields || []) as FormField[];
  };

  const handleStatusChange = useCallback(() => {
    if (lead) {
      const currentId = lead.currentStatus?._id || '';
      setStatusFormData({ newStatus: currentId, statusRemark: '' });
      setSelectedStatusId(currentId);
      const fields = getFieldsForStatus(currentId);
      const initialValues: Record<string, any> = {};
      fields.forEach((f) => { initialValues[f.name] = lead.customData?.[f.name] || ''; });
      setStatusDynamicFields(initialValues);
    }
    setIsStatusModalOpen(true);
  }, [lead, leadStatuses]);

  const handleCloseStatusModal = useCallback(() => {
    setIsStatusModalOpen(false);
    setStatusFormData({
      newStatus: lead?.currentStatus?._id || '',
      statusRemark: ''
    });
  }, [lead]);

  const handleEditSubmit = useCallback(async (formData: LeadFormData) => {
    if (!lead || !token) return;

    try {
      setIsSubmitting(true);

      // Prepare custom data including status-specific fields
      const customData: any = {
        "First Name": formData.firstName,
        "Email": formData.email,
        "Phone": formData.phone,
        "Notes": formData.notes,
        "Lead Priority": formData.leadPriority,
        "Property Type": formData.propertyType,
        "Configuration": formData.configuration,
        "Funding Mode": formData.fundingMode,
        "Gender": formData.gender,
        "Budget": formData.budget
      };

      // Add status-specific fields to customData
      if (lead.currentStatus?.formFields) {
        lead.currentStatus.formFields.forEach((field) => {
          const fieldValue = formData[field.name as keyof typeof formData] || '';
          customData[field.name] = fieldValue;
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/leads/${lead._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project: formData.project,
          leadSource: formData.leadSource,
          customData: customData
        }),
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Lead details updated successfully!' });
        setIsEditModalOpen(false);
        refreshLead();
      } else {
        const errorData = await response.json();
        setAlertMessage({
          type: 'error',
          message: errorData.message || `Failed to update lead: ${response.status}`
        });
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      setAlertMessage({
        type: 'error',
        message: 'Network error: Failed to update lead. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [lead, token, refreshLead, setAlertMessage]);

  const handleStatusUpdate = useCallback(async () => {
    if (!lead || !selectedStatusId || !token) return;

    try {
      setIsSubmitting(true);
      
      // Start with all existing customData to preserve all fields
      const existingData = { ...(lead.customData || {}) };
      
      // Add status-specific dynamic fields (these can override existing values)
      getFieldsForStatus(selectedStatusId).forEach((f) => {
        const value = statusDynamicFields[f.name];
        if (value !== undefined && value !== null) {
          existingData[f.name] = value;
        }
      });
      
      // Add the remark
      existingData['Remark'] = statusFormData.statusRemark || 'Status updated';

      const response = await fetch(`${API_BASE_URL}/api/leads/${lead._id}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStatus: selectedStatusId,
          newData: existingData
        }),
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Lead status updated successfully!' });
        setIsStatusModalOpen(false);
        refreshLead();
      } else {
        const errorData = await response.json();
        setAlertMessage({
          type: 'error',
          message: errorData.message || `Failed to update lead status: ${response.status}`
        });
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
      setAlertMessage({
        type: 'error',
        message: 'Network error: Failed to update lead status. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [lead, selectedStatusId, statusDynamicFields, statusFormData, token, refreshLead, setAlertMessage, leadStatuses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">Loading lead details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Lead Not Found</h1>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
              The requested lead could not be found.
            </p>
          </div>
        </div>
        <Card>
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              <Icon icon="solar:info-circle-line-duotone" className="mx-auto text-4xl mb-4" />
              <p className="text-lg font-medium mb-2">Lead Not Found</p>
              <p className="text-sm mb-4">
                The lead you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button color="primary" onClick={() => router.push('/apps/leads')}>
                <Icon icon="solar:arrow-left-line-duotone" className="mr-2" />
                Back to Leads
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <button
          onClick={() => router.push('/apps/leads')}
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Leads
        </button>
        <Icon icon="solar:arrow-right-line-duotone" className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white font-medium">
          {(() => {
            const cd = lead.customData || {};
            const firstName = cd["First Name"] || cd.name || cd.firstName || '';
            const lastName = cd["Last Name"] || cd.lastName || '';
            return firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Lead Details';
          })()}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Button
              color="gray"
              size="sm"
              onClick={() => router.push('/apps/leads')}
              className="flex items-center gap-2"
            >
              <Icon icon="solar:arrow-left-line-duotone" />
              Back
            </Button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Lead Details
            </h1>
            <Badge color="blue" size="sm">
              ID: {lead._id.slice(-8)}
            </Badge>
          </div>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
            Complete information and activity history for this lead
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WebSocketStatus size="sm" />
          <Button
            color="gray"
            onClick={() => router.push('/apps/leads')}
            className="flex items-center gap-2"
          >
            <Icon icon="solar:list-line-duotone" />
            All Leads
          </Button>
          {canUpdateLeadStatus && (
          <Button
              color="blue"
              onClick={handleStatusChange}
            className="flex items-center gap-2"
          >
              <Icon icon="solar:check-circle-line-duotone" />
              Change Status
          </Button>
          )}
          <Button
            color="success"
            onClick={() => {/* Add call functionality */ }}
            className="flex items-center gap-2"
          >
            <Icon icon="solar:phone-line-duotone" />
            Call
          </Button>
          <Button
            color="warning"
            onClick={() => {/* Add email functionality */ }}
            className="flex items-center gap-2"
          >
            <Icon icon="solar:letter-unread-line-duotone" />
            Email
          </Button>
        </div>
      </div>

      {/* Alert Messages */}
      {alertMessage && (
        <Alert
          color={alertMessage.type === 'success' ? 'success' : alertMessage.type === 'info' ? 'info' : 'failure'}
          onDismiss={() => setAlertMessage(null)}
        >
          {alertMessage.message}
        </Alert>
      )}

      {/* Lead Overview */}
      <LeadOverview
        lead={lead}
        activities={activities}
        channelPartners={channelPartners}
        cpSourcingOptions={cpSourcingOptions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Information */}
        <LeadInfo
          lead={lead}
          channelPartners={channelPartners}
          cpSourcingOptions={cpSourcingOptions}
          onEditLead={handleEditLead}
          onStatusChange={handleStatusChange}
        />

        {/* Activities Timeline */}
        <div className="space-y-6">
          <ActivityTimeline
            activities={activities}
            leadStatuses={leadStatuses}
            projects={projects}
            users={users}
          />

          {/* Lead Analytics */}
          <Card>
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg mr-3">
                <Icon icon="solar:chart-2-line-duotone" className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lead Analytics</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {activities.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Activities</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {lead.statusHistory?.length || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Status Changes</div>
              </div>
            </div>
          </Card>

          {/* Communication History */}
          <Card>
            <div className="flex items-center mb-4">
              <div className="bg-teal-100 dark:bg-teal-900/20 p-2 rounded-lg mr-3">
                <Icon icon="solar:chat-line-duotone" className="text-teal-600 dark:text-teal-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Communication History</h3>
            </div>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Icon icon="solar:chat-line-duotone" className="mx-auto text-3xl text-gray-400 mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No Communications Yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Call, email, or message interactions will appear here
                </p>
                <div className="flex gap-2 justify-center mt-4">
                  <Button size="sm" color="success" onClick={() => {/* Add call functionality */ }}>
                    <Icon icon="solar:phone-line-duotone" className="mr-1" />
                    Log Call
                  </Button>
                  <Button size="sm" color="warning" onClick={() => {/* Add email functionality */ }}>
                    <Icon icon="solar:letter-unread-line-duotone" className="mr-1" />
                    Log Email
                  </Button>
                  <Button size="sm" color="info" onClick={() => {/* Add message functionality */ }}>
                    <Icon icon="solar:chat-round-line-duotone" className="mr-1" />
                    Log Message
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Status History */}
      <StatusHistory lead={lead} />

      {/* Edit Lead Modal */}
      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleEditSubmit}
        lead={lead}
        leadSources={leadSources}
        projects={projects}
        isSubmitting={isSubmitting}
      />

      {/* Status Update Modal */}
      <Modal show={isStatusModalOpen} onClose={handleCloseStatusModal} size="6xl">
        <Modal.Header>Change Lead Status</Modal.Header>
        <form onSubmit={(e) => { e.preventDefault(); handleStatusUpdate(); }}>
          <div className="p-2 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              <Card>
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                    <Icon icon="solar:user-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modal_name" value="Name" />
                    <TextInput id="modal_name" value={(() => {
                      const cd = lead.customData || {};
                      const firstName = cd["First Name"] || cd.name || cd.firstName || '';
                      const lastName = cd["Last Name"] || cd.lastName || '';
                      return `${firstName} ${lastName}`.trim();
                    })()} disabled />
                  </div>
                  <div>
                    <Label htmlFor="modal_email" value="Email" />
                    <TextInput id="modal_email" value={lead.customData?.["Email"] || lead.customData?.email || ''} disabled />
                  </div>
                  <div>
                    <Label htmlFor="modal_phone" value="Phone" />
                    <TextInput id="modal_phone" value={lead.customData?.["Phone"] || lead.customData?.contact || lead.customData?.phone || ''} disabled />
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
                    <Icon icon="solar:chart-line-duotone" className="text-green-600 dark:text-green-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lead Details</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Change status and fill required fields</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="modal_status" value="Lead Status" />
                    <Select id="modal_status" value={selectedStatusId} onChange={(e) => {
                      const next = e.target.value;
                      setSelectedStatusId(next);
                      setStatusFormData(prev => ({ ...prev, newStatus: next }));
                      const fields = getFieldsForStatus(next);
                      const initVals: Record<string, any> = {};
                      fields.forEach((f) => { initVals[f.name] = lead.customData?.[f.name] || ''; });
                      setStatusDynamicFields(initVals);
                    }}>
                      <option value="">Select status</option>
                      {leadStatuses.map((s) => (
                        <option key={s._id} value={s._id}>{s.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Card>

              {selectedStatusId && getFieldsForStatus(selectedStatusId).length > 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-700">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                      <Icon icon="solar:settings-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Required Fields</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">for "{leadStatuses.find(s => s._id === selectedStatusId)?.name}" Status</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getFieldsForStatus(selectedStatusId).map((field: FormField) => (
                      <div key={field._id || field.name} className="space-y-2">
                        <Label htmlFor={`statusField_${field._id || field.name}`} value={`${field.name}${field.required ? ' *' : ''}`} />
                        {field.type === 'select' && field.options && field.options.length > 0 ? (
                          <Select id={`statusField_${field._id || field.name}`} value={statusDynamicFields[field.name] || ''} onChange={(e) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} required={field.required}>
                            <option value="">Select {field.name}</option>
                            {field.options.map((option: any, index: number) => (
                              <option key={index} value={(option as any).value || option as any}>{(option as any).label || option as any}</option>
                            ))}
                          </Select>
                        ) : field.type === 'checkbox' && field.options && field.options.length > 0 ? (
                          <div className="space-y-2">
                            {field.options.map((option: any, index: number) => {
                              const optionValue = (option as any).value || option as any;
                              const currentValues = statusDynamicFields[field.name] || '';
                              const isChecked = Array.isArray(currentValues) ? currentValues.includes(optionValue) : currentValues === optionValue;
                              return (
                                <div key={index} className="flex items-center">
                                  <input type="checkbox" id={`${field._id || field.name}_${index}`} checked={isChecked} onChange={(e) => {
                                    const current = statusDynamicFields[field.name] || '';
                                    let newValues;
                                    if (Array.isArray(current)) {
                                      newValues = e.target.checked ? [...current, optionValue] : current.filter((v: string) => v !== optionValue);
                                    } else {
                                      newValues = e.target.checked ? [optionValue] : [];
                                    }
                                    setStatusDynamicFields(prev => ({ ...prev, [field.name]: newValues }));
                                  }} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                                  <label htmlFor={`${field._id || field.name}_${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">{(option as any).label || option as any}</label>
                                </div>
                              );
                            })}
                          </div>
                        ) : field.type === 'textarea' ? (
                          <Textarea id={`statusField_${field._id || field.name}`} value={statusDynamicFields[field.name] || ''} onChange={(e) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} rows={3} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                        ) : field.type === 'number' ? (
                          <TextInput id={`statusField_${field._id || field.name}`} type="number" value={statusDynamicFields[field.name] || ''} onChange={(e) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                        ) : field.type === 'date' ? (
                          <DateTimePicker id={`statusField_${field._id || field.name}`} type="date" value={statusDynamicFields[field.name] || ''} onChange={(value: string) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: value }))} placeholder={`Select ${field.name.toLowerCase()}`} required={field.required} />
                        ) : field.type === 'datetime' ? (
                          <DateTimePicker id={`statusField_${field._id || field.name}`} type="datetime" value={statusDynamicFields[field.name] || ''} onChange={(value: string) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: value }))} placeholder={`Select ${field.name.toLowerCase()}`} required={field.required} />
                        ) : field.type === 'time' ? (
                          <DateTimePicker id={`statusField_${field._id || field.name}`} type="time" value={statusDynamicFields[field.name] || ''} onChange={(value: string) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: value }))} placeholder={`Select ${field.name.toLowerCase()}`} required={field.required} />
                        ) : field.type === 'email' ? (
                          <TextInput id={`statusField_${field._id || field.name}`} type="email" value={statusDynamicFields[field.name] || ''} onChange={(e) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                        ) : field.type === 'tel' ? (
                          <TextInput id={`statusField_${field._id || field.name}`} type="tel" value={statusDynamicFields[field.name] || ''} onChange={(e) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                        ) : (
                          <TextInput id={`statusField_${field._id || field.name}`} type="text" value={statusDynamicFields[field.name] || ''} onChange={(e) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card>
                <div className="flex items-center mb-6">
                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                    <Icon icon="solar:notes-line-duotone" className="text-gray-600 dark:text-gray-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Notes</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add any additional information about this status change</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal_notes" value="Remark" />
                  <Textarea id="modal_notes" rows={3} placeholder="Enter remark for this status change" value={statusFormData.statusRemark} onChange={(e) => setStatusFormData(prev => ({ ...prev, statusRemark: e.target.value }))} />
                </div>
              </Card>
            </div>
          </div>
          <Modal.Footer>
            <Button color="info" type="submit" disabled={isSubmitting} className="flex items-center gap-2">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Icon icon="solar:check-circle-line-duotone" className="w-4 h-4" />
              )}
              Update Status
            </Button>
            <Button color="gray" onClick={handleCloseStatusModal}>Cancel</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default LeadDetailPage;





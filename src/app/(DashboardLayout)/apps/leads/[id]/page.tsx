
"use client";

import React, { useState, useCallback } from "react";
import { Button, Card, Badge, Alert } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import { useParams, useRouter } from "next/navigation";
import { LeadFormData, StatusFormData, AlertMessage } from "../types";
import { useLeadDetails } from "../hooks/useLeadDetails";
import { useLeadData } from "../hooks/useLeadData";
import LeadOverview from "../components/LeadOverview";
import LeadInfo from "../components/LeadInfo";
import ActivityTimeline from "../components/ActivityTimeline";
import StatusHistory from "../components/StatusHistory";
import EditLeadModal from "../components/EditLeadModal";

const LeadDetailPage = () => {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  // Custom hooks for data fetching
  const { lead, activities, isLoading, alertMessage, setAlertMessage, refreshLead } = useLeadDetails(leadId);
  const { leadStatuses, leadSources, projects, users, channelPartners, cpSourcingOptions } = useLeadData();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [statusFormData, setStatusFormData] = useState<StatusFormData>({
    newStatus: '',
    statusRemark: ''
  });

  const handleEditLead = useCallback(() => {
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleStatusChange = useCallback(() => {
    if (lead) {
      setStatusFormData({
        newStatus: lead.currentStatus?._id || '',
        statusRemark: ''
      });
    }
    setIsStatusModalOpen(true);
  }, [lead]);

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
    if (!lead || !statusFormData.newStatus || !token) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/api/leads/${lead._id}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStatus: statusFormData.newStatus,
          newData: {
            "First Name": lead.customData?.["First Name"] || '',
            "Email": lead.customData?.["Email"] || '',
            "Phone": lead.customData?.["Phone"] || '',
            "Notes": lead.customData?.["Notes"] || '',
            "Lead Priority": lead.customData?.["Lead Priority"] || '',
            "Property Type": lead.customData?.["Property Type"] || '',
            "Configuration": lead.customData?.["Configuration"] || '',
            "Funding Mode": lead.customData?.["Funding Mode"] || '',
            "Gender": lead.customData?.["Gender"] || '',
            "Budget": lead.customData?.["Budget"] || '',
            "Remark": statusFormData.statusRemark || 'Status updated'
          },
          ...Object.keys(lead.customData || {}).reduce((acc, key) => {
            if (!["First Name", "Email", "Phone", "Notes", "Lead Priority", "Property Type", "Configuration", "Funding Mode", "Gender", "Budget", "Remark"].includes(key)) {
              acc[key] = lead.customData?.[key];
            }
            return acc;
          }, {} as any)
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
  }, [lead, statusFormData, token, refreshLead, setAlertMessage]);

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
          {lead.customData?.["First Name"] || ''} {lead.customData?.["Last Name"] || ''}
          {!lead.customData?.["First Name"] && !lead.customData?.["Last Name"] && 'Lead Details'}
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
        <div className="flex gap-2">
          <Button
            color="gray"
            onClick={() => router.push('/apps/leads')}
            className="flex items-center gap-2"
          >
            <Icon icon="solar:list-line-duotone" />
            All Leads
          </Button>
          <Button
            color="info"
            onClick={handleEditLead}
            className="flex items-center gap-2"
          >
            <Icon icon="solar:pen-line-duotone" />
            Edit Lead
          </Button>
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

      {/* Status Update Modal - Simplified for now */}
      {/* You can create a separate StatusUpdateModal component similar to EditLeadModal */}
    </div>
  );
};

export default LeadDetailPage;





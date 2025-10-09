"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Table, Badge, Modal, Alert, Label, Select, TextInput, Textarea, Pagination } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useWebSocket } from "@/app/context/WebSocketContext";
import { API_ENDPOINTS } from "@/lib/config";
import { useLeadData } from "./hooks/useLeadData";
import { FormField } from "./types";
import PermissionGate from "@/app/components/auth/PermissionGate";
import { useLeadPermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/app/types/permissions";
import { toast } from "@/hooks/use-toast";
import WebSocketStatus from "@/app/components/WebSocketStatus";
import DateTimePicker from "./components/DateTimePicker";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  ownerName: string;
  cpSourcingName?: string | null;
}

const LeadsPage = () => {
  const router = useRouter();
  const { token, user, userPermissions } = useAuth();
  const { socket, connected, subscribeToLeads, unsubscribeFromLeads } = useWebSocket();
  const { canUpdateLeadStatus, canCreateLeads } = useLeadPermissions();
  const canCreateLead = canCreateLeads;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { leadStatuses } = useLeadData();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [statusRemark, setStatusRemark] = useState<string>("");
  const [statusDynamicFields, setStatusDynamicFields] = useState<Record<string, any>>({});
  const [selectedLeadFull, setSelectedLeadFull] = useState<any>(null);
  const [isLoadingStatusLead, setIsLoadingStatusLead] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [modalLeadPriority, setModalLeadPriority] = useState<string>("");
  const [modalPropertyType, setModalPropertyType] = useState<string>("");
  const [modalConfiguration, setModalConfiguration] = useState<string>("");
  const [modalFundingMode, setModalFundingMode] = useState<string>("");
  const [modalGender, setModalGender] = useState<string>("");
  const [modalBudget, setModalBudget] = useState<string>("");

  // Fetch leads
  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]);

  // WebSocket subscription and event listeners
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

  const transformLeadData = (leadsData: any[]): Lead[] => {
    return leadsData.map((raw) => {
      const cd = raw.customData || {};
      const nameFromCustom = cd["First Name"] && cd["Last Name"] ? `${cd["First Name"]} ${cd["Last Name"]}` : cd["First Name"] || cd.name || raw.name || "";
      const email = cd["Email"] || cd.email || raw.email || "";
      const phone = cd["Phone"] || cd.contact || raw.phone || "";
      const company = cd["Company"] || raw.company || "";
      const source = raw.leadSource?.name || raw.source || "";
      const status = raw.currentStatus?.name || raw.status || "";
      const notes = cd["Notes"] || raw.notes || "";
      const ownerName = typeof raw.owner === 'object' && raw.owner !== null
        ? (raw.owner.name || raw.owner.fullName || raw.owner.email || '')
        : (raw.owner || raw.user?.name || raw.createdBy?.name || '');
      
      // Handle CP Sourcing - check multiple possible fields
      let cpSourcingName = '';
      
      // First check channelPartner field (main field from backend)
      if (raw.channelPartner && raw.channelPartner.name) {
        cpSourcingName = raw.channelPartner.name;
      }
      // Then check cpSourcingId field
      else if (raw.cpSourcingId && raw.cpSourcingId !== null && raw.cpSourcingId.userId && raw.cpSourcingId.userId.name) {
        cpSourcingName = raw.cpSourcingId.userId.name;
      }
      // Fallback to customData
      else if (raw.customData && raw.customData["Channel Partner Sourcing"]) {
        cpSourcingName = 'Unknown CP User';
      }
      
      return {
        _id: raw._id,
        name: nameFromCustom,
        email,
        phone,
        company,
        source,
        status,
        notes,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        isActive: raw.isActive ?? true,
        ownerName: ownerName || 'N/A',
        cpSourcingName: cpSourcingName || null,
      } as Lead;
    });
  };

  // Listen for WebSocket events
  useEffect(() => {
    if (!socket) return;

    const handleLeadCreated = (data: { lead: any; createdBy: { _id: string; name: string } }) => {
      console.log('Lead created:', data);
      const transformedLead = transformLeadData([data.lead])[0];
      setLeads(prev => [transformedLead, ...prev]);
      toast({
        title: "New Lead",
        description: `${data.createdBy.name} created a new lead: ${transformedLead.name}`,
      });
    };

    const handleLeadUpdated = (data: { lead: any; updatedBy: { _id: string; name: string } }) => {
      console.log('Lead updated:', data);
      const transformedLead = transformLeadData([data.lead])[0];
      setLeads(prev => prev.map(l => l._id === data.lead._id ? transformedLead : l));
      toast({
        title: "Lead Updated",
        description: `${data.updatedBy.name} updated lead: ${transformedLead.name}`,
      });
    };

    const handleLeadDeleted = (data: { leadId: string; deletedBy: { _id: string; name: string } }) => {
      console.log('Lead deleted:', data);
      setLeads(prev => prev.filter(l => l._id !== data.leadId));
      toast({
        title: "Lead Deleted",
        description: `${data.deletedBy.name} deleted a lead`,
      });
    };

    const handleLeadStatusChanged = (data: { lead: any; changedBy: { _id: string; name: string } }) => {
      console.log('Lead status changed:', data);
      const transformedLead = transformLeadData([data.lead])[0];
      setLeads(prev => prev.map(l => l._id === data.lead._id ? transformedLead : l));
      toast({
        title: "Lead Status Changed",
        description: `${data.changedBy.name} changed status of: ${transformedLead.name}`,
      });
    };

    const handleLeadAssigned = (data: { lead: any; assignedBy: { _id: string; name: string } }) => {
      console.log('Lead assigned:', data);
      const transformedLead = transformLeadData([data.lead])[0];
      setLeads(prev => prev.map(l => l._id === data.lead._id ? transformedLead : l));
      toast({
        title: "Lead Assigned",
        description: `${data.assignedBy.name} assigned lead: ${transformedLead.name}`,
      });
    };

    // Register event listeners
    socket.on('lead-created', handleLeadCreated);
    socket.on('lead-updated', handleLeadUpdated);
    socket.on('lead-deleted', handleLeadDeleted);
    socket.on('lead-status-changed', handleLeadStatusChanged);
    socket.on('lead-assigned', handleLeadAssigned);

    // Cleanup
    return () => {
      socket.off('lead-created', handleLeadCreated);
      socket.off('lead-updated', handleLeadUpdated);
      socket.off('lead-deleted', handleLeadDeleted);
      socket.off('lead-status-changed', handleLeadStatusChanged);
      socket.off('lead-assigned', handleLeadAssigned);
    };
  }, [socket]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = API_ENDPOINTS.LEADS();
      console.log('Fetching leads from:', apiUrl);
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
        throw new Error(`Failed to fetch leads: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Backend data received:', data);
      const leadsData = (data.leads || data || []) as any[];
      const mapped = transformLeadData(leadsData);
      setLeads(mapped);
    } catch (err: any) {
      console.error("Error fetching leads:", err);
      setError(err.message || "Failed to fetch leads");
    } finally {
      setIsLoading(false);
    }
  };


  const getFieldsForStatus = (statusId: string) => {
    const st = (leadStatuses || []).find((s: any) => s._id === statusId) as any;
    return (st?.formFields || []) as FormField[];
  };

  const openStatusModal = async (leadId: string) => {
    try {
      setIsLoadingStatusLead(true);
      setSelectedLeadId(leadId);
      // Fetch full lead details to ensure customData and currentStatus are available
      const res = await fetch(API_ENDPOINTS.LEAD_BY_ID(leadId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError(`Failed to load lead details: ${res.status}`);
        return;
      }
      const data = await res.json();
      const fullLead = (data.lead || data) as any;
      setSelectedLeadFull(fullLead);
      setIsStatusModalOpen(true);

      const currentId = fullLead?.currentStatus?._id || '';
      setSelectedStatusId(currentId);

      const fields = getFieldsForStatus(currentId);
      const initVals: Record<string, any> = {};
      fields.forEach((f) => { initVals[f.name] = fullLead?.customData?.[f.name] || ''; });
      setStatusDynamicFields(initVals);
      setStatusRemark('');

      const cd = fullLead?.customData || {};
      setModalLeadPriority(cd["Lead Priority"] || "");
      setModalPropertyType(cd["Property Type"] || "");
      setModalConfiguration(cd["Configuration"] || "");
      setModalFundingMode(cd["Funding Mode"] || "");
      setModalGender(cd["Gender"] || "");
      setModalBudget(cd["Budget"] || "");
    } catch (e) {
      setError('Network error: Failed to load lead details');
    } finally {
      setIsLoadingStatusLead(false);
    }
  };

  const submitStatusUpdate = async () => {
    if (!token || !selectedStatusId) return;
    try {
      setIsSubmittingStatus(true);
      
      // Start with all existing customData to preserve all fields
      const existingData = { ...((selectedLeadFull as any)?.customData || {}) };
      
      // Update or add status-specific dynamic fields
      const fields = getFieldsForStatus(selectedStatusId);
      fields.forEach((f) => {
        const value = statusDynamicFields[f.name];
        if (value !== undefined && value !== null && value !== '') {
          existingData[f.name] = value;
        }
      });
      
      // Update the additional lead information fields if they have values
      if (modalLeadPriority) existingData["Lead Priority"] = modalLeadPriority;
      if (modalPropertyType) existingData["Property Type"] = modalPropertyType;
      if (modalConfiguration) existingData["Configuration"] = modalConfiguration;
      if (modalFundingMode) existingData["Funding Mode"] = modalFundingMode;
      if (modalGender) existingData["Gender"] = modalGender;
      if (modalBudget) existingData["Budget"] = modalBudget;
      
      // Add the remark
      existingData['Remark'] = statusRemark || 'Status updated';
      
      const id = selectedLeadId || ((selectedLeadFull as any)?._id) || '';
      if (!id) {
        setError('Failed to resolve lead id for status update.');
        setIsSubmittingStatus(false);
        return;
      }
      
      const res = await fetch(`${API_ENDPOINTS.LEAD_BY_ID(id)}/status/`, {
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
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || `Failed to update status: ${res.status}`);
        return;
      }
      setIsStatusModalOpen(false);
      setSelectedLeadFull(null);
      await fetchLeads();
    } catch (e: any) {
      setError(e?.message || 'Failed to update status');
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const handleDelete = async (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLead) return;

    try {
      setIsDeleting(true);
      const response = await fetch(API_ENDPOINTS.DELETE_LEAD(selectedLead._id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete lead: ${response.status}`);
      }

      // Remove from local state
      setLeads(prev => prev.filter(l => l._id !== selectedLead._id));
      setDeleteModalOpen(false);
      setSelectedLead(null);
      setError(null);
    } catch (err: any) {
      console.error("Error deleting lead:", err);
      setError(err.message || "Failed to delete lead");
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
          <p className="mt-4 text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage your lead pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <WebSocketStatus size="sm" />
          {canCreateLead && (
            <Button
              color="orange"
              onClick={() => router.push('/apps/leads/add')}
              className="flex items-center gap-2"
            >
              <Icon icon="lucide:plus" className="w-4 h-4" />
              Add Lead
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert color="failure" className="mb-4">
          <Icon icon="lucide:alert-circle" className="w-4 h-4" />
          <span className="ml-2">{error}</span>
        </Alert>
      )}

      <Card>
        {leads.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="lucide:users" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Leads</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first lead.</p>
            {canCreateLead && (
              <Button
                color="orange"
                onClick={() => router.push('/apps/leads/add')}
                className="flex items-center gap-2"
              >
                <Icon icon="lucide:plus" className="w-4 h-4" />
                Add Lead
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Phone</Table.HeadCell>
                <Table.HeadCell>Source</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Owner</Table.HeadCell>
                <Table.HeadCell>CP Sourcing</Table.HeadCell>
                <Table.HeadCell>Created</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {leads.map((lead) => (
                  <Table.Row key={lead._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {lead.name}
                    </Table.Cell>
                    <Table.Cell>{lead.email}</Table.Cell>
                    <Table.Cell>{lead.phone}</Table.Cell>
                    <Table.Cell>
                      <div className="space-y-1">
                        <Badge color="blue" size="sm">
                          {lead.source}
                        </Badge>
                        {lead.cpSourcingName ? (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-medium">Sourced by:</span> {lead.cpSourcingName}
                          </div>
                        ) : lead.source?.toLowerCase().includes('channel partner') ? (
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            <span className="font-medium">No CP user assigned</span>
                          </div>
                        ) : null}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge 
                        color={lead.isActive ? 'success' : 'failure'} 
                        size="sm"
                      >
                        {lead.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{lead.ownerName}</Table.Cell>
                    <Table.Cell>
                      {lead.cpSourcingName ? (
                        <Badge color={lead.cpSourcingName === 'Unknown CP User' ? 'gray' : 'purple'} size="sm">
                          {lead.cpSourcingName}
                        </Badge>
                      ) : lead.source?.toLowerCase().includes('channel partner') ? (
                        <span className="text-gray-400 text-xs italic">Not assigned</span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </Table.Cell>
                    <Table.Cell>{formatDate(lead.createdAt)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <PermissionGate permission={PERMISSIONS.LEAD_READ}>
                          <Button
                            size="sm"
                            color="gray"
                            onClick={() => router.push(`/apps/leads/${lead._id}`)}
                            title="View Details"
                          >
                            <Icon icon="lucide:eye" className="w-3 h-3" />
                          </Button>
                        </PermissionGate>
                        <PermissionGate permission={PERMISSIONS.LEAD_UPDATE}>
                          <Button
                            size="sm"
                            color="blue"
                            onClick={() => router.push(`/apps/leads/edit/${lead._id}`)}
                            title="Edit"
                          >
                            <Icon icon="lucide:edit" className="w-3 h-3" />
                          </Button>
                        </PermissionGate>
                        {canUpdateLeadStatus && (
                          <Button
                            size="sm"
                            color="info"
                            onClick={() => openStatusModal(lead._id)}
                            title="Change Status"
                          >
                            <Icon icon="solar:check-circle-line-duotone" className="w-3 h-3" />
                          </Button>
                        )}
                        <PermissionGate permission={PERMISSIONS.LEAD_DELETE}>
                          <Button
                            size="sm"
                            color="failure"
                            onClick={() => handleDelete(lead)}
                            title="Delete"
                          >
                            <Icon icon="lucide:trash-2" className="w-3 h-3" />
                          </Button>
                        </PermissionGate>
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
        <Modal.Header>Delete Lead</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <Icon icon="lucide:alert-triangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to delete this lead?
            </h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete{" "}
              <strong>{selectedLead?.name}</strong> and all associated data.
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
              'Delete Lead'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Status Modal */}
      <Modal show={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} size="6xl">
        <Modal.Header>Change Lead Status</Modal.Header>
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
                  <TextInput id="modal_name" value={`${selectedLeadFull?.customData?.["First Name"] || selectedLeadFull?.name || ''} ${selectedLeadFull?.customData?.["Last Name"] || ''}`.trim()} disabled />
                </div>
                <div>
                  <Label htmlFor="modal_email" value="Email" />
                  <TextInput id="modal_email" value={selectedLeadFull?.customData?.["Email"] || selectedLeadFull?.email || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="modal_phone" value="Phone" />
                  <TextInput id="modal_phone" value={selectedLeadFull?.customData?.["Phone"] || selectedLeadFull?.phone || ''} disabled />
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
                    if (selectedLeadFull) {
                      const fields = getFieldsForStatus(next);
                      const initVals: Record<string, any> = {};
                      fields.forEach((f) => { initVals[f.name] = selectedLeadFull?.customData?.[f.name] || ''; });
                      setStatusDynamicFields(initVals);
                    }
                  }}>
                    <option value="">Select status</option>
                    {leadStatuses.map((s: any) => (
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">for "{leadStatuses.find((s: any) => s._id === selectedStatusId)?.name}" Status</p>
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
                        <DateTimePicker id={`statusField_${field._id || field.name}`} type="date" value={statusDynamicFields[field.name] || ''} onChange={(value) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: value }))} placeholder={`Select ${field.name.toLowerCase()}`} required={field.required} />
                      ) : field.type === 'datetime' ? (
                        <DateTimePicker id={`statusField_${field._id || field.name}`} type="datetime" value={statusDynamicFields[field.name] || ''} onChange={(value) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: value }))} placeholder={`Select ${field.name.toLowerCase()}`} required={field.required} />
                      ) : field.type === 'time' ? (
                        <DateTimePicker id={`statusField_${field._id || field.name}`} type="time" value={statusDynamicFields[field.name] || ''} onChange={(value) => setStatusDynamicFields(prev => ({ ...prev, [field.name]: value }))} placeholder={`Select ${field.name.toLowerCase()}`} required={field.required} />
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
                <Label htmlFor="statusRemark" value="Remark" />
                <Textarea id="statusRemark" rows={3} placeholder="Enter remark for this status change" value={statusRemark} onChange={(e) => setStatusRemark(e.target.value)} />
              </div>
            </Card>

              {/* Removed Additional Lead Information selects from status modal */}
             <Card>
            <div className="flex items-center mb-6">
              <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg mr-3">
                <Icon icon="solar:settings-line-duotone" className="text-indigo-600 dark:text-indigo-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Lead Information</h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="modal_leadPriority" value="Lead Priority" />
                  <TextInput id="modal_leadPriority" value={selectedLeadFull?.customData?.["Lead Priority"] || ''} disabled className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal_propertyType" value="Property Type" />
                  <TextInput id="modal_propertyType" value={selectedLeadFull?.customData?.["Property Type"] || ''} disabled className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="modal_configuration" value="Configuration" />
                  <TextInput id="modal_configuration" value={selectedLeadFull?.customData?.["Configuration"] || ''} disabled className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal_fundingMode" value="Funding Mode" />
                  <TextInput id="modal_fundingMode" value={selectedLeadFull?.customData?.["Funding Mode"] || ''} disabled className="w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="modal_gender" value="Gender" />
                  <TextInput id="modal_gender" value={selectedLeadFull?.customData?.["Gender"] || ''} disabled className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modal_budget" value="Budget" />
                  <TextInput id="modal_budget" value={selectedLeadFull?.customData?.["Budget"] || ''} disabled className="w-full" />
                </div>
              </div>
            </div>
            </Card>

          </div>
        </div>
        <Modal.Footer>
          <Button color="info" onClick={submitStatusUpdate} disabled={isSubmittingStatus || isLoadingStatusLead} className="flex items-center gap-2">
            {isSubmittingStatus ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Icon icon="solar:check-circle-line-duotone" className="w-4 h-4" />
            )}
            Update Status
          </Button>
          <Button color="gray" onClick={() => setIsStatusModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeadsPage;

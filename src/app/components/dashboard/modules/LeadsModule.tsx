"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Table, Badge, Modal, TextInput, Label, Alert, Select, Textarea, Tabs } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/app/utils/api/endpoints";
import { useSearchParams } from "next/navigation";

interface LeadSource {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormField {
  name: string;
  type: string;
  required: boolean;
}

interface LeadStatus {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  formFields?: FormField[];
  createdAt: string;
  updatedAt: string;
}

interface Lead {
  _id: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  leadSource?: {
    _id: string;
    name: string;
  } | null;
  currentStatus?: {
    _id: string;
    name: string;
  } | null;
  customData: {
    "First Name"?: string;
    "Last Name"?: string;
    "Email"?: string;
    "Phone"?: string;
    "Company"?: string;
    "Notes"?: string;
    [key: string]: any;
  };
  statusHistory: any[];
  createdAt: string;
  updatedAt: string;
  // Computed fields for display
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: string;
  notes?: string;
}

interface Project {
  _id: string;
  name: string;
  description?: string;
}

const LeadsModule = () => {
  const { token, user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("leads");
  
  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "",
    notes: "",
    projectId: "", // Will be empty until user selects
    userId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Lead Sources state
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<LeadSource | null>(null);
  const [sourceFormData, setSourceFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });
  const [isSubmittingSource, setIsSubmittingSource] = useState(false);
  
  // Lead Statuses state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<LeadStatus | null>(null);
  const [statusFormData, setStatusFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    isActive: true,
  });
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  useEffect(() => {
    if (token) {
      fetchData();
      // Fetch leads after a short delay
      setTimeout(() => {
        fetchLeads();
      }, 2000);
    }
  }, [token]);

  // Set userId when user data is available
  useEffect(() => {
    if (user && user.id) {
      setFormData(prev => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  // Set most recent project as default (but user can still edit it)
  useEffect(() => {
    if (projects.length > 0 && !formData.projectId) {
      // Set the most recent project (first in the list) as default
      setFormData(prev => ({ ...prev, projectId: projects[0]._id }));
    }
  }, [projects, formData.projectId]);

  const fetchLeads = async () => {
    if (isLoadingLeads) return;
    
    try {
      setIsLoadingLeads(true);
      const leadsResponse = await fetch(API_ENDPOINTS.LEADS(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (leadsResponse.ok) {
        const leadsData = await leadsResponse.json();
        const leadsArray = leadsData.leads || leadsData || [];
        const transformedLeads = transformLeadData(leadsArray);
        setLeads(transformedLeads);
      } else {
        setLeads([]);
        handleLeadsError(leadsResponse);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLeads([]);
      setAlertMessage({ 
        type: 'error', 
        message: 'Network error: Failed to fetch leads. Please check your connection.' 
      });
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const transformLeadData = (leadsData: any[]): Lead[] => {
    return leadsData.map(lead => ({
      ...lead,
      name: `${lead.customData?.["First Name"] || ''} ${lead.customData?.["Last Name"] || ''}`.trim() || 'N/A',
      email: lead.customData?.["Email"] || 'N/A',
      phone: lead.customData?.["Phone"] || 'N/A',
      company: lead.customData?.["Company"] || 'N/A',
      notes: lead.customData?.["Notes"] || '',
      source: lead.leadSource?._id || 'N/A',
      status: lead.currentStatus?._id || 'N/A'
    }));
  };

  const handleLeadsError = (response: Response) => {
    if (response.status === 429) {
      setAlertMessage({ 
        type: 'error', 
        message: `Rate Limited (429): Too many requests. Please wait a moment and try again.` 
      });
    } else if (response.status === 500) {
      setAlertMessage({ 
        type: 'error', 
        message: `Backend Error (500): The leads API is experiencing issues. Please try again later or contact support.` 
      });
    } else if (response.status === 404) {
      setAlertMessage({ 
        type: 'error', 
        message: `API Endpoint Not Found (404): The leads API endpoint may not be implemented yet on the backend.` 
      });
    } else if (response.status === 401) {
      setAlertMessage({ 
        type: 'error', 
        message: `Unauthorized (401): Please check your authentication token.` 
      });
    } else {
      setAlertMessage({ 
        type: 'error', 
        message: `Failed to fetch leads: ${response.status} ${response.statusText}` 
      });
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch projects
      const projectsResponse = await fetch(API_ENDPOINTS.PROJECTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        const projectsList = projectsData.projects || projectsData || [];
        setProjects(projectsList);
        
        if (projectsList.length === 0) {
          setAlertMessage({ 
            type: 'error', 
            message: 'No projects found. Please create a project first before managing leads.' 
          });
        }
      } else {
        console.error("Failed to fetch projects:", projectsResponse.statusText);
        setAlertMessage({ 
          type: 'error', 
          message: `Failed to fetch projects: ${projectsResponse.status} ${projectsResponse.statusText}` 
        });
      }
      
      // Fetch lead sources
      const sourcesResponse = await fetch(API_ENDPOINTS.LEAD_SOURCES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (sourcesResponse.ok) {
        const sourcesData = await sourcesResponse.json();
        setLeadSources(sourcesData.leadSources || sourcesData || []);
      }

      // Fetch lead statuses
      const statusesResponse = await fetch(API_ENDPOINTS.LEAD_STATUSES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statusesResponse.ok) {
        const statusesData = await statusesResponse.json();
        setLeadStatuses(statusesData.leadStatuses || statusesData || []);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlertMessage({ type: 'error', message: 'Failed to fetch data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      setAlertMessage({ 
        type: 'error', 
        message: 'Please enter a lead name' 
      });
      return;
    }
    
    if (!formData.source) {
      setAlertMessage({ 
        type: 'error', 
        message: 'Please select a lead source' 
      });
      return;
    }
    
    if (!formData.status) {
      setAlertMessage({ 
        type: 'error', 
        message: 'Please select a lead status' 
      });
      return;
    }
    
    if (!formData.projectId) {
      setAlertMessage({ 
        type: 'error', 
        message: 'Please select a project from the dropdown to create this lead.' 
      });
      return;
    }

    if (!formData.userId) {
      setAlertMessage({ 
        type: 'error', 
        message: 'User ID not available. Please refresh the page and try again.' 
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (editingLead) {
        // Update existing lead
        const response = await fetch(API_ENDPOINTS.UPDATE_LEAD(editingLead._id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            projectId: formData.projectId,
            leadSource: formData.source,
            currentStatus: formData.status,
            customData: {
              "First Name": formData.name.split(' ')[0] || formData.name,
              "Last Name": formData.name.split(' ').slice(1).join(' ') || '',
              "Email": formData.email,
              "Phone": formData.phone,
              "Notes": formData.notes
            },
            user: formData.userId
          }),
        });

        if (response.ok) {
          setAlertMessage({ type: 'success', message: 'Lead updated successfully!' });
          setTimeout(() => fetchLeads(), 2000);
        } else {
          let errorMessage = 'Failed to update lead';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            errorMessage = `Update failed: ${response.status} ${response.statusText}`;
          }
          setAlertMessage({ type: 'error', message: errorMessage });
        }
      } else {
        // Create new lead
        const requestBody = {
          projectId: formData.projectId,
          leadSource: formData.source,
          currentStatus: formData.status,
          customData: {
            "First Name": formData.name.split(' ')[0] || formData.name,
            "Last Name": formData.name.split(' ').slice(1).join(' ') || '',
            "Email": formData.email,
            "Phone": formData.phone,
            "Notes": formData.notes
          },
          user: formData.userId
        };
        
        const response = await fetch(API_ENDPOINTS.CREATE_LEAD(formData.projectId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          setAlertMessage({ type: 'success', message: 'Lead created successfully!' });
          setTimeout(() => fetchLeads(), 2000);
        } else {
          let errorMessage = 'Failed to create lead';
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
            message: `Lead creation failed (${response.status}): ${errorMessage}` 
          });
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving lead:", error);
      setAlertMessage({ type: 'error', message: 'Network error: Failed to save lead. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_LEAD(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Lead deleted successfully!' });
        setTimeout(() => fetchLeads(), 2000);
      } else {
        let errorMessage = 'Failed to delete lead';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          errorMessage = `Delete failed: ${response.status} ${response.statusText}`;
        }
        setAlertMessage({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      setAlertMessage({ type: 'error', message: 'Network error: Failed to delete lead. Please check your connection.' });
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.leadSource?._id || '',
      status: lead.currentStatus?._id || '',
      notes: lead.notes || '',
      projectId: formData.projectId || '',
      userId: formData.userId
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "",
      status: "",
      notes: "",
      projectId: projects.length > 0 ? projects[0]._id : "", // Use default project
      userId: formData.userId
    });
  };

  const handleAddNew = () => {
    setEditingLead(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "",
      status: "",
      notes: "",
      projectId: projects.length > 0 ? projects[0]._id : "", // Use default project
      userId: formData.userId
    });
    setIsModalOpen(true);
  };

  // Lead Sources Management Functions
  const handleSourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceFormData.name.trim()) {
      setAlertMessage({ type: 'error', message: 'Please enter a source name' });
      return;
    }

    try {
      setIsSubmittingSource(true);
      const url = editingSource 
        ? API_ENDPOINTS.UPDATE_LEAD_SOURCE(editingSource._id)
        : API_ENDPOINTS.CREATE_LEAD_SOURCE;
      
      const method = editingSource ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sourceFormData),
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: `Lead source ${editingSource ? 'updated' : 'created'} successfully!` });
        fetchData(); // Refresh data
        handleCloseSourceModal();
      } else {
        const errorData = await response.json();
        setAlertMessage({ type: 'error', message: errorData.message || 'Failed to save lead source' });
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Network error: Failed to save lead source' });
    } finally {
      setIsSubmittingSource(false);
    }
  };

  const handleSourceDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead source?")) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_LEAD_SOURCE(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Lead source deleted successfully!' });
        fetchData(); // Refresh data
      } else {
        setAlertMessage({ type: 'error', message: 'Failed to delete lead source' });
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Network error: Failed to delete lead source' });
    }
  };

  const handleSourceEdit = (source: LeadSource) => {
    setEditingSource(source);
    setSourceFormData({
      name: source.name,
      description: source.description || '',
      isActive: source.isActive ?? true,
    });
    setIsSourceModalOpen(true);
  };

  const handleCloseSourceModal = () => {
    setIsSourceModalOpen(false);
    setEditingSource(null);
    setSourceFormData({ name: "", description: "", isActive: true });
  };

  const handleAddNewSource = () => {
    setEditingSource(null);
    setSourceFormData({ name: "", description: "", isActive: true });
    setIsSourceModalOpen(true);
  };

  // Lead Statuses Management Functions
  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusFormData.name.trim()) {
      setAlertMessage({ type: 'error', message: 'Please enter a status name' });
      return;
    }

    try {
      setIsSubmittingStatus(true);
      const url = editingStatus 
        ? API_ENDPOINTS.UPDATE_LEAD_STATUS(editingStatus._id)
        : API_ENDPOINTS.CREATE_LEAD_STATUS;
      
      const method = editingStatus ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusFormData),
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: `Lead status ${editingStatus ? 'updated' : 'created'} successfully!` });
        fetchData(); // Refresh data
        handleCloseStatusModal();
      } else {
        const errorData = await response.json();
        setAlertMessage({ type: 'error', message: errorData.message || 'Failed to save lead status' });
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Network error: Failed to save lead status' });
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  const handleStatusDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lead status?")) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.DELETE_LEAD_STATUS(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Lead status deleted successfully!' });
        fetchData(); // Refresh data
      } else {
        setAlertMessage({ type: 'error', message: 'Failed to delete lead status' });
      }
    } catch (error) {
      setAlertMessage({ type: 'error', message: 'Network error: Failed to delete lead status' });
    }
  };

  const handleStatusEdit = (status: LeadStatus) => {
    setEditingStatus(status);
    setStatusFormData({
      name: status.name,
      description: status.description || '',
      color: status.color || '#3B82F6',
      isActive: status.isActive ?? true,
    });
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setEditingStatus(null);
    setStatusFormData({ name: "", description: "", color: "#3B82F6", isActive: true });
  };

  const handleAddNewStatus = () => {
    setEditingStatus(null);
    setStatusFormData({ name: "", description: "", color: "#3B82F6", isActive: true });
    setIsStatusModalOpen(true);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (lead.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === "all" || lead.leadSource?._id === filterSource;
    const matchesStatus = filterStatus === "all" || lead.currentStatus?._id === filterStatus;
    return matchesSearch && matchesSource && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">Lead Management</h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your sales leads, sources, and statuses
            <span className="block sm:inline sm:ml-2 text-green-600 dark:text-green-400">
              • Complete Lead Management System
            </span>
          </p>
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

      {/* Tabs Navigation */}
      <Tabs aria-label="Lead Management Tabs">
        <Tabs.Item active={activeTab === "leads"} title="Leads" onClick={() => setActiveTab("leads")}>
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-3 sm:p-4 lg:p-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
              {leads.length}
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">Total Leads</div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
              {leadSources.length}
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">Lead Sources</div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">
              {leadStatuses.length}
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">Lead Statuses</div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1 sm:mb-2">
              {leads.filter(lead => {
                const currentStatus = lead.currentStatus;
                if (!currentStatus || !currentStatus._id) return false;
                const status = leadStatuses.find(s => s._id === currentStatus._id);
                return status && status.name === 'New';
              }).length}
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">New Leads</div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1 sm:mb-2">
              {projects.length}
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">Total Projects</div>
          </div>
        </Card>
      </div>

      {/* No Projects Warning */}
      {projects.length === 0 && !isLoading && (
        <Alert color="warning">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon icon="solar:info-circle-line-duotone" className="mr-2" />
              <span>
                <strong>No Projects Available:</strong> You need to create at least one project before you can manage leads. 
                Please create a project first, then return to this page.
              </span>
            </div>
            <Button 
              size="sm" 
              color="gray" 
              onClick={() => fetchData()}
              className="ml-4"
            >
              <Icon icon="solar:refresh-line-duotone" className="mr-1" />
              Retry
            </Button>
          </div>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div>
            <TextInput
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={() => <Icon icon="solar:magnifer-line-duotone" className="text-gray-400" />}
              disabled={projects.length === 0}
            />
          </div>
          <div>
            <Select
              value="all"
              disabled={true}
              title="Project filter disabled - viewing all leads"
            >
              <option value="all">All Projects</option>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Viewing leads from all projects
            </p>
          </div>
          <div>
            <Select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              disabled={projects.length === 0}
            >
              <option value="all">All Sources</option>
              {leadSources.map(source => (
                <option key={source._id} value={source._id}>
                  {source.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              disabled={projects.length === 0}
            >
              <option value="all">All Statuses</option>
              {leadStatuses.map(status => (
                <option key={status._id} value={status._id}>
                  {status.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-center">
            <Badge color="info" size="lg">
              {filteredLeads.length} Lead{filteredLeads.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Leads Table */}
      {projects.length > 0 ? (
        <Card>
          {isLoadingLeads ? (
            <div className="text-center py-6 sm:py-8">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">Loading leads...</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <Table className="min-w-full">
                <Table.Head>
                  <Table.HeadCell className="min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm">Name</Table.HeadCell>
                  <Table.HeadCell className="min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm">Contact</Table.HeadCell>
                  <Table.HeadCell className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Source</Table.HeadCell>
                  <Table.HeadCell className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Status</Table.HeadCell>
                  <Table.HeadCell className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Created</Table.HeadCell>
                  <Table.HeadCell className="min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm">Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {filteredLeads.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={6} className="text-center py-8">
                        <div className="text-gray-500 dark:text-gray-400">
                          <Icon icon="solar:info-circle-line-duotone" className="mx-auto text-4xl mb-2" />
                          <p>No leads found</p>
                          <p className="text-sm">
                            {leads.length === 0 
                              ? "No leads available in the system"
                              : "No leads match your current filters"
                            }
                          </p>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    filteredLeads.map((lead) => (
                      <Table.Row key={lead._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                          <div className="truncate max-w-[100px] sm:max-w-none">
                            {lead.name || 'N/A'}
                          </div>
                        </Table.Cell>
                        <Table.Cell className="text-xs sm:text-sm">
                          <div className="min-w-0">
                            <div className="truncate">{lead.email || 'N/A'}</div>
                            <div className="text-gray-500 dark:text-gray-400 truncate">{lead.phone || 'N/A'}</div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color="blue" size="sm" className="text-xs">
                            <span className="truncate max-w-[60px] sm:max-w-none">
                              {lead.leadSource?.name || 'N/A'}
                            </span>
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge color="green" size="sm" className="text-xs">
                            <span className="truncate max-w-[60px] sm:max-w-none">
                              {lead.currentStatus?.name || 'N/A'}
                            </span>
                          </Badge>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                            <Button
                              size="xs"
                              color="info"
                              onClick={() => handleEdit(lead)}
                              className="text-xs px-2 py-1"
                            >
                              <Icon icon="solar:pen-line-duotone" className="mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                              <span className="sm:hidden">E</span>
                            </Button>
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() => handleDelete(lead._id)}
                              className="text-xs px-2 py-1"
                            >
                              <Icon icon="solar:trash-bin-trash-line-duotone" className="mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">D</span>
                            </Button>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              <Icon icon="solar:info-circle-line-duotone" className="mx-auto text-4xl mb-4" />
              <p className="text-lg font-medium mb-2">No Projects Available</p>
              <p className="text-sm mb-4">
                You need to create at least one project before you can view or manage leads.
              </p>
              <Button color="primary" onClick={() => window.location.href = '/projects'}>
                <Icon icon="solar:add-circle-line-duotone" className="mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal show={isModalOpen && projects.length > 0} onClose={handleCloseModal} size="xl">
        <Modal.Header>
          <div className="text-sm sm:text-base font-semibold">
            {editingLead ? 'Edit Lead' : 'Add New Lead'}
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body className="max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="name" value="Full Name *" />
                <TextInput
                  id="name"
                  type="text"
                  placeholder="Enter full name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Enter email..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone" value="Phone" />
                <TextInput
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="source" value="Lead Source *" />
                <Select
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  required
                >
                  <option value="">Select source</option>
                  {leadSources.map(source => (
                    <option key={source._id} value={source._id}>
                      {source.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="status" value="Lead Status *" />
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="">Select status</option>
                  {leadStatuses.map(status => (
                    <option key={status._id} value={status._id}>
                      {status.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="projectId" value="Project *" />
              <Select
                id="projectId"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Default project is selected, but you can change it if needed
              </p>
            </div>
            <div className="mt-4">
              <Label htmlFor="notes" value="Notes" />
              <Textarea
                id="notes"
                placeholder="Enter additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto text-sm">
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Icon icon="solar:check-circle-line-duotone" className="mr-1 sm:mr-2" />
              )}
              {editingLead ? 'Update' : 'Create'}
            </Button>
            <Button color="gray" onClick={handleCloseModal} className="w-full sm:w-auto text-sm">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
          </div>
        </Tabs.Item>

      {/* Lead Sources Tab */}
      <Tabs.Item active={activeTab === "sources"} title="Lead Sources" onClick={() => setActiveTab("sources")}>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Lead Sources</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage your lead sources</p>
            </div>
            <Button onClick={handleAddNewSource} color="primary" size="sm">
              <Icon icon="solar:add-circle-line-duotone" className="mr-1 sm:mr-2" height={16} />
              Add Source
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Created</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {leadSources.map((source) => (
                    <Table.Row key={source._id}>
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        {source.name}
                      </Table.Cell>
                      <Table.Cell className="text-gray-600 dark:text-gray-400">
                        {source.description || 'No description'}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={source.isActive ? 'success' : 'failure'} size="sm">
                          {source.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="text-gray-600 dark:text-gray-400">
                        {new Date(source.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Button size="xs" color="info" onClick={() => handleSourceEdit(source)}>
                            <Icon icon="solar:pen-line-duotone" className="mr-1" height={14} />
                            Edit
                          </Button>
                          <Button size="xs" color="failure" onClick={() => handleSourceDelete(source._id)}>
                            <Icon icon="solar:trash-bin-trash-line-duotone" className="mr-1" height={14} />
                            Delete
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Card>
        </div>
      </Tabs.Item>

      {/* Lead Statuses Tab */}
      <Tabs.Item active={activeTab === "statuses"} title="Lead Statuses" onClick={() => setActiveTab("statuses")}>
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Lead Statuses</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage your lead statuses</p>
            </div>
            <Button onClick={handleAddNewStatus} color="primary" size="sm">
              <Icon icon="solar:add-circle-line-duotone" className="mr-1 sm:mr-2" height={16} />
              Add Status
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                  <Table.HeadCell>Color</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Created</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {leadStatuses.map((status) => (
                    <Table.Row key={status._id}>
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        {status.name}
                      </Table.Cell>
                      <Table.Cell className="text-gray-600 dark:text-gray-400">
                        {status.description || 'No description'}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: status.color || '#3B82F6' }}
                          ></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {status.color || '#3B82F6'}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge color={status.isActive ? 'success' : 'failure'} size="sm">
                          {status.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="text-gray-600 dark:text-gray-400">
                        {new Date(status.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Button size="xs" color="info" onClick={() => handleStatusEdit(status)}>
                            <Icon icon="solar:pen-line-duotone" className="mr-1" height={14} />
                            Edit
                          </Button>
                          <Button size="xs" color="failure" onClick={() => handleStatusDelete(status._id)}>
                            <Icon icon="solar:trash-bin-trash-line-duotone" className="mr-1" height={14} />
                            Delete
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Card>
        </div>
      </Tabs.Item>
      </Tabs>

      {/* Lead Sources Modal */}
      <Modal show={isSourceModalOpen} onClose={handleCloseSourceModal} size="md">
        <Modal.Header>
          {editingSource ? 'Edit Lead Source' : 'Add New Lead Source'}
        </Modal.Header>
        <form onSubmit={handleSourceSubmit}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sourceName" value="Source Name *" />
                <TextInput
                  id="sourceName"
                  type="text"
                  placeholder="Enter source name..."
                  value={sourceFormData.name}
                  onChange={(e) => setSourceFormData({ ...sourceFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sourceDescription" value="Description" />
                <Textarea
                  id="sourceDescription"
                  placeholder="Enter source description..."
                  value={sourceFormData.description}
                  onChange={(e) => setSourceFormData({ ...sourceFormData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sourceActive"
                  checked={sourceFormData.isActive}
                  onChange={(e) => setSourceFormData({ ...sourceFormData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <Label htmlFor="sourceActive" value="Active" />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" disabled={isSubmittingSource} className="w-full sm:w-auto">
              {isSubmittingSource ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Icon icon="solar:check-circle-line-duotone" className="mr-2" />
              )}
              {editingSource ? 'Update' : 'Create'}
            </Button>
            <Button color="gray" onClick={handleCloseSourceModal} className="w-full sm:w-auto">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* Lead Statuses Modal */}
      <Modal show={isStatusModalOpen} onClose={handleCloseStatusModal} size="md">
        <Modal.Header>
          {editingStatus ? 'Edit Lead Status' : 'Add New Lead Status'}
        </Modal.Header>
        <form onSubmit={handleStatusSubmit}>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <Label htmlFor="statusName" value="Status Name *" />
                <TextInput
                  id="statusName"
                  type="text"
                  placeholder="Enter status name..."
                  value={statusFormData.name}
                  onChange={(e) => setStatusFormData({ ...statusFormData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="statusDescription" value="Description" />
                <Textarea
                  id="statusDescription"
                  placeholder="Enter status description..."
                  value={statusFormData.description}
                  onChange={(e) => setStatusFormData({ ...statusFormData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="statusColor" value="Color" />
                <div className="flex gap-2 flex-wrap">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        statusFormData.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setStatusFormData({ ...statusFormData, color })}
                    />
                  ))}
                </div>
                <TextInput
                  type="text"
                  placeholder="#3B82F6"
                  value={statusFormData.color}
                  onChange={(e) => setStatusFormData({ ...statusFormData, color: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="statusActive"
                  checked={statusFormData.isActive}
                  onChange={(e) => setStatusFormData({ ...statusFormData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <Label htmlFor="statusActive" value="Active" />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" disabled={isSubmittingStatus} className="w-full sm:w-auto">
              {isSubmittingStatus ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Icon icon="solar:check-circle-line-duotone" className="mr-2" />
              )}
              {editingStatus ? 'Update' : 'Create'}
            </Button>
            <Button color="gray" onClick={handleCloseStatusModal} className="w-full sm:w-auto">
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default LeadsModule;
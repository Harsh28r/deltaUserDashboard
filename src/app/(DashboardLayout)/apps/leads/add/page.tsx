"use client";

import React, { useEffect, useState } from "react";
import { Button, Card, TextInput, Label, Select, Textarea, Alert, Badge } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import { useLeadData } from "../hooks/useLeadData";

const AddLeadPage = () => {
  const router = useRouter();
  const { token, user, projectAccess } = useAuth();
  const { leadStatuses, leadSources, projects, channelPartners, isLoading } = useLeadData();
  const assignedFromAuth = projectAccess?.assignedProjects || [];
  const assignedIds = assignedFromAuth.map(p => p.id);
  const allowedIds = projectAccess?.allowedProjects || [];

  let selectableProjects = projectAccess?.canAccessAll
    ? projects
    : (assignedIds.length > 0
        ? projects.filter(p => assignedIds.includes(p._id))
        : projects.filter(p => allowedIds.includes(p._id))
      );

  if (!projectAccess?.canAccessAll && assignedIds.length > 0) {
    const existingIds = new Set(selectableProjects.map(p => p._id));
    const synthetic = assignedFromAuth
      .filter(ap => !existingIds.has(ap.id))
      .map(ap => ({ _id: ap.id, name: ap.name } as any));
    if (synthetic.length > 0) {
      selectableProjects = [...selectableProjects, ...synthetic];
    }
    // Order by assigned order
    selectableProjects = selectableProjects.sort((a, b) => {
      const ai = assignedIds.indexOf(a._id);
      const bi = assignedIds.indexOf(b._id);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "",
    notes: "",
    project: "",
    // additional lead info
    leadPriority: "",
    propertyType: "",
    configuration: "",
    fundingMode: "",
    gender: "",
    budget: "",
    // channel partner fields
    channelPartner: "",
    cpSourcingId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({});
  const [cpSourcingOptions, setCPSourcingOptions] = useState<any[]>([]);
  const [isLoadingCPSourcing, setIsLoadingCPSourcing] = useState(false);

  useEffect(() => {
    if (!formData.project && selectableProjects && selectableProjects.length > 0) {
      setFormData((prev) => ({ ...prev, project: selectableProjects[0]._id }));
    }
  }, [selectableProjects, formData.project]);

  // set default status to 'New' (or first) and lock for create
  useEffect(() => {
    if (!formData.status && leadStatuses && leadStatuses.length > 0) {
      const defaultStatus = leadStatuses.find(s => s.name?.toLowerCase?.() === 'new') || leadStatuses[0];
      if (defaultStatus?._id) {
        setFormData(prev => ({ ...prev, status: defaultStatus._id }));
      }
    }
  }, [leadStatuses, formData.status]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProjectId = e.target.value;
    setFormData(prev => ({ ...prev, projectId: newProjectId, cpSourcingId: "" }));
    setCPSourcingOptions([]);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = e.target.value;
    setFormData(prev => ({ ...prev, source: newSource }));
    if (newSource !== 'channel-partner') {
      setFormData(prev => ({ ...prev, channelPartner: "", cpSourcingId: "" }));
      setCPSourcingOptions([]);
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
    setDynamicFields({});
  };

  const handleChannelPartnerChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cpId = e.target.value;
    setFormData(prev => ({ ...prev, channelPartner: cpId, cpSourcingId: "" }));
    setCPSourcingOptions([]);
            if (cpId && formData.project) {
      await fetchCPSourcingUsers(formData.project, cpId);
    }
  };

  const fetchCPSourcingUsers = async (project: string, channelPartnerId: string) => {
    if (!project || !channelPartnerId) return;
    try {
      setIsLoadingCPSourcing(true);
      const url = API_ENDPOINTS.CP_SOURCING_UNIQUE_USERS(project, channelPartnerId);
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        setCPSourcingOptions([]);
        return;
      }
      const data = await res.json();
      const arr = data.users || data || [];
      const normalized = arr.map((u: any) => ({ _id: u._id || u.id || u.userId || u.email, name: u.name || u.fullName || u.email, email: u.email || '' }));
      setCPSourcingOptions(normalized);
    } catch (err) {
      setCPSourcingOptions([]);
    } finally {
      setIsLoadingCPSourcing(false);
    }
  };

  const getRequiredFieldsForStatus = (statusId: string) => {
    const st = leadStatuses.find(s => s._id === statusId) as any;
    const fields = (st?.formFields || []) as any[];
    return fields;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setAlertMessage({ type: "error", message: "Not authenticated. Please log in again." });
      return;
    }

    if (!formData.name.trim()) {
      setAlertMessage({ type: "error", message: "Please enter a lead name" });
      return;
    }
    if (!formData.source) {
      setAlertMessage({ type: "error", message: "Please select a lead source" });
      return;
    }
    if (!formData.status) {
      setAlertMessage({ type: "error", message: "Please select a lead status" });
      return;
    }
    if (!formData.project) {
      setAlertMessage({ type: "error", message: "Please select a project" });
      return;
    }

    try {
      setIsSubmitting(true);
      const requestBody = {
        projectId: formData.project,
        leadSourceId: formData.source,
        currentStatusId: formData.status,
        userId: user?.id,
        

        customData: {
          "First Name": formData.name.split(" ")[0] || formData.name,
          "Last Name": formData.name.split(" ").slice(1).join(" ") || "",
          "Email": formData.email,
          "Phone": formData.phone,
          "Notes": formData.notes,
          "Lead Priority": formData.leadPriority,
          "Property Type": formData.propertyType,
          "Configuration": formData.configuration,
          "Funding Mode": formData.fundingMode,
          "Gender": formData.gender,
          "Budget": formData.budget,
          ...(formData.channelPartner ? { "Channel Partner": formData.channelPartner } : {}),
          ...(formData.cpSourcingId ? { "Channel Partner Sourcing": formData.cpSourcingId } : {}),
          ...dynamicFields,
        },
      } as any;

      const response = await fetch(API_ENDPOINTS.CREATE_LEAD(formData.project), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setAlertMessage({ type: "success", message: "Lead created successfully!" });
        setTimeout(() => router.push("/apps/leads"), 800);
      } else {
        let errorMessage = "Failed to create lead";
        try {
          const responseText = await response.text();
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || errorData.details || errorMessage;
          } catch {
            errorMessage = responseText || errorMessage;
          }
        } catch {
          // ignore parse issues
        }
        setAlertMessage({ type: "error", message: errorMessage });
      }
    } catch (error) {
      setAlertMessage({ type: "error", message: "Network error: Failed to create lead." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Lead</h1>
          <p className="text-gray-600">Create a new lead</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color="info">{selectableProjects.length} Projects</Badge>
          <Button color="gray" onClick={() => router.push("/apps/leads")}>
            <Icon icon="solar:arrow-left-line-duotone" className="mr-2" />
            Back to Leads
          </Button>
        </div>
      </div>

      {selectableProjects.length === 0 && (
        <Alert color="warning" className="mb-2">
          <Icon icon="solar:info-circle-line-duotone" className="w-4 h-4 mr-2" />
          You need at least one project to create leads.
        </Alert>
      )}

      {alertMessage && (
        <Alert color={alertMessage.type === "success" ? "success" : "failure"} onDismiss={() => setAlertMessage(null)}>
          {alertMessage.message}
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
            <Icon icon="solar:user-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" value="Full Name *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
            <TextInput id="name" type="text" placeholder="Enter full name..." value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" value="Email Address" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
            <TextInput id="email" type="email" placeholder="Enter email address..." value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" value="Phone Number" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
            <TextInput id="phone" type="tel" placeholder="Enter phone number..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full" />
          </div>
        </div>
      </Card>

      {/* Project Selection */}
      <Card>
        <div className="flex items-center mb-6">
          <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3">
            <Icon icon="solar:folder-line-duotone" className="text-purple-600 dark:text-purple-400 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project Selection</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select the project for this lead</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="projectId" value="Project *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
            <Select id="projectId" value={formData.project} onChange={handleProjectChange} required className="w-full" disabled={selectableProjects.length === 0}>
              <option value="">Select a project</option>
              {selectableProjects.map(project => (
                <option key={project._id} value={project._id}>{project.name}</option>
              ))}
            </Select>
            {formData.project && (
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <Icon icon="solar:check-circle-line-duotone" className="w-3 h-3" />
                {(() => { const selectedProject = selectableProjects.find(p => p._id === formData.project); return selectedProject ? `Project: ${selectedProject.name}` : 'Project selected'; })()}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Lead Details */}
      <Card>
        <div className="flex items-center mb-6">
          <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
            <Icon icon="solar:chart-line-duotone" className="text-green-600 dark:text-green-400 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lead Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status is automatically set to default and locked</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="source" value="Lead Source *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
            <Select id="source" value={formData.source} onChange={handleSourceChange} required className="w-full">
              <option value="">Select lead source</option>
              {leadSources.map(source => (<option key={source._id} value={source._id}>{source.name}</option>))}
              {!leadSources.some(source => source.name?.toLowerCase?.() === 'channel partner') && (<option value="channel-partner">Channel Partner</option>)}
            </Select>
            {(formData.source === 'channel-partner' || leadSources.some(source => source._id === formData.source && source.name?.toLowerCase?.() === 'channel partner')) && (
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"><Icon icon="solar:info-circle-line-duotone" className="w-3 h-3" />Channel partner selected as lead source</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" value="Lead Status *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
            <Select id="status" value={formData.status} onChange={(e) => handleStatusChange(e.target.value)} required className="w-full" disabled>
              <option value="">Select lead status</option>
              {leadStatuses.map(status => (<option key={status._id} value={status._id}>{status.name}</option>))}
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Icon icon="solar:lock-line-duotone" className="w-3 h-3" />Status is automatically set to default and locked</p>
          </div>
        </div>
      </Card>

      {/* Channel Partner Fields */}
      {((formData.source === 'channel-partner' || leadSources.some(source => source._id === formData.source && source.name?.toLowerCase?.() === 'channel partner'))) && (
        <Card>
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-lg mr-3">
              <Icon icon="solar:users-group-two-rounded-line-duotone" className="text-orange-600 dark:text-orange-400 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Channel Partner Selection</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Select channel partner and CP sourcing user</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="channelPartner" value="Select Channel Partner *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="channelPartner" value={formData.channelPartner} onChange={handleChannelPartnerChange} required className="w-full">
                <option value="">Select a channel partner</option>
                {channelPartners.map(partner => (
                  <option key={partner._id} value={partner._id}>{partner.name}{partner.firmName ? ` - ${partner.firmName}` : ''}{partner.phone ? ` - ${partner.phone}` : ''}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpSourcingId" value="CP Sourcing User" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="cpSourcingId" value={formData.cpSourcingId} onChange={(e) => setFormData({ ...formData, cpSourcingId: e.target.value })} className="w-full" disabled={isLoadingCPSourcing || !formData.channelPartner || !formData.project}>
                <option value="">{!formData.channelPartner || !formData.project ? 'Select channel partner and project first' : (isLoadingCPSourcing ? 'Loading users...' : 'Select CP sourcing user')}</option>
                {cpSourcingOptions.map(user => (<option key={user._id} value={user._id}>{user.name}{user.email ? ` (${user.email})` : ''}</option>))}
              </Select>
              {isLoadingCPSourcing && (<p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"><Icon icon="solar:refresh-line-duotone" className="w-3 h-3 animate-spin" />Loading users...</p>)}
              {!isLoadingCPSourcing && cpSourcingOptions.length === 0 && formData.channelPartner && formData.project && (<p className="text-xs text-gray-500 dark:text-gray-400">No users found for this channel partner and project combination</p>)}
            </div>
          </div>
        </Card>
      )}

      {/* Dynamic Fields by Status */}
      {formData.status && getRequiredFieldsForStatus(formData.status).length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-700">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
              <Icon icon="solar:settings-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Required Fields</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">for "{leadStatuses.find(s => s._id === formData.status)?.name}" Status</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getRequiredFieldsForStatus(formData.status)
              .filter((field: any) => field.name && field.name.trim() !== '')
              .map((field: any) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} value={`${field.name} ${field.required ? '*' : ''}`} className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                  {field.type === 'select' && field.options && field.options.length > 0 ? (
                    <Select id={field.name} value={dynamicFields[field.name] || ''} onChange={(e) => setDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} required={field.required} className="w-full">
                      <option value="">Select {field.name}</option>
                      {field.options.map((option: any, index: number) => (<option key={index} value={option.value || option}>{option.label || option}</option>))}
                    </Select>
                  ) : field.type === 'checkbox' && field.options && field.options.length > 0 ? (
                    <div className="space-y-2">
                      {field.options.map((option: any, index: number) => {
                        const optionValue = option.value || option;
                        const currentValues = dynamicFields[field.name] || '';
                        const isChecked = Array.isArray(currentValues) ? currentValues.includes(optionValue) : currentValues === optionValue;
                        return (
                          <div key={index} className="flex items-center">
                            <input type="checkbox" id={`${field.name}_${index}`} checked={isChecked} onChange={(e) => {
                              const currentValues = dynamicFields[field.name] || '';
                              let newValues;
                              if (Array.isArray(currentValues)) {
                                if (e.target.checked) newValues = [...currentValues, optionValue];
                                else newValues = currentValues.filter((v: string) => v !== optionValue);
                              } else {
                                newValues = e.target.checked ? [optionValue] : [];
                              }
                              setDynamicFields(prev => ({ ...prev, [field.name]: newValues }));
                            }} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label htmlFor={`${field.name}_${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label || option}</label>
                          </div>
                        );
                      })}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <Textarea id={field.name} value={dynamicFields[field.name] || ''} onChange={(e) => setDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}...`} rows={3} className="w-full" required={field.required} />
                  ) : field.type === 'number' ? (
                    <TextInput id={field.name} type="number" value={dynamicFields[field.name] || ''} onChange={(e) => setDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}...`} className="w-full" required={field.required} />
                  ) : field.type === 'date' ? (
                    <TextInput id={field.name} type="date" value={dynamicFields[field.name] || ''} onChange={(e) => setDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}...`} className="w-full" required={field.required} />
                  ) : field.type === 'email' ? (
                    <TextInput id={field.name} type="email" value={dynamicFields[field.name] || ''} onChange={(e) => setDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}...`} className="w-full" required={field.required} />
                  ) : field.type === 'tel' ? (
                    <TextInput id={field.name} type="tel" value={dynamicFields[field.name] || ''} onChange={(e) => setDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}...`} className="w-full" required={field.required} />
                  ) : (
                    <TextInput id={field.name} type="text" value={dynamicFields[field.name] || ''} onChange={(e) => setDynamicFields(prev => ({ ...prev, [field.name]: e.target.value }))} placeholder={`Enter ${field.name.toLowerCase()}...`} className="w-full" required={field.required} />
                  )}
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Additional Lead Information */}
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
              <Label htmlFor="leadPriority" value="Lead Priority *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="leadPriority" value={formData.leadPriority} onChange={(e) => setFormData({ ...formData, leadPriority: e.target.value })} className="w-full" required>
                <option value="">Select Priority</option>
                <option value="Hot">Hot</option>
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType" value="Property Type *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="propertyType" value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} className="w-full" required>
                <option value="">Select Property Type</option>
                <option value="residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="configuration" value="Configuration *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="configuration" value={formData.configuration} onChange={(e) => setFormData({ ...formData, configuration: e.target.value })} className="w-full" required>
                <option value="">Select Configuration</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="2+1 BHK">2+1 BHK</option>
                <option value="2+2 BHK">2+2 BHK</option>
                <option value="commercial office">Commercial Office</option>
                <option value="unknown">Unknown</option>
                <option value="Duplex">Duplex</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fundingMode" value="Funding Mode *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="fundingMode" value={formData.fundingMode} onChange={(e) => setFormData({ ...formData, fundingMode: e.target.value })} className="w-full" required>
                <option value="">Select Funding Mode</option>
                <option value="Self Funded">Self Funded</option>
                <option value="sale out property">Sale Out Property</option>
                <option value="loan">Loan</option>
                <option value="self loan">Self Loan</option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gender" value="Gender *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full" required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" value="Budget *" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
              <Select id="budget" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className="w-full" required>
                <option value="">Select Budget Range</option>
                <option value="25-50 Lakhs">25-50 Lakhs</option>
                <option value="50 Lakhs - 1 Crore">50 Lakhs - 1 Crore</option>
                <option value="1-2 Crores">1-2 Crores</option>
                <option value="2-5 Crores">2-5 Crores</option>
                <option value="Above 5 Crores">Above 5 Crores</option>
                <option value="Not Specified">Not Specified</option>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <div className="flex items-center mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
            <Icon icon="solar:notes-line-duotone" className="text-gray-600 dark:text-gray-400 text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Notes</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add any additional information about this lead</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes" value="Notes" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
          <Textarea id="notes" placeholder="Enter any additional notes about this lead..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} className="w-full" />
        </div>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button type="button" color="gray" onClick={() => router.push("/apps/leads")}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting || selectableProjects.length === 0}>
          {isSubmitting ? (<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>) : (<Icon icon="solar:check-circle-line-duotone" className="mr-2" />)}
          Create Lead
        </Button>
      </div>
    </div>
  );
};

export default AddLeadPage;



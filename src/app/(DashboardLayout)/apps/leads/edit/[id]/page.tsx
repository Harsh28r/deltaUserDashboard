"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, Label, Select, TextInput, Textarea, Alert, Badge } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import { useLeadDetails } from "../../hooks/useLeadDetails";
import { useLeadData } from "../../hooks/useLeadData";

const EditLeadPage: React.FC = () => {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;

  const { lead, isLoading, alertMessage, setAlertMessage, refreshLead } = useLeadDetails(leadId);
  const { leadStatuses, leadSources, projects } = useLeadData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    notes: "",
    leadSource: "",
    project: "",
    leadPriority: "",
    propertyType: "",
    configuration: "",
    fundingMode: "",
    gender: "",
    budget: "",
  } as Record<string, any>);

  // Populate initial form values when lead loads
  useEffect(() => {
    if (!lead) return;
    const base = {
      firstName: lead.customData?.["First Name"] || "",
      email: lead.customData?.["Email"] || "",
      phone: lead.customData?.["Phone"] || "",
      notes: lead.customData?.["Notes"] || "",
      leadSource: lead.leadSource?._id || "",
      project: lead.project?._id || "",
      leadPriority: lead.customData?.["Lead Priority"] || "",
      propertyType: lead.customData?.["Property Type"] || "",
      configuration: lead.customData?.["Configuration"] || "",
      fundingMode: lead.customData?.["Funding Mode"] || "",
      gender: lead.customData?.["Gender"] || "",
      budget: lead.customData?.["Budget"] || "",
    } as Record<string, any>;

    // Include status-specific fields if present
    if (lead.currentStatus?.formFields) {
      lead.currentStatus.formFields.forEach((field: any) => {
        base[field.name] = lead.customData?.[field.name] || "";
      });
    }
    setFormData(base);
  }, [lead]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !lead) return;
    try {
      setIsSubmitting(true);

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
        "Budget": formData.budget,
      };

      if (lead.currentStatus?.formFields) {
        lead.currentStatus.formFields.forEach((field: any) => {
          customData[field.name] = formData[field.name] || "";
        });
      }

      const response = await fetch(API_ENDPOINTS.UPDATE_LEAD(lead._id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project: formData.project,
          leadSource: formData.leadSource,
          customData,
        }),
      });

      if (response.ok) {
        setAlertMessage({ type: 'success', message: 'Lead updated successfully!' });
        await refreshLead();
        router.push(`/apps/leads/${lead._id}`);
      } else {
        const errorData = await response.json().catch(() => ({} as any));
        setAlertMessage({ type: 'error', message: errorData.message || `Failed to update lead: ${response.status}` });
      }
    } catch (err) {
      setAlertMessage({ type: 'error', message: 'Network error: Failed to update lead.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [token, lead, formData, setAlertMessage, refreshLead, router]);

  if (isLoading || !lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button color="gray" size="sm" onClick={() => router.push(`/apps/leads/${lead._id}`)} className="flex items-center gap-2">
            <Icon icon="solar:arrow-left-line-duotone" />
            Back
          </Button>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Edit Lead</h1>
          <Badge color="blue" size="sm">ID: {lead._id.slice(-8)}</Badge>
        </div>
      </div>

      {alertMessage && (
        <Alert color={alertMessage.type === 'success' ? 'success' : alertMessage.type === 'info' ? 'info' : 'failure'} onDismiss={() => setAlertMessage(null)}>
          {alertMessage.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
              <Icon icon="solar:user-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" value="First Name" />
              <TextInput id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="Enter first name" required />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" required />
            </div>
            <div>
              <Label htmlFor="phone" value="Phone" />
              <TextInput id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone" />
            </div>
            <div>
              <Label htmlFor="notes" value="Notes" />
              <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="Enter notes" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg mr-3">
              <Icon icon="solar:settings-line-duotone" className="text-indigo-600 dark:text-indigo-400 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lead Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadSource" value="Lead Source" />
              <Select id="leadSource" value={formData.leadSource} onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}>
                <option value="">Select Lead Source</option>
                {leadSources.map((source) => (
                  <option key={source._id} value={source._id}>{source.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="project" value="Project" />
              <Select id="project" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })}>
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>{project.name}</option>
                ))}
              </Select>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card>
          <div className="flex items-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg mr-3">
              <Icon icon="solar:chart-line-duotone" className="text-green-600 dark:text-green-400 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Lead Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadPriority" value="Lead Priority" />
              <Select id="leadPriority" value={formData.leadPriority} onChange={(e) => setFormData({ ...formData, leadPriority: e.target.value })}>
                <option value="">Select Priority</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="propertyType" value="Property Type" />
              <Select id="propertyType" value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}>
                <option value="">Select Property Type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="configuration" value="Configuration" />
              <Select id="configuration" value={formData.configuration} onChange={(e) => setFormData({ ...formData, configuration: e.target.value })}>
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
            <div>
              <Label htmlFor="fundingMode" value="Funding Mode" />
              <Select id="fundingMode" value={formData.fundingMode} onChange={(e) => setFormData({ ...formData, fundingMode: e.target.value })}>
                <option value="">Select Funding Mode</option>
                <option value="Self Funded">Self Funded</option>
                <option value="sale out property">Sale Out Property</option>
                <option value="loan">Loan</option>
                <option value="self loan">Self Loan</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="gender" value="Gender" />
              <Select id="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget" value="Budget" />
              <Select id="budget" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}>
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
        </Card>

        <div className="flex gap-2 justify-end">
          <Button type="button" color="gray" onClick={() => router.push(`/apps/leads/${lead._id}`)}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Icon icon="solar:check-circle-line-duotone" className="mr-2" />
            )}
            Update Lead
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditLeadPage;



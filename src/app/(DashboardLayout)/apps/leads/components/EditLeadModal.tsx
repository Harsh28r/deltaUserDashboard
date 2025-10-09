"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal, Label, TextInput, Select, Textarea, Button, Card } from "flowbite-react";
import { Icon } from "@iconify/react";
import { Lead, LeadSource, Project, LeadFormData, FormField } from "../types";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => void | Promise<void>;
  lead: Lead;
  leadSources: LeadSource[];
  projects: Project[];
  isSubmitting: boolean;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  leadSources,
  projects,
  isSubmitting,
}) => {
  const currentStatusFields: FormField[] = useMemo(() => {
    return (lead?.currentStatus?.formFields || []) as FormField[];
  }, [lead]);

  const [formData, setFormData] = useState<LeadFormData>({
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
  });

  useEffect(() => {
    if (!lead) return;
    const cd = lead.customData || {};
    // Helper functions to handle both field name formats
    const getName = () => cd["First Name"] || cd.name || cd.firstName || "";
    const getEmail = () => cd["Email"] || cd.email || "";
    const getPhone = () => cd["Phone"] || cd.contact || cd.phone || "";
    const getNotes = () => cd["Notes"] || cd.notes || "";
    const getLeadPriority = () => cd["Lead Priority"] || cd.leadPriority || "Hot";
    const getPropertyType = () => cd["Property Type"] || cd.propertyType || "Residential";
    const getConfiguration = () => cd["Configuration"] || cd.configuration || "2+2 BHK";
    const getFundingMode = () => cd["Funding Mode"] || cd.fundingMode || "Sale Out Property";
    const getGender = () => cd["Gender"] || cd.gender || "Male";
    const getBudget = () => cd["Budget"] || cd.budget || "Not Specified";
    
    setFormData((prev) => ({
      ...prev,
      firstName: getName(),
      email: getEmail(),
      phone: getPhone(),
      notes: getNotes(),
      leadSource: (lead.leadSource?._id as any) || "",
      project: (lead.project?._id as any) || "",
      // Defaults as requested when missing
      leadPriority: getLeadPriority(),
      propertyType: getPropertyType(),
      configuration: getConfiguration(),
      fundingMode: getFundingMode(),
      gender: getGender(),
      budget: getBudget(),
      // Include dynamic fields keyed by their names
      ...currentStatusFields.reduce((acc, f) => {
        acc[f.name] = cd[f.name] || "";
        return acc;
      }, {} as Record<string, any>),
    }));
  }, [lead, currentStatusFields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="6xl">
      <Modal.Header>Edit Lead</Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="max-h-[80vh] overflow-y-auto">
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
                  <Label htmlFor="el_firstName" value="Full Name *" />
                  <TextInput id="el_firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="el_email" value="Email" />
                  <TextInput id="el_email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="el_phone" value="Phone" />
                  <TextInput id="el_phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg mr-3">
                  <Icon icon="solar:folder-line-duotone" className="text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project & Source</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="el_project" value="Project *" />
                  <Select id="el_project" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} required>
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="el_leadSource" value="Lead Source *" />
                  <Select id="el_leadSource" value={formData.leadSource} onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })} required>
                    <option value="">Select lead source</option>
                    {leadSources.map((s) => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </Card>

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
                    <Label htmlFor="el_leadPriority" value="Lead Priority *" />
                    <Select id="el_leadPriority" value={formData.leadPriority} onChange={(e) => setFormData({ ...formData, leadPriority: e.target.value })} required>
                      <option value="">Select Priority</option>
                      <option value="Hot">Hot</option>
                      <option value="Cold">Cold</option>
                      <option value="Warm">Warm</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="el_propertyType" value="Property Type *" />
                    <Select id="el_propertyType" value={formData.propertyType} onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })} required>
                      <option value="">Select Property Type</option>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="el_configuration" value="Configuration *" />
                    <Select id="el_configuration" value={formData.configuration} onChange={(e) => setFormData({ ...formData, configuration: e.target.value })} required>
                      <option value="">Select Configuration</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="2+1 BHK">2+1 BHK</option>
                      <option value="2+2 BHK">2+2 BHK</option>
                      <option value="Commercial Office">Commercial Office</option>
                      <option value="Unknown">Unknown</option>
                      <option value="Duplex">Duplex</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="el_fundingMode" value="Funding Mode *" />
                    <Select id="el_fundingMode" value={formData.fundingMode} onChange={(e) => setFormData({ ...formData, fundingMode: e.target.value })} required>
                      <option value="">Select Funding Mode</option>
                      <option value="Self Funded">Self Funded</option>
                      <option value="Sale Out Property">Sale Out Property</option>
                      <option value="Loan">Loan</option>
                      <option value="Self Loan">Self Loan</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="el_gender" value="Gender *" />
                    <Select id="el_gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="el_budget" value="Budget *" />
                    <Select id="el_budget" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required>
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

            {currentStatusFields.length > 0 && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-700">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                    <Icon icon="solar:settings-line-duotone" className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Status-Specific Fields</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">From current status</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentStatusFields.map((field) => (
                    <div key={field._id || field.name} className="space-y-2">
                      <Label htmlFor={`el_field_${field._id || field.name}`} value={`${field.name}${field.required ? ' *' : ''}`} />
                      {field.type === 'select' && (field as any).options && (field as any).options.length > 0 ? (
                        <Select id={`el_field_${field._id || field.name}`} value={(formData as any)[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} required={field.required}>
                          <option value="">Select {field.name}</option>
                          {(field as any).options.map((opt: any, idx: number) => (
                            <option key={idx} value={opt.value || opt}>{opt.label || opt}</option>
                          ))}
                        </Select>
                      ) : field.type === 'textarea' ? (
                        <Textarea id={`el_field_${field._id || field.name}`} value={(formData as any)[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} rows={3} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                      ) : field.type === 'number' ? (
                        <TextInput id={`el_field_${field._id || field.name}`} type="number" value={(formData as any)[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                      ) : field.type === 'date' ? (
                        <TextInput id={`el_field_${field._id || field.name}`} type="date" value={(formData as any)[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} required={field.required} />
                      ) : field.type === 'email' ? (
                        <TextInput id={`el_field_${field._id || field.name}`} type="email" value={(formData as any)[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                      ) : field.type === 'tel' ? (
                        <TextInput id={`el_field_${field._id || field.name}`} type="tel" value={(formData as any)[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
                      ) : (
                        <TextInput id={`el_field_${field._id || field.name}`} type="text" value={(formData as any)[field.name] || ''} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} placeholder={`Enter ${field.name.toLowerCase()}`} required={field.required} />
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
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Notes</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="el_notes" value="Notes" />
                <Textarea id="el_notes" rows={4} placeholder="Enter any additional notes..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
              </div>
            </Card>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Icon icon="solar:check-circle-line-duotone" className="mr-2" />
            )}
            Update
          </Button>
          <Button color="gray" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditLeadModal;



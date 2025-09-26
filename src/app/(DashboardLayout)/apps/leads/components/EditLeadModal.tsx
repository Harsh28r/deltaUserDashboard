import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Label, Select, Textarea } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { Lead, LeadFormData, LeadSource, Project, FormField } from '../types';

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: LeadFormData) => Promise<void>;
  lead: Lead | null;
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
  isSubmitting
}) => {
  const [editFormData, setEditFormData] = useState<LeadFormData>({
    firstName: '',
    email: '',
    phone: '',
    notes: '',
    leadSource: '',
    project: '',
    leadPriority: '',
    propertyType: '',
    configuration: '',
    fundingMode: '',
    gender: '',
    budget: ''
  });

  // Populate form when lead changes
  useEffect(() => {
    if (lead) {
      const baseFormData = {
        firstName: lead.customData?.["First Name"] || '',
        email: lead.customData?.["Email"] || '',
        phone: lead.customData?.["Phone"] || '',
        notes: lead.customData?.["Notes"] || '',
        leadSource: lead.leadSource?._id || '',
        project: lead.project?._id || '',
        leadPriority: lead.customData?.["Lead Priority"] || '',
        propertyType: lead.customData?.["Property Type"] || '',
        configuration: lead.customData?.["Configuration"] || '',
        fundingMode: lead.customData?.["Funding Mode"] || '',
        gender: lead.customData?.["Gender"] || '',
        budget: lead.customData?.["Budget"] || ''
      };

      // Add status-specific fields
      const statusFieldsData: any = {};
      if (lead.currentStatus?.formFields) {
        lead.currentStatus.formFields.forEach((field: FormField) => {
          statusFieldsData[field.name] = lead.customData?.[field.name] || '';
        });
      }

      setEditFormData({ ...baseFormData, ...statusFieldsData });
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(editFormData);
  };

  const handleClose = () => {
    if (lead) {
      const baseFormData = {
        firstName: lead.customData?.["First Name"] || '',
        email: lead.customData?.["Email"] || '',
        phone: lead.customData?.["Phone"] || '',
        notes: lead.customData?.["Notes"] || '',
        leadSource: lead.leadSource?._id || '',
        project: lead.project?._id || '',
        leadPriority: lead.customData?.["Lead Priority"] || '',
        propertyType: lead.customData?.["Property Type"] || '',
        configuration: lead.customData?.["Configuration"] || '',
        fundingMode: lead.customData?.["Funding Mode"] || '',
        gender: lead.customData?.["Gender"] || '',
        budget: lead.customData?.["Budget"] || ''
      };
      setEditFormData(baseFormData);
    }
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="4xl">
      <Modal.Header>Edit Lead</Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" value="First Name" />
                <TextInput
                  id="firstName"
                  value={editFormData.firstName}
                  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" value="Phone" />
                <TextInput
                  id="phone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" value="Notes" />
              <Textarea
                id="notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                placeholder="Enter notes about this lead"
                rows={3}
              />
            </div>

            {/* Additional Lead Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 rounded-lg mr-3">
                  <Icon icon="solar:settings-line-duotone" className="text-indigo-600 dark:text-indigo-400 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Additional Lead Information</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="leadPriority" value="Lead Priority" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                    <Select
                      id="leadPriority"
                      value={editFormData.leadPriority}
                      onChange={(e) => setEditFormData({ ...editFormData, leadPriority: e.target.value })}
                      className="w-full"
                    >
                      <option value="">Select Priority</option>
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType" value="Property Type" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                    <Select
                      id="propertyType"
                      value={editFormData.propertyType}
                      onChange={(e) => setEditFormData({ ...editFormData, propertyType: e.target.value })}
                      className="w-full"
                    >
                      <option value="">Select Property Type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="configuration" value="Configuration" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                    <Select
                      id="configuration"
                      value={editFormData.configuration}
                      onChange={(e) => setEditFormData({ ...editFormData, configuration: e.target.value })}
                      className="w-full"
                    >
                      <option value="">Select Configuration</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="2+1 BHK">2+1 BHK</option>
                      <option value="2+2 BHK">2+2 BHK</option>
                      <option value="commercial office">Commercial Office</option>
                      <option value="Duplex">Duplex</option>
                      <option value="unknown">Unknown</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundingMode" value="Funding Mode" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                    <Select
                      id="fundingMode"
                      value={editFormData.fundingMode}
                      onChange={(e) => setEditFormData({ ...editFormData, fundingMode: e.target.value })}
                      className="w-full"
                    >
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
                    <Label htmlFor="gender" value="Gender" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                    <Select
                      id="gender"
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className="w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget" value="Budget" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                    <Select
                      id="budget"
                      value={editFormData.budget}
                      onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                      className="w-full"
                    >
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
            </div>

            {/* Lead Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leadSource" value="Lead Source" />
                <Select
                  id="leadSource"
                  value={editFormData.leadSource}
                  onChange={(e) => setEditFormData({ ...editFormData, leadSource: e.target.value })}
                >
                  <option value="">Select Lead Source</option>
                  {leadSources.map((source) => (
                    <option key={source._id} value={source._id}>
                      {source.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="project" value="Project" />
                <Select
                  id="project"
                  value={editFormData.project}
                  onChange={(e) => setEditFormData({ ...editFormData, project: e.target.value })}
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Lead Status and Associated Fields */}
            {lead?.currentStatus?.formFields && lead.currentStatus.formFields.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-6">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-lg mr-4">
                    <Icon icon="solar:check-circle-line-duotone" className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Status: {lead?.currentStatus?.name || 'No Status'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Edit the fields associated with this status</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Icon icon="solar:settings-line-duotone" className="text-blue-600 dark:text-blue-400" />
                      Fields for "{lead.currentStatus.name}" Status
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {lead.currentStatus.formFields.map((field: FormField) => (
                        <div key={field._id} className="space-y-2">
                          <Label
                            htmlFor={`statusField_${field._id}`}
                            value={field.name}
                            className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                          >
                            {field.name}
                            {field.required && (
                              <span className="text-red-500 text-xs bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">Required</span>
                            )}
                          </Label>
                          {field.type === 'select' && field.options && field.options.length > 0 ? (
                            <Select
                              id={`statusField_${field._id}`}
                              value={editFormData[field.name as keyof typeof editFormData] || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, [field.name]: e.target.value })}
                              className="w-full"
                              required={field.required}
                            >
                              <option value="">Select {field.name}</option>
                              {field.options.map((option: any, index: number) => (
                                <option key={index} value={option.value || option}>
                                  {option.label || option}
                                </option>
                              ))}
                            </Select>
                          ) : field.type === 'checkbox' && field.options && field.options.length > 0 ? (
                            <div className="space-y-2">
                              {field.options.map((option: any, index: number) => {
                                const optionValue = option.value || option;
                                const currentValues = editFormData[field.name as keyof typeof editFormData] || '';
                                const isChecked = Array.isArray(currentValues) 
                                  ? currentValues.includes(optionValue)
                                  : currentValues === optionValue;
                                
                                return (
                                  <div key={index} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`${field._id}_${index}`}
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const currentValues = editFormData[field.name as keyof typeof editFormData] || '';
                                        let newValues;
                                        
                                        if (Array.isArray(currentValues)) {
                                          if (e.target.checked) {
                                            newValues = [...currentValues, optionValue];
                                          } else {
                                            newValues = currentValues.filter((v: string) => v !== optionValue);
                                          }
                                        } else {
                                          newValues = e.target.checked ? [optionValue] : [];
                                        }
                                        
                                        setEditFormData({ ...editFormData, [field.name]: newValues });
                                      }}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor={`${field._id}_${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                      {option.label || option}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          ) : field.type === 'textarea' ? (
                            <Textarea
                              id={`statusField_${field._id}`}
                              value={editFormData[field.name as keyof typeof editFormData] || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, [field.name]: e.target.value })}
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                              rows={3}
                              className="w-full"
                              required={field.required}
                            />
                          ) : field.type === 'number' ? (
                            <TextInput
                              id={`statusField_${field._id}`}
                              type="number"
                              value={editFormData[field.name as keyof typeof editFormData] || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, [field.name]: e.target.value })}
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                              className="w-full"
                              required={field.required}
                            />
                          ) : field.type === 'date' ? (
                            <TextInput
                              id={`statusField_${field._id}`}
                              type="date"
                              value={editFormData[field.name as keyof typeof editFormData] || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, [field.name]: e.target.value })}
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                              className="w-full"
                              required={field.required}
                            />
                          ) : field.type === 'email' ? (
                            <TextInput
                              id={`statusField_${field._id}`}
                              type="email"
                              value={editFormData[field.name as keyof typeof editFormData] || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, [field.name]: e.target.value })}
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                              className="w-full"
                              required={field.required}
                            />
                          ) : field.type === 'tel' ? (
                            <TextInput
                              id={`statusField_${field._id}`}
                              type="tel"
                              value={editFormData[field.name as keyof typeof editFormData] || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, [field.name]: e.target.value })}
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                              className="w-full"
                              required={field.required}
                            />
                          ) : (
                            <TextInput
                              id={`statusField_${field._id}`}
                              type="text"
                              value={editFormData[field.name as keyof typeof editFormData] || ''}
                              onChange={(e) => setEditFormData({ ...editFormData, [field.name]: e.target.value })}
                              placeholder={`Enter ${field.name.toLowerCase()}`}
                              className="w-full"
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            color="gray"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="info"
            disabled={isSubmitting}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating Details...
              </>
            ) : (
              <>
                <Icon icon="solar:pen-line-duotone" className="w-4 h-4" />
                Update Details
              </>
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditLeadModal;








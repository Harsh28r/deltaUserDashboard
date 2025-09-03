"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Badge, Alert, Select, TextInput } from "flowbite-react";
import { Icon } from "@iconify/react";
import { ApiService } from "@/app/utils/api/endpoints";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: string;
  projectId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadSource {
  id: string;
  name: string;
}

interface LeadStatus {
  id: string;
  name: string;
  color: string;
}

const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [projectId, setProjectId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsResponse, sourcesResponse, statusesResponse] = await Promise.all([
        ApiService.getLeads(projectId),
        ApiService.getLeadSources(),
        ApiService.getLeadStatuses(),
      ]);
      
      // Debug logging to see API response structure
      console.log('API Responses:', {
        leadsResponse,
        sourcesResponse,
        statusesResponse
      });
      
      // Ensure we have arrays for all data
      setLeads(Array.isArray(leadsResponse?.data) ? leadsResponse.data : Array.isArray(leadsResponse) ? leadsResponse : []);
      setLeadSources(Array.isArray(sourcesResponse?.data) ? sourcesResponse.data : Array.isArray(sourcesResponse) ? sourcesResponse : []);
      setLeadStatuses(Array.isArray(statusesResponse?.data) ? statusesResponse.data : Array.isArray(statusesResponse) ? statusesResponse : []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
      // Set empty arrays on error to prevent filter errors
      setLeads([]);
      setLeadSources([]);
      setLeadStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!projectId) {
        setError("Project ID is required");
        return;
      }

      if (editingLead) {
        await ApiService.updateLead(editingLead.id, formData);
      } else {
        await ApiService.createLead(projectId, formData);
      }
      setShowModal(false);
      setEditingLead(null);
      setFormData({ name: "", email: "", phone: "", company: "", source: "", status: "", notes: "" });
      fetchData();
    } catch (err) {
      setError("Failed to save lead");
      console.error("Error saving lead:", err);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      company: lead.company || "",
      source: lead.source || "",
      status: lead.status || "",
      notes: lead.notes || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await ApiService.deleteLead(id);
        fetchData();
      } catch (err) {
        setError("Failed to delete lead");
        console.error("Error deleting lead:", err);
      }
    }
  };

  const openModal = () => {
    setEditingLead(null);
    setFormData({ name: "", email: "", phone: "", company: "", source: "", status: "", notes: "" });
    setShowModal(true);
  };

  const getStatusColor = (statusName: string) => {
    const status = Array.isArray(leadStatuses) ? leadStatuses.find(s => s.name === statusName) : null;
    return status?.color || "#6B7280";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your leads and track their progress</p>
        </div>
        <div className="flex space-x-3">
          <TextInput
            type="text"
            placeholder="Enter Project ID"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-48"
          />
          <Button onClick={fetchData} color="gray">
            <Icon icon="solar:refresh-line-duotone" className="mr-2" height={16} />
            Refresh
          </Button>
          <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
            <Icon icon="solar:add-circle-line-duotone" className="mr-2" height={20} />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert color="failure" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon icon="solar:users-group-rounded-line-duotone" className="text-blue-600 dark:text-blue-400" height={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{leads.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Icon icon="solar:check-circle-line-duotone" className="text-green-600 dark:text-green-400" height={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Leads</p>
                             <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {Array.isArray(leads) ? leads.filter(lead => lead.status && lead.status !== 'Closed').length : 0}
               </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Icon icon="solar:clock-circle-line-duotone" className="text-yellow-600 dark:text-yellow-400" height={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Week</p>
                             <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {Array.isArray(leads) ? leads.filter(lead => {
                   const weekAgo = new Date();
                   weekAgo.setDate(weekAgo.getDate() - 7);
                   return new Date(lead.createdAt) > weekAgo;
                 }).length : 0}
               </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Icon icon="solar:chart-2-line-duotone" className="text-purple-600 dark:text-purple-400" height={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                             <p className="text-2xl font-bold text-gray-900 dark:text-white">
                 {Array.isArray(leads) && leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'Converted').length / leads.length) * 100) : 0}%
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Phone</Table.HeadCell>
            <Table.HeadCell>Company</Table.HeadCell>
            <Table.HeadCell>Source</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Created</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
                     <Table.Body className="divide-y">
             {Array.isArray(leads) ? leads.map((lead) => (
              <Table.Row key={lead.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {lead.name}
                </Table.Cell>
                <Table.Cell className="text-gray-600 dark:text-gray-400">
                  {lead.email}
                </Table.Cell>
                <Table.Cell className="text-gray-600 dark:text-gray-400">
                  {lead.phone || "N/A"}
                </Table.Cell>
                <Table.Cell className="text-gray-600 dark:text-gray-400">
                  {lead.company || "N/A"}
                </Table.Cell>
                <Table.Cell>
                  <Badge color="info">
                    {lead.source || "Unknown"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge 
                    color="info"
                    style={{ backgroundColor: getStatusColor(lead.status || ""), color: "white" }}
                  >
                    {lead.status || "No Status"}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-gray-600 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      color="blue"
                      onClick={() => handleEdit(lead)}
                    >
                      <Icon icon="solar:pen-line-duotone" height={16} />
                    </Button>
                    <Button
                      size="sm"
                      color="failure"
                      onClick={() => handleDelete(lead.id)}
                    >
                      <Icon icon="solar:trash-bin-minimalistic-line-duotone" height={16} />
                    </Button>
                  </div>
                </Table.Cell>
                             </Table.Row>
             )) : null}
           </Table.Body>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="4xl">
        <Modal.Header>
          {editingLead ? "Edit Lead" : "Add New Lead"}
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Enter lead name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                                     <option value="">Select source</option>
                   {Array.isArray(leadSources) ? leadSources.map((source) => (
                     <option key={source.id} value={source.name}>
                       {source.name}
                     </option>
                   )) : null}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                                     <option value="">Select status</option>
                   {Array.isArray(leadStatuses) ? leadStatuses.map((status) => (
                     <option key={status.id} value={status.name}>
                       {status.name}
                     </option>
                   )) : null}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                placeholder="Enter additional notes"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingLead ? "Update" : "Create"}
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

export default LeadsManager;

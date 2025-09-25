"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Table, Badge, Modal, Alert } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import PermissionGate from "@/app/components/auth/PermissionGate";

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
}

const LeadsPage = () => {
  const router = useRouter();
  const { token, user, userPermissions, projectAccess } = useAuth();
  const canCreateLead = (userPermissions || []).includes('leads:create') || (projectAccess?.assignedProjects?.length || 0) > 0 || projectAccess?.canAccessAll;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch leads
  useEffect(() => {
    if (token) {
      fetchLeads();
    }
  }, [token]);

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
      const mapped = leadsData.map((raw) => {
        const cd = raw.customData || {};
        const nameFromCustom = cd["First Name"] && cd["Last Name"] ? `${cd["First Name"]} ${cd["Last Name"]}` : cd["First Name"] || raw.name || "";
        const email = cd["Email"] || raw.email || "";
        const phone = cd["Phone"] || raw.phone || "";
        const company = cd["Company"] || raw.company || "";
        const source = raw.leadSource?.name || raw.source || "";
        const status = raw.currentStatus?.name || raw.status || "";
        const notes = cd["Notes"] || raw.notes || "";
        const ownerName = typeof raw.owner === 'object' && raw.owner !== null
          ? (raw.owner.name || raw.owner.fullName || raw.owner.email || '')
          : (raw.owner || raw.user?.name || raw.createdBy?.name || '');
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
        } as Lead;
      });
      setLeads(mapped);
    } catch (err: any) {
      console.error("Error fetching leads:", err);
      setError(err.message || "Failed to fetch leads");
    } finally {
      setIsLoading(false);
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
                      <Badge color="blue" size="sm">
                        {lead.source}
                      </Badge>
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
                    <Table.Cell>{formatDate(lead.createdAt)}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <PermissionGate permission="leads:read">
                          <Button
                            size="sm"
                            color="gray"
                            onClick={() => router.push(`/apps/leads/${lead._id}`)}
                            title="View Details"
                          >
                            <Icon icon="lucide:eye" className="w-3 h-3" />
                          </Button>
                        </PermissionGate>
                        <PermissionGate permission="leads:update">
                          <Button
                            size="sm"
                            color="blue"
                            onClick={() => router.push(`/apps/leads/edit/${lead._id}`)}
                            title="Edit"
                          >
                            <Icon icon="lucide:edit" className="w-3 h-3" />
                          </Button>
                        </PermissionGate>
                        <PermissionGate permission="leads:delete">
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
    </div>
  );
};

export default LeadsPage;

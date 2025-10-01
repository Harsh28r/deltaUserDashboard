"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Spinner, Table, Avatar } from "flowbite-react";
import { useAuth } from "@/app/context/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import { Icon } from "@iconify/react";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ReportsTo {
  user: User;
  teamType: string;
  project?: {
    _id: string;
    name: string;
  };
  context: string;
  path: string;
  _id: string;
}

interface Subordinate {
  _id: string;
  user: User;
  reportsTo: ReportsTo[];
  level: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface HierarchyResponse {
  subordinates: Subordinate[];
  pagination: Pagination;
}

const TeamHierarchyPage = () => {
  const { token, user } = useAuth();
  const [hierarchyData, setHierarchyData] = useState<HierarchyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch team hierarchy
  useEffect(() => {
    if (token && user?.id) {
      fetchTeamHierarchy();
    }
  }, [token, user?.id, currentPage]);

  const fetchTeamHierarchy = async () => {
    if (!user?.id) {
      setError("User ID not found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const apiUrl = API_ENDPOINTS.TEAM_HIERARCHY(user.id);
      console.log('Fetching team hierarchy from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to fetch team hierarchy: ${response.status} - ${errorText}`);
      }

      const data: HierarchyResponse = await response.json();
      console.log('Team hierarchy data received:', data);
      setHierarchyData(data);
    } catch (err: any) {
      console.error("Error fetching team hierarchy:", err);
      setError(err.message || "Failed to fetch team hierarchy data");
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamTypeBadgeColor = (teamType: string) => {
    switch (teamType.toLowerCase()) {
      case 'project':
        return 'info';
      case 'functional':
        return 'success';
      case 'department':
        return 'warning';
      default:
        return 'gray';
    }
  };

  const getLevelBadgeColor = (level: number) => {
    if (level <= 2) return 'purple';
    if (level <= 4) return 'blue';
    if (level <= 6) return 'cyan';
    return 'gray';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner size="xl" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading team hierarchy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-8">
            <Icon icon="solar:danger-circle-line-duotone" className="mx-auto text-red-500" width={64} height={64} />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Error Loading Data</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{error}</p>
            <Button color="primary" className="mt-4" onClick={fetchTeamHierarchy}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Icon icon="solar:users-group-two-rounded-line-duotone" width={32} height={32} />
            Team Hierarchy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View your team members and reporting structure
          </p>
        </div>
        <Button color="primary" onClick={fetchTeamHierarchy}>
          <Icon icon="solar:refresh-circle-line-duotone" className="mr-2" width={20} height={20} />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Icon icon="solar:users-group-rounded-line-duotone" className="text-blue-600 dark:text-blue-400" width={32} height={32} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Team Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {hierarchyData?.pagination.totalItems || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Icon icon="solar:user-check-rounded-line-duotone" className="text-green-600 dark:text-green-400" width={32} height={32} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Direct Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {hierarchyData?.subordinates.filter(s => s.reportsTo.some(r => r.user._id === user?.id)).length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Icon icon="solar:layers-line-duotone" className="text-purple-600 dark:text-purple-400" width={32} height={32} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organization Levels</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {hierarchyData?.subordinates.length ? Math.max(...hierarchyData.subordinates.map(s => s.level)) : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Members</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            People who report to you directly or indirectly
          </p>
        </div>

        {hierarchyData?.subordinates && hierarchyData.subordinates.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Team Member</Table.HeadCell>
                <Table.HeadCell>Level</Table.HeadCell>
                <Table.HeadCell>Reports To</Table.HeadCell>
                <Table.HeadCell>Team Type</Table.HeadCell>
                <Table.HeadCell>Project</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {hierarchyData.subordinates.map((subordinate) => (
                  <Table.Row key={subordinate._id} className="bg-white dark:bg-gray-800">
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar 
                          placeholderInitials={subordinate.user.name.substring(0, 2).toUpperCase()}
                          rounded
                          size="sm"
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {subordinate.user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {subordinate.user.email}
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getLevelBadgeColor(subordinate.level)}>
                        Level {subordinate.level}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="space-y-1">
                        {subordinate.reportsTo.map((report, idx) => (
                          <div key={report._id} className="text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {report.user.name}
                            </span>
                            {idx < subordinate.reportsTo.length - 1 && <span className="text-gray-400">, </span>}
                          </div>
                        ))}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="space-y-1">
                        {subordinate.reportsTo.map((report) => (
                          <Badge key={report._id} color={getTeamTypeBadgeColor(report.teamType)} className="mb-1">
                            {report.teamType}
                          </Badge>
                        ))}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="space-y-1">
                        {subordinate.reportsTo.map((report) => (
                          <div key={report._id} className="text-sm text-gray-700 dark:text-gray-300">
                            {report.project?.name || '-'}
                          </div>
                        ))}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button size="xs" color="light">
                          <Icon icon="solar:eye-line-duotone" width={16} height={16} />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon icon="solar:users-group-rounded-line-duotone" className="mx-auto text-gray-400" width={64} height={64} />
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No Team Members</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              No subordinates found in the hierarchy.
            </p>
          </div>
        )}

        {/* Pagination */}
        {hierarchyData?.pagination && hierarchyData.pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing page {hierarchyData.pagination.currentPage} of {hierarchyData.pagination.totalPages}
              {' '}({hierarchyData.pagination.totalItems} total items)
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="light"
                disabled={hierarchyData.pagination.currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                color="light"
                disabled={hierarchyData.pagination.currentPage === hierarchyData.pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeamHierarchyPage;


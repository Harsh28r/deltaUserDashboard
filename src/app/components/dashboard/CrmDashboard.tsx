"use client";
import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Alert } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import { API_BASE_URL } from "@/lib/config";
import SimpleChart from "./SimpleChart";

// Types for the API response
interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  convertedLeads: number;
  conversionRate: string;
  estimatedRevenue: number;
}

interface ChartData {
  leadsByStatus: Array<{
    _id: string;
    name: string;
    count: number;
    percentage: number;
  }>;
  topSources: Array<{
    _id: string | null;
    name: string | null;
    count: number;
  }>;
  topPartners: Array<{
    _id: string | null;
    name: string | null;
    count: number;
  }>;
}

interface Lead {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  project: {
    _id: string;
    name: string;
  };
  channelPartner: {
    _id: string;
    name: string;
  } | null;
  leadSource: {
    _id: string;
    name: string;
  };
  currentStatus: {
    _id: string;
    name: string;
    is_final_status: boolean;
  };
  customData: {
    "First Name": string;
    Email: string;
    Phone: string;
    "Lead Priority": string;
    "Property Type": string;
    Configuration: string;
    "Funding Mode": string;
    Gender: string;
    Budget: string;
    Notes?: string;
    Remark?: string;
    "Booking Date"?: string;
  };
  cpSourcingId: string | null;
  statusHistory: Array<{
    status: string;
    data: any;
    changedAt: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
  propertyType: string;
  location: string;
  price: number;
  daysOpen: number;
}

interface UserPerformance {
  _id: string;
  name: string;
  email: string;
  totalLeads: number;
  convertedLeads: number;
  totalRevenue: number;
  finalStatuses: Array<{
    _id: string;
    name: string;
    formFields: Array<{
      name: string;
      type: string;
      required: boolean;
      options: any[];
      _id: string;
    }>;
    is_final_status: boolean;
    is_default_status: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  conversionRate: number;
}

interface ProjectSummary {
  _id: string;
  projectName: string;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  avgPrice: number;
  totalRevenue: number;
  finalStatusBreakdown: {
    [key: string]: number;
  };
}

interface DashboardData {
  stats: DashboardStats;
  charts: ChartData;
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  performance: UserPerformance[];
  projectSummary: ProjectSummary[];
}

const CrmDashboard = () => {
  const { token, user, projectAccess } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is super admin or has admin privileges
  const isSuperAdmin = user?.role === 'superadmin' || user?.role === 'admin';
  const canViewAllData = isSuperAdmin || projectAccess?.canAccessAll;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user) return;

      try {
        setLoading(true);
        
        // Determine API endpoints based on user role
        const baseParams = canViewAllData ? '' : `?userId=${user.id}`;
        
        // Fetch stats, leads, performance, and project summary data
        const [statsResponse, leadsResponse, performanceResponse, projectSummaryResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/stats${baseParams}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/dashboard/leads${baseParams}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/dashboard/user-performance${baseParams}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/api/dashboard/project-summary${baseParams}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        if (!statsResponse.ok || !leadsResponse.ok || !performanceResponse.ok || !projectSummaryResponse.ok) {
          throw new Error(`HTTP error! status: ${statsResponse.status} / ${leadsResponse.status} / ${performanceResponse.status} / ${projectSummaryResponse.status}`);
        }

        const [statsData, leadsData, performanceData, projectSummaryData] = await Promise.all([
          statsResponse.json(),
          leadsResponse.json(),
          performanceResponse.json(),
          projectSummaryResponse.json()
        ]);

        // Combine the data
        const combinedData: DashboardData = {
          stats: statsData.stats,
          charts: statsData.charts,
          leads: leadsData.leads,
          pagination: leadsData.pagination,
          performance: performanceData.performance,
          projectSummary: projectSummaryData.summary || []
        };

        setDashboardData(combinedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user, canViewAllData]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Icon icon="solar:loading-line-duotone" className="text-4xl animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert color="failure" className="mb-4">
        <Icon icon="solar:danger-circle-line-duotone" className="mr-2" />
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert color="info" className="mb-4">
        <Icon icon="solar:info-circle-line-duotone" className="mr-2" />
        No dashboard data available
      </Alert>
    );
  }

  const { stats, charts, leads, pagination, performance, projectSummary } = dashboardData;

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'hot': return 'failure';
      case 'warm': return 'warning';
      case 'cold': return 'info';
      default: return 'gray';
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {canViewAllData ? 'Management Dashboard' : 'My Dashboard'}
            </h1>
            <div className="flex items-center space-x-6 text-blue-100">
              <div className="flex items-center space-x-2">
                <Icon icon="solar:calendar-line-duotone" className="text-xl" />
                <span>Last Updated: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon icon="solar:users-group-rounded-line-duotone" className="text-xl" />
                <span>
                  {canViewAllData ? `Team Performance: ${performance.length} Members` : 'Personal Performance'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              color="light" 
              size="sm"
              onClick={() => window.location.reload()}
            >
              <Icon icon="solar:refresh-line-duotone" className="mr-2" />
              Refresh Data
            </Button>
            <Button 
              color="light" 
              size="sm"
            >
              <Icon icon="solar:download-line-duotone" className="mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Lead Pipeline */}
        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {canViewAllData ? 'Lead Pipeline' : 'My Leads'}
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalLeads}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {canViewAllData ? 'Total Leads' : 'Assigned to Me'}
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
              <Icon icon="solar:users-group-rounded-line-duotone" className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Icon icon="solar:trend-up-line-duotone" className="text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">Active Pipeline</span>
          </div>
        </Card>

        {/* Conversion Performance */}
        <Card className="p-6 border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Conversion Rate</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.conversionRate}%</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-xl">
              <Icon icon="solar:chart-line-duotone" className="text-3xl text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Icon icon="solar:trend-up-line-duotone" className="text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">Above Industry Average</span>
          </div>
        </Card>

        {/* Total Projects */}
        <Card className="p-6 border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {canViewAllData ? 'Total Projects' : 'My Projects'}
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                {projectSummary.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {canViewAllData ? 'Active Portfolio' : 'Assigned to Me'}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-xl">
              <Icon icon="solar:buildings-line-duotone" className="text-3xl text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Icon icon="solar:trend-up-line-duotone" className="text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">Portfolio Growth</span>
          </div>
        </Card>

        {/* Team Performance */}
        <Card className="p-6 border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                {canViewAllData ? 'Team Efficiency' : 'My Performance'}
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                {canViewAllData ? performance.length : '100%'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {canViewAllData ? 'Active Team Members' : 'Conversion Rate'}
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900 rounded-xl">
              <Icon icon="solar:users-group-two-rounded-line-duotone" className="text-3xl text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Icon icon="solar:trend-up-line-duotone" className="text-green-500 mr-1" />
            <span className="text-green-600 dark:text-green-400 font-medium">High Performance Team</span>
          </div>
        </Card>
      </div>

      {/* Strategic Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Pipeline Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lead Pipeline Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current lead distribution and conversion funnel</p>
            </div>
            <Icon icon="solar:pie-chart-line-duotone" className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <SimpleChart
            data={charts.leadsByStatus.map((status, index) => ({
              name: status.name,
              value: status.count,
              percentage: status.percentage,
              color: index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : '#F59E0B'
            }))}
            type="pie"
            className="p-0"
          />
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Pipeline Health</span>
              <Badge color="success" size="sm">Excellent</Badge>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
              {stats.conversionRate}% conversion rate exceeds industry standards
            </p>
          </div>
        </Card>

        {/* Channel Performance Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Channel Partner Performance</h3>
            </div>
            <Icon icon="solar:chart-2-line-duotone" className="text-2xl text-green-600 dark:text-green-400" />
          </div>
          <SimpleChart
            data={charts.topSources.map((source, index) => ({
              name: source.name || 'Unknown Source',
              value: source.count,
              color: index === 0 ? '#8B5CF6' : index === 1 ? '#06B6D4' : '#F59E0B'
            }))}
            type="bar"
            className="p-0"
          />
        </Card>
      </div>

      {/* Market Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lead Quality Analysis */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lead Quality Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Priority distribution and lead scoring</p>
            </div>
            <Icon icon="solar:chart-2-line-duotone" className="text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <SimpleChart
            data={(() => {
              const priorityCounts = leads.reduce((acc, lead) => {
                const priority = lead.customData["Lead Priority"];
                acc[priority] = (acc[priority] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
              
              return Object.entries(priorityCounts).map(([priority, count], index) => ({
                name: priority,
                value: count,
                color: getPriorityColor(priority) === 'failure' ? '#EF4444' : 
                       getPriorityColor(priority) === 'warning' ? '#F59E0B' : '#3B82F6'
              }));
            })()}
            type="pie"
            className="p-0"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-red-50 dark:bg-red-900 rounded-lg">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {leads.filter(lead => lead.customData["Lead Priority"] === 'Hot').length}
              </p>
              <p className="text-xs text-red-700 dark:text-red-200">Hot Leads</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {leads.filter(lead => lead.customData["Lead Priority"] === 'Warm').length}
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-200">Warm Leads</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {leads.filter(lead => lead.customData["Lead Priority"] === 'Cold').length}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-200">Cold Leads</p>
            </div>
          </div>
        </Card>

        {/* Portfolio Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Portfolio Performance</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Project-wise lead generation and conversion</p>
            </div>
            <Icon icon="solar:buildings-line-duotone" className="text-2xl text-green-600 dark:text-green-400" />
          </div>
          <SimpleChart
            data={projectSummary.map((project, index) => ({
              name: project.projectName,
              value: project.convertedLeads,
              color: index === 0 ? '#10B981' : index === 1 ? '#3B82F6' : '#8B5CF6'
            }))}
            type="bar"
            className="p-0"
          />
          <div className="mt-4 space-y-2">
            {projectSummary.map((project) => (
              <div key={project._id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{project.projectName}</span>
                  <Badge color="info" size="sm">{project.conversionRate}%</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{project.convertedLeads}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Final Closure</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Business KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Days to Close */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Days to Close</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(() => {
                  const closedLeads = leads.filter(lead => lead.currentStatus.is_final_status);
                  if (closedLeads.length === 0) return 'N/A';
                  const avgDays = closedLeads.reduce((sum, lead) => sum + lead.daysOpen, 0) / closedLeads.length;
                  return Math.round(avgDays);
                })()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Icon icon="solar:clock-circle-line-duotone" className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        {/* Hot Leads Count */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hot Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {leads.filter(lead => lead.customData["Lead Priority"] === 'Hot').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <Icon icon="solar:fire-line-duotone" className="text-2xl text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        {/* Channel Partner Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Partner Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {leads.filter(lead => lead.channelPartner).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Icon icon="solar:users-group-two-rounded-line-duotone" className="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        {/* Budget Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Value Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {leads.filter(lead => lead.customData.Budget === 'Above 5 Crores').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Icon icon="solar:dollar-minimalistic-line-duotone" className="text-2xl text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Organizational Performance Section - Only for Super Admins */}
      {canViewAllData && (
        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Organizational Performance</h3>
              <p className="text-gray-600 dark:text-gray-400">Team efficiency metrics and performance analytics</p>
            </div>
            <div className="flex items-center space-x-2">
              <Icon icon="solar:users-group-rounded-line-duotone" className="text-2xl text-blue-600 dark:text-blue-400" />
              <Badge color="success" size="lg">High Performance Team</Badge>
            </div>
          </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Analytics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Conversion Performance Matrix</h4>
            <SimpleChart
              data={performance.map((user, index) => ({
                name: user.name,
                value: user.conversionRate,
                color: index === 0 ? '#10B981' : index === 1 ? '#3B82F6' : '#8B5CF6'
              }))}
              type="bar"
              className="p-0"
            />
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Team Average</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(performance.reduce((sum, user) => sum + user.conversionRate, 0) / performance.length)}%
                </span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-200 mt-1">
                Exceeds industry benchmark of 25%
              </p>
            </div>
          </div>
          
          {/* Performance Scorecard */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Individual Scorecards</h4>
            <div className="space-y-4">
              {performance.map((user, index) => (
                <div key={user._id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-green-100 dark:bg-green-900' : 
                        index === 1 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        <Icon icon="solar:user-line-duotone" className={`text-xl ${
                          index === 0 ? 'text-green-600 dark:text-green-400' : 
                          index === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'
                        }`} />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        color={user.conversionRate >= 80 ? "success" : user.conversionRate >= 50 ? "warning" : "failure"}
                        size="lg"
                      >
                        {user.conversionRate}% Conversion
                      </Badge>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {user.conversionRate >= 80 ? 'Excellent' : user.conversionRate >= 50 ? 'Good' : 'Needs Improvement'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.totalLeads}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Leads</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{user.convertedLeads}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Converted</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{user.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Revenue</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      )}
    </div>
  );
};

export default CrmDashboard;

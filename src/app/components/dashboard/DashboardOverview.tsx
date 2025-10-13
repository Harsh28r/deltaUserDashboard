"use client";
import React from "react";
import { Card, Badge, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import CrmDashboard from "./CrmDashboard";
import AttendanceWidget from "./AttendanceWidget";

const DashboardOverview = () => {
  const { user, projectAccess } = useAuth();
  
  // Check if user is super admin or has admin privileges
  const isSuperAdmin = user?.role === 'superadmin' || user?.role === 'admin';
  const canViewAllData = isSuperAdmin || projectAccess?.canAccessAll;

  // Get current time and greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const greeting = getGreeting();
  const userName = user?.name || "User";
  const currentTime = getCurrentTime();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  Welcome Back!
                </h1>
                <h2 className="text-2xl font-semibold text-blue-100 mb-1">
                  {greeting}, {userName}!
                </h2>
                <p className="text-blue-200 text-lg">
                  {canViewAllData ? 'Management dashboard overview' : 'Your personalized dashboard overview'}
                </p>
              </div>
              
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:calendar-line-duotone" className="text-xl" />
                  <span className="text-sm">{currentTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon icon="solar:shield-check-line-duotone" className="text-xl" />
                  <Badge color="success" size="sm">All Systems Operational</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                color="light" 
                size="sm"
                onClick={() => window.location.reload()}
                className="hover:bg-white/20 transition-colors"
              >
                <Icon icon="solar:refresh-line-duotone" className="mr-2" />
                Refresh Data
              </Button>
              <Button 
                color="light" 
                size="sm"
                className="hover:bg-white/20 transition-colors"
              >
                <Icon icon="solar:download-line-duotone" className="mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttendanceWidget />
        </div>
        
        {/* Quick Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {canViewAllData ? "Today's Activity" : "My Activity"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {canViewAllData ? "24" : "8"}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                <Icon icon="solar:trend-up-line-duotone" className="inline mr-1" />
                {canViewAllData ? "+12% from yesterday" : "+3 new leads today"}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Icon icon="solar:activity-line-duotone" className="text-2xl text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {canViewAllData ? "Pending Tasks" : "My Tasks"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {canViewAllData ? "8" : "3"}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                <Icon icon="solar:clock-circle-line-duotone" className="inline mr-1" />
                {canViewAllData ? "3 due today" : "2 due today"}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Icon icon="solar:checklist-minimalistic-line-duotone" className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Messages</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                <Icon icon="solar:chat-round-line-duotone" className="inline mr-1" />
                2 unread
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Icon icon="solar:chat-round-line-duotone" className="text-2xl text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

          <Card className="p-6 border-l-4 border-l-orange-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notifications</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  <Icon icon="solar:bell-line-duotone" className="inline mr-1" />
                  4 important
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Icon icon="solar:bell-line-duotone" className="text-2xl text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <CrmDashboard />
    </div>
  );
};

export default DashboardOverview;

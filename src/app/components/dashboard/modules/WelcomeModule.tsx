"use client";

import React from "react";
import { Card, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";

const WelcomeModule = () => {
  const { user, userPermissions, projectAccess } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getRoleDisplay = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin':
        return 'Super Administrator';
      case 'admin':
        return 'Administrator';
      case 'devops':
        return 'DevOps Engineer';
      case 'sales':
        return 'Sales Representative';
      case 'user':
        return 'User';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <Icon icon="solar:check-circle-line-duotone" className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <Icon icon="solar:close-circle-line-duotone" className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  return (
    <Card className="h-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 border-orange-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">Welcome Back!</h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Your dashboard overview</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
          <span className="text-white font-bold text-sm sm:text-lg">
            {user?.name?.charAt(0) || 'U'}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.name || 'User'}!
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {getRoleDisplay(user?.role || 'User')} • Level {user?.level || 1}
            </p>
            {user?.isActive !== undefined && getStatusBadge(user.isActive)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              {userPermissions.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Permissions
            </div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              {projectAccess?.canAccessAll ? '∞' : (projectAccess?.allowedProjects?.length || 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {projectAccess?.canAccessAll ? 'All Projects' : 'Projects'}
            </div>
          </div>
        </div>
        
        {/* Additional Info Row */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Account Status
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {user?.isActive ? 'Active Account' : 'Account Suspended'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button color="primary" size="sm" className="flex-1 text-xs sm:text-sm">
            <Icon icon="solar:chart-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
            Analytics
          </Button>
          <Button color="light" size="sm" className="flex-1 text-xs sm:text-sm">
            <Icon icon="solar:settings-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
            Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeModule;





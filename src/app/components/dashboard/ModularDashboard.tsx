"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { useModuleSelection } from "@/app/context/ModuleContext";
import WelcomeModule from "./modules/WelcomeModule";
import LeadsModule from "./modules/LeadsModule";
import NotificationsModule from "./modules/NotificationsModule";
import LeadsSourceModule from "./modules/LeadsSourceModule";
import LeadsStatusModule from "./modules/LeadsStatusModule";
import UserManagementModule from "./modules/UserManagementModule";

const ModularDashboard = () => {
  const { user } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const { selectedModule } = useModuleSelection();

  // Check if user has any dashboard permissions
  const hasDashboardAccess = hasAnyPermission([
    'leads:read',
    'notifications:read',
    'leadssource:read',
    'leadsstatus:read',
    'user:read_all'
  ]);



  if (!hasDashboardAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:lock-line-duotone" className="text-gray-400" height={48} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Dashboard Access
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to view the dashboard. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  const renderSelectedModule = () => {
    switch (selectedModule) {
      case 'leads':
        return <LeadsModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'leadsource':
        return <LeadsSourceModule />;
      case 'leadsstatus':
        return <LeadsStatusModule />;
      case 'usermanagement':
        return <UserManagementModule />;
      default:
        return <WelcomeModule />;
    }
  };

  return (
    <div className="space-y-6">


      {selectedModule ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedModule === 'leads' && 'Leads Management'}
              {selectedModule === 'notifications' && 'Notifications'}
              {selectedModule === 'leadsource' && 'Lead Sources'}
              {selectedModule === 'leadsstatus' && 'Lead Status'}
              {selectedModule === 'usermanagement' && 'User Management'}
            </h3>
          </div>
          {renderSelectedModule()}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <WelcomeModule />
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="solar:widget-add-line-duotone" className="text-gray-400" height={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select a Module
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a module from the sidebar to view its details and manage your data.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModularDashboard;

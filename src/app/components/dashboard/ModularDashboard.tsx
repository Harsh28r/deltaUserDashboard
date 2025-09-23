"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { useModuleSelection } from "@/app/context/ModuleContext";
import WelcomeModule from "./modules/WelcomeModule";
import UserInfoCard from "./modules/UserInfoCard";
import LeadsModule from "./modules/LeadsModule";
import NotificationsModule from "./modules/NotificationsModule";
import LeadsSourceModule from "./modules/LeadsSourceModule";
import LeadsStatusModule from "./modules/LeadsStatusModule";
import UserManagementModule from "./modules/UserManagementModule";

const ModularDashboard = () => {
  const { user, userPermissions } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const { selectedModule } = useModuleSelection();

  // Check if user has any dashboard permissions - use actual permissions from API
  const hasDashboardAccess = userPermissions.length > 0 || hasAnyPermission([
    'leads:read',
    'leadssource:read',
    'leadssource:read_all',
    'leadsstatus:read',
    'leadsstatus:read_all',
    'notifications:read',
    'user:read_all',
    'channel-partners:read',
    'channel-partners:read_all'
  ]);

  // Check specific module permissions
  const canAccessLeads = hasAnyPermission(['leads:read', 'leads:read_all']) || 
    userPermissions.some(p => p.includes('leads'));
  
  const canAccessLeadSources = hasAnyPermission(['leadssource:read', 'leadssource:read_all']) || 
    userPermissions.some(p => p.includes('leadssource'));
  
  const canAccessLeadStatuses = hasAnyPermission(['leadsstatus:read', 'leadsstatus:read_all']) || 
    userPermissions.some(p => p.includes('leadsstatus'));
  
  const canAccessUserManagement = hasAnyPermission(['user:read_all', 'user:read']) || 
    userPermissions.some(p => p.includes('user'));
  
  const canAccessChannelPartners = hasAnyPermission(['channel-partners:read', 'channel-partners:read_all']) || 
    userPermissions.some(p => p.includes('channel-partner'));

  // If user has no permissions at all, show access denied
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
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Debug Info:</strong> User has {userPermissions.length} permissions: {userPermissions.join(', ')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderSelectedModule = () => {
    switch (selectedModule) {
      case 'leads':
      case 'leads-main':
        return canAccessLeads ? <LeadsModule /> : <div className="text-center py-8"><p>No permission to access Leads module</p></div>;
      case 'notifications':
        return <NotificationsModule />;
      case 'leadsource':
        return canAccessLeadSources ? <LeadsSourceModule /> : <div className="text-center py-8"><p>No permission to access Lead Sources module</p></div>;
      case 'leadsstatus':
        return canAccessLeadStatuses ? <LeadsStatusModule /> : <div className="text-center py-8"><p>No permission to access Lead Statuses module</p></div>;
      case 'usermanagement':
        return canAccessUserManagement ? <UserManagementModule /> : <div className="text-center py-8"><p>No permission to access User Management module</p></div>;
      case 'channel-partners':
        return canAccessChannelPartners ? <div className="text-center py-8"><p>Channel Partners module - Coming soon!</p></div> : <div className="text-center py-8"><p>No permission to access Channel Partners module</p></div>;
      default:
        return <WelcomeModule />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {selectedModule ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {selectedModule === 'leads' && 'Leads Management'}
              {selectedModule === 'leads-main' && 'All Leads'}
              {selectedModule === 'leadsource' && 'Lead Sources'}
              {selectedModule === 'leadsstatus' && 'Lead Statuses'}
              {selectedModule === 'notifications' && 'Notifications'}
              {selectedModule === 'usermanagement' && 'User Management'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            {renderSelectedModule()}
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {/* Welcome Section */}
          <div className="mb-4 sm:mb-6">
            <WelcomeModule />
          </div>
          
          {/* User Information Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <UserInfoCard />
          </div>
          
          {/* Available Modules */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 lg:p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Lead Sources Module */}
              {canAccessLeadSources && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:folder-line-duotone" className="text-blue-600 dark:text-blue-400" height={20} width={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Lead Sources</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage lead sources</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Statuses Module */}
              {canAccessLeadStatuses && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:check-circle-line-duotone" className="text-green-600 dark:text-green-400" height={20} width={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Lead Statuses</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage lead statuses</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Leads Module */}
              {canAccessLeads && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:users-group-rounded-line-duotone" className="text-orange-600 dark:text-orange-400" height={20} width={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Leads</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage leads</p>
                    </div>
                  </div>
                </div>
              )}

              {/* User Management Module */}
              {canAccessUserManagement && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:user-id-line-duotone" className="text-red-600 dark:text-red-400" height={20} width={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">User Management</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage users</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Channel Partners Module */}
              {canAccessChannelPartners && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Icon icon="solar:users-group-two-rounded-line-duotone" className="text-purple-600 dark:text-purple-400" height={20} width={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Channel Partners</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Manage channel partners</p>
                    </div>
                  </div>
                </div>
              )}

              {/* No modules available */}
              {!canAccessLeads && !canAccessLeadSources && !canAccessLeadStatuses && !canAccessUserManagement && !canAccessChannelPartners && (
                <div className="col-span-full text-center py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon icon="solar:widget-add-line-duotone" className="text-gray-400" height={24} width={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Modules Available
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
                    You don't have permission to access any modules. Please contact your administrator.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModularDashboard;

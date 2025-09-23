"use client";

import React from "react";
import { Card, Badge } from "flowbite-react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";

const UserInfoCard = () => {
  const { user, userPermissions, projectAccess } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'sales':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'devops':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPermissionCategory = (permission: string) => {
    if (permission.includes('leadssource')) return 'Lead Sources';
    if (permission.includes('leadsstatus')) return 'Lead Statuses';
    if (permission.includes('leads')) return 'Leads';
    if (permission.includes('user')) return 'User Management';
    if (permission.includes('project')) return 'Projects';
    return 'Other';
  };

  const groupedPermissions = userPermissions.reduce((acc, permission) => {
    const category = getPermissionCategory(permission);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="space-y-6">
      {/* User Basic Info */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h3>
          <Badge color="blue" size="sm">
            <Icon icon="solar:user-line-duotone" className="w-3 h-3 mr-1" />
            Profile
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
            <p className="text-gray-900 dark:text-white flex items-center gap-2">
              <Icon icon="solar:user-line-duotone" className="w-4 h-4 text-gray-400" />
              {user?.name || 'N/A'}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
            <p className="text-gray-900 dark:text-white flex items-center gap-2">
              <Icon icon="solar:mailbox-line-duotone" className="w-4 h-4 text-gray-400" />
              {user?.email || 'N/A'}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
            <div className="flex items-center gap-2">
              <Badge className={getRoleColor(user?.role || 'user')}>
                {user?.role || 'User'}
              </Badge>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</label>
            <p className="text-gray-900 dark:text-white flex items-center gap-2">
              <Icon icon="solar:star-line-duotone" className="w-4 h-4 text-gray-400" />
              Level {user?.level || 1}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
            <div className="flex items-center gap-2">
              {user?.isActive !== undefined ? (
                <Badge color={user.isActive ? 'success' : 'failure'}>
                  <Icon 
                    icon={user.isActive ? "solar:check-circle-line-duotone" : "solar:close-circle-line-duotone"} 
                    className="w-3 h-3 mr-1" 
                  />
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              ) : (
                <span className="text-gray-500">Unknown</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
            <p className="text-gray-900 dark:text-white font-mono text-sm">
              {user?.id || 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* Permissions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions</h3>
          <Badge color="green" size="sm">
            <Icon icon="solar:shield-check-line-duotone" className="w-3 h-3 mr-1" />
            {userPermissions.length} Total
          </Badge>
        </div>
        
        {Object.keys(groupedPermissions).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(([category, permissions]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {category} ({permissions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {permissions.map((permission, index) => (
                    <Badge key={index} color="blue" size="sm">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Icon icon="solar:shield-cross-line-duotone" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">No permissions assigned</p>
          </div>
        )}
      </Card>

      {/* Debug Information */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Debug Information</h3>
          <Badge color="warning" size="sm">
            <Icon icon="solar:bug-line-duotone" className="w-3 h-3 mr-1" />
            Debug
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div>
            <strong className="text-yellow-800 dark:text-yellow-200">Total Permissions:</strong> 
            <span className="ml-2 text-yellow-700 dark:text-yellow-300">{userPermissions.length}</span>
          </div>
          <div>
            <strong className="text-yellow-800 dark:text-yellow-200">Permission List:</strong>
            <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300 break-all">
              {userPermissions.length > 0 ? userPermissions.join(', ') : 'No permissions found'}
            </div>
          </div>
          <div>
            <strong className="text-yellow-800 dark:text-yellow-200">User Role:</strong> 
            <span className="ml-2 text-yellow-700 dark:text-yellow-300">{user?.role || 'Unknown'}</span>
          </div>
          <div>
            <strong className="text-yellow-800 dark:text-yellow-200">User Level:</strong> 
            <span className="ml-2 text-yellow-700 dark:text-yellow-300">{user?.level || 'Unknown'}</span>
          </div>
          <div>
            <strong className="text-yellow-800 dark:text-yellow-200">Account Status:</strong> 
            <span className="ml-2 text-yellow-700 dark:text-yellow-300">{user?.isActive ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </Card>

      {/* Project Access */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Access</h3>
          <Badge color="purple" size="sm">
            <Icon icon="solar:folder-line-duotone" className="w-3 h-3 mr-1" />
            {projectAccess?.canAccessAll ? 'All Projects' : 'Limited Access'}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Access Level</label>
              <p className="text-gray-900 dark:text-white">
                {projectAccess?.canAccessAll ? 'All Projects' : 'Specific Projects'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Projects</label>
              <p className="text-gray-900 dark:text-white">
                {projectAccess?.maxProjects === null ? 'Unlimited' : projectAccess?.maxProjects || 'Not Set'}
              </p>
            </div>
          </div>
          
          {projectAccess?.allowedProjects && projectAccess.allowedProjects.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Allowed Projects</label>
              <div className="flex flex-wrap gap-2">
                {projectAccess.allowedProjects.map((project, index) => (
                  <Badge key={index} color="success" size="sm">
                    {project}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {projectAccess?.deniedProjects && projectAccess.deniedProjects.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Denied Projects</label>
              <div className="flex flex-wrap gap-2">
                {projectAccess.deniedProjects.map((project, index) => (
                  <Badge key={index} color="failure" size="sm">
                    {project}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserInfoCard;

"use client";

import React from "react";
import { Card, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import PermissionGate from "@/app/components/auth/PermissionGate";

const UserManagementModule = () => {
  return (
    <PermissionGate permission="user:read_all">
      <Card className="h-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Manage users</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
            <Icon icon="solar:user-id-line-duotone" className="text-red-600 dark:text-red-400" height={20} width={20} />
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">24</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">3</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Active Today</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <PermissionGate permission="user:create">
              <Button color="failure" className="w-full text-xs sm:text-sm">
                <Icon icon="solar:add-circle-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
                <span className="hidden sm:inline">Add New User</span>
                <span className="sm:hidden">Add User</span>
              </Button>
            </PermissionGate>
            
            <PermissionGate permission="user:read_all">
              <Button color="light" className="w-full text-xs sm:text-sm">
                <Icon icon="solar:eye-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
                <span className="hidden sm:inline">View All Users</span>
                <span className="sm:hidden">View Users</span>
              </Button>
            </PermissionGate>
          </div>
        </div>
      </Card>
    </PermissionGate>
  );
};

export default UserManagementModule;





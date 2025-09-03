"use client";

import React from "react";
import { Card, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import PermissionGate from "@/app/components/auth/PermissionGate";

const UserManagementModule = () => {
  return (
    <PermissionGate permission="user:read_all">
      <Card className="h-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage users</p>
          </div>
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
            <Icon icon="solar:user-id-line-duotone" className="text-red-600 dark:text-red-400" height={24} />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">3</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Today</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <PermissionGate permission="user:create">
              <Button color="failure" className="w-full">
                <Icon icon="solar:add-circle-line-duotone" className="mr-2" height={16} />
                Add New User
              </Button>
            </PermissionGate>
            
            <PermissionGate permission="user:read_all">
              <Button color="light" className="w-full">
                <Icon icon="solar:eye-line-duotone" className="mr-2" height={16} />
                View All Users
              </Button>
            </PermissionGate>
          </div>
        </div>
      </Card>
    </PermissionGate>
  );
};

export default UserManagementModule;



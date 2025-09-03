"use client";

import React from "react";
import { Card, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import PermissionGate from "@/app/components/auth/PermissionGate";

const NotificationsModule = () => {
  return (
    <PermissionGate permission="notifications:read">
      <Card className="h-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
            <Icon icon="solar:bell-line-duotone" className="text-orange-600 dark:text-orange-400" height={24} />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">New lead assigned</span>
              </div>
              <span className="text-xs text-gray-500">2m ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">System update</span>
              </div>
              <span className="text-xs text-gray-500">1h ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Lead converted</span>
              </div>
              <span className="text-xs text-gray-500">3h ago</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <PermissionGate permission="notifications:update">
              <Button color="primary" className="w-full">
                <Icon icon="solar:bell-line-duotone" className="mr-2" height={16} />
                View All Notifications
              </Button>
            </PermissionGate>
            
            <PermissionGate permission="notifications:bulk-update">
              <Button color="light" className="w-full">
                <Icon icon="solar:check-read-line-duotone" className="mr-2" height={16} />
                Mark All as Read
              </Button>
            </PermissionGate>
          </div>
        </div>
      </Card>
    </PermissionGate>
  );
};

export default NotificationsModule;

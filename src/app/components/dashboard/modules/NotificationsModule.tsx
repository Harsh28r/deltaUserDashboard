"use client";

import React from "react";
import { Card, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import PermissionGate from "@/app/components/auth/PermissionGate";

const NotificationsModule = () => {
  return (
    <PermissionGate permission="notifications:read">
      <Card className="h-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Stay updated</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
            <Icon icon="solar:bell-line-duotone" className="text-orange-600 dark:text-orange-400" height={20} width={20} />
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">New lead assigned</span>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">2m ago</span>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">System update</span>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">1h ago</span>
            </div>
            <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center min-w-0 flex-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></div>
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">Lead converted</span>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">3h ago</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <PermissionGate permission="notifications:update">
              <Button color="primary" className="w-full text-xs sm:text-sm">
                <Icon icon="solar:bell-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
                <span className="hidden sm:inline">View All Notifications</span>
                <span className="sm:hidden">View All</span>
              </Button>
            </PermissionGate>
            
            <PermissionGate permission="notifications:bulk-update">
              <Button color="light" className="w-full text-xs sm:text-sm">
                <Icon icon="solar:check-read-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
                <span className="hidden sm:inline">Mark All as Read</span>
                <span className="sm:hidden">Mark Read</span>
              </Button>
            </PermissionGate>
          </div>
        </div>
      </Card>
    </PermissionGate>
  );
};

export default NotificationsModule;

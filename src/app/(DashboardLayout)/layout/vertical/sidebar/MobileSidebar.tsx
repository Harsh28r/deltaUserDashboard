"use client";
import React from "react";
import { Sidebar } from "flowbite-react";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import SideProfile from "./SideProfile/SideProfile";

import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { useModuleSelection } from "@/app/context/ModuleContext";

const MobileSidebar = () => {
  const { user } = useAuth();
  const { hasAnyPermission, userPermissions } = usePermissions();
  const { selectedModule, setSelectedModule } = useModuleSelection();



  const modules = [
    {
      id: 'leads',
      name: 'Leads',
      permission: 'leads:read',
      description: 'Manage your leads'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      permission: 'notifications:read',
      description: 'Stay updated'
    },
    {
      id: 'leadsource',
      name: 'Lead Sources',
      permission: 'leadssource:read',
      description: 'Track your sources'
    },
    {
      id: 'leadsstatus',
      name: 'Lead Status',
      permission: 'leadsstatus:read',
      description: 'Pipeline overview'
    },
    {
      id: 'usermanagement',
      name: 'User Management',
      permission: 'user:read_all',
      description: 'Manage users'
    }
  ];

  const filteredModules = modules.filter(module => 
    hasAnyPermission([module.permission])
  );

  return (
    <div className="w-full h-full">
      <Sidebar className="h-full bg-white dark:bg-darkgray">
        <div className="flex flex-col h-full">
          <div className="mb-6 flex items-center gap-2 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <Logo />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Sidebar.Items className="px-4">
              <Sidebar.ItemGroup>
                {/* Dashboard Home */}
                <Sidebar.Item href="/" className="mb-4">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Dashboard</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Overview</div>
                    </div>
                  </div>
                </Sidebar.Item>

                {/* Modules Section */}
                <div className="px-2 mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Your Modules
                  </h3>
                </div>

                 {filteredModules.map((module) => (
                  <Sidebar.Item
                    key={module.id}
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      setSelectedModule(selectedModule === module.id ? null : module.id);
                    }}
                    className={`mb-2 transition-all cursor-pointer ${
                      selectedModule === module.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">{module.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{module.description}</div>
                      </div>
                      {selectedModule === module.id && (
                        <span className="text-blue-500 text-sm">✓</span>
                      )}
                    </div>
                  </Sidebar.Item>
                ))}

                 {/* No modules message */}
                 {filteredModules.length === 0 && (
                  <div className="px-2 py-4 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No modules available
                    </p>
                  </div>
                )}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <SideProfile />
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default MobileSidebar;

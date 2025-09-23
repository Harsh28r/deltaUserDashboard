"use client";
import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import SideProfile from "./SideProfile/SideProfile";

import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { useModuleSelection } from "@/app/context/ModuleContext";
import { Icon } from "@iconify/react";

interface MobileSidebarProps {
  onClose?: () => void;
}

const MobileSidebar = ({ onClose }: MobileSidebarProps) => {
  const { user, userPermissions } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const { selectedModule, setSelectedModule } = useModuleSelection();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);



  const modules = [
    {
      id: 'leads',
      name: 'Leads',
      icon: 'solar:users-group-rounded-line-duotone',
      color: 'text-orange-600',
      permission: 'leads:read',
      description: 'Lead management system',
      hasSubmenu: true,
      submenu: [
        {
          id: 'leads-main',
          name: 'All Leads',
          permission: 'leads:read',
          description: 'View and manage all leads'
        },
        {
          id: 'leadsource',
          name: 'Lead Sources',
          permission: 'leadssource:read',
          description: 'Manage lead sources'
        },
        {
          id: 'leadsstatus',
          name: 'Lead Statuses',
          permission: 'leadsstatus:read',
          description: 'Manage lead statuses'
        }
      ]
    },
    {
      id: 'channel-partners',
      name: 'Channel Partners',
      icon: 'solar:users-group-two-rounded-line-duotone',
      color: 'text-purple-600',
      permission: 'channel-partners:read',
      description: 'Manage channel partners',
      hasSubmenu: false
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: 'solar:bell-line-duotone',
      color: 'text-blue-600',
      permission: 'notifications:read',
      description: 'Stay updated',
      hasSubmenu: false
    },
    {
      id: 'usermanagement',
      name: 'User Management',
      icon: 'solar:user-id-line-duotone',
      color: 'text-red-600',
      permission: 'user:read_all',
      description: 'Manage users',
      hasSubmenu: false
    }
  ];

  const toggleExpanded = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Enhanced permission checking using actual API permissions
  const hasModulePermission = (permission: string) => {
    // Check specific permission
    if (hasAnyPermission([permission])) return true;
    
    // Check if user has any permission that contains the module name
    const moduleName = permission.split(':')[0];
    return userPermissions.some(p => p.includes(moduleName));
  };

  const filteredModules = modules.filter(module => {
    if (module.hasSubmenu && module.submenu) {
      // For modules with submenu, check if user has permission for any submenu item
      return module.submenu.some(subItem => hasModulePermission(subItem.permission));
    }
    return hasModulePermission(module.permission);
  });

  return (
    <div className="w-full h-full">
      <Sidebar className="h-full bg-white dark:bg-darkgray">
        <div className="flex flex-col h-full">
          <div className="mb-6 flex items-center justify-between gap-2 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <Logo />
            <button
              onClick={() => {
                onClose?.();
              }}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Icon icon="solar:close-circle-line-duotone" className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <Sidebar.Items className="px-4">
              <Sidebar.ItemGroup>
                {/* Dashboard Home */}
                <Sidebar.Item 
                  href="/" 
                  className="mb-4"
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    setSelectedModule(null);
                    onClose?.();
                  }}
                >
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
                  <div key={module.id} className="mb-2">
                    {/* Main Module Item */}
                    <Sidebar.Item
                      href="#"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        if (module.hasSubmenu) {
                          toggleExpanded(module.id);
                        } else {
                          setSelectedModule(module.id);
                          onClose?.();
                        }
                      }}
                      className={`transition-all cursor-pointer ${
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
                        <div className="flex items-center gap-2">
                          {selectedModule === module.id && !module.hasSubmenu && (
                            <span className="text-blue-500 text-sm font-bold">✓</span>
                          )}
                          {module.hasSubmenu && (
                            <Icon 
                              icon={expandedModules.includes(module.id) ? "solar:alt-arrow-up-line-duotone" : "solar:alt-arrow-down-line-duotone"}
                              className="w-4 h-4 text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </div>
                      </div>
                    </Sidebar.Item>

                    {/* Submenu Items */}
                    {module.hasSubmenu && expandedModules.includes(module.id) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {module.submenu?.filter(subItem => hasAnyPermission([subItem.permission])).map((subItem) => (
                          <Sidebar.Item
                            key={subItem.id}
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                              e.preventDefault();
                              setSelectedModule(subItem.id);
                              onClose?.();
                            }}
                            className={`transition-all cursor-pointer text-sm ${
                              selectedModule === subItem.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-1">
                                <div className="font-medium text-gray-800 dark:text-gray-200">{subItem.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{subItem.description}</div>
                              </div>
                              {selectedModule === subItem.id && (
                                <span className="text-blue-500 text-sm font-bold">✓</span>
                              )}
                            </div>
                          </Sidebar.Item>
                        ))}
                      </div>
                    )}
                  </div>
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

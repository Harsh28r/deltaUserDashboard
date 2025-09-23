"use client";

import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import { Icon } from "@iconify/react";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import SimpleBar from "simplebar-react";
import SideProfile from "@/app/(DashboardLayout)/layout/vertical/sidebar/SideProfile/SideProfile";

import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { useModuleSelection } from "@/app/context/ModuleContext";

const ModuleSidebar = () => {
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
          permission: 'lead-source:read',
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
      permission: 'channel-partner:read',
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

  // Map module IDs to their routes
  const getModuleRoute = (moduleId: string): string => {
    const routes: { [key: string]: string } = {
      'leads': '/apps/leads',
      'channel-partners': '/apps/channel-partners',
      'notifications': '/apps/notifications',
      'usermanagement': '/apps/user-management',
    };
    return routes[moduleId] || '#';
  };

  // Map submenu IDs to their routes
  const getSubmenuRoute = (submenuId: string): string => {
    const routes: { [key: string]: string } = {
      'leads-main': '/apps/leads',
      'leadsource': '/apps/lead-sources',
      'leadsstatus': '/apps/lead-statuses',
    };
    return routes[submenuId] || '#';
  };

  // Enhanced permission checking using actual API permissions
  const hasModulePermission = (permission: string) => {
    // Check specific permission
    if (hasAnyPermission([permission])) {
      return true;
    }
    
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
    <div className="hidden lg:block">
      <Sidebar
        className="sidebar-wrapper fixed left-0 top-0 z-40 h-screen w-80 bg-white dark:bg-darkgray border-r border-gray-200 dark:border-gray-700"
        aria-label="Module-based sidebar"
        collapseBehavior="hide"
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <div className="mb-6 flex items-center gap-2 px-2">
              <Logo />
            </div>
            
            <SimpleBar className="h-[calc(100vh-120px)] overflow-y-auto">
              <Sidebar.Items>
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
                    <div key={module.id} className="mb-2">
                      {/* Main Module Item */}
                      <Sidebar.Item
                        href={module.hasSubmenu ? "#" : getModuleRoute(module.id)}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          if (module.hasSubmenu) {
                            toggleExpanded(module.id);
                          } else {
                            setSelectedModule(module.id);
                            // Navigate to the module page
                            window.location.href = getModuleRoute(module.id);
                          }
                        }}
                        className={`transition-all cursor-pointer ${
                          selectedModule === module.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="flex items-center gap-3 flex-1">
                            <Icon 
                              icon={module.icon || "solar:folder-line-duotone"} 
                              className={module.color || "text-gray-600"} 
                              height={20} 
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">{module.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{module.description}</div>
                            </div>
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
                          {module.submenu?.filter(subItem => hasModulePermission(subItem.permission)).map((subItem) => (
                            <Sidebar.Item
                              key={subItem.id}
                              href={getSubmenuRoute(subItem.id)}
                              onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                setSelectedModule(subItem.id);
                                // Navigate to the submenu page
                                window.location.href = getSubmenuRoute(subItem.id);
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
            </SimpleBar>
          </div>
          
          <div className="p-2">
            <SideProfile />
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

export default ModuleSidebar;

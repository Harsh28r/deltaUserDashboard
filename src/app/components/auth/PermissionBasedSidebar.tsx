"use client";

import React, { useContext, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import NavCollapse from "@/app/(DashboardLayout)/layout/vertical/sidebar/NavCollapse";
import SimpleBar from "simplebar-react";
import SideProfile from "@/app/(DashboardLayout)/layout/vertical/sidebar/SideProfile/SideProfile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { CustomizerContext } from "@/app/context/CustomizerContext";
import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { menuPermissions, roleBasedMenus } from "@/app/utils/permissions/menuPermissions";
import SidebarContent from "@/app/(DashboardLayout)/layout/vertical/sidebar/Sidebaritems";
import { MenuItem } from "@/app/(DashboardLayout)/layout/vertical/sidebar/Sidebaritems";

const PermissionBasedSidebar = () => {
  const { selectedIconId, setSelectedIconId } = useContext(CustomizerContext) || {};
  const { user } = useAuth();
  const { hasAnyPermission } = usePermissions();

  const filterMenuByPermissions = (menuItems: MenuItem[]): MenuItem[] => {
    if (!user) return [];

    const userRole = user.role.toLowerCase();
    const allowedMenus = roleBasedMenus[userRole] || [];

    return menuItems
      .map(menuItem => {
        // Skip if menuItem is invalid
        if (!menuItem || !menuItem.name) {
          return null;
        }

        const menuKey = menuItem.name.toLowerCase().replace(/\s+/g, '-');
        const isAllowedForRole = allowedMenus.some(allowed => 
          menuKey.includes(allowed) || allowed.includes(menuKey)
        );

        if (!isAllowedForRole) {
          return null;
        }

        if (menuItem.children) {
          const filteredChildren = menuItem.children.filter(child => {
            // Skip if child is invalid
            if (!child || !child.name) {
              return false;
            }
            
            const childKey = child.name.toLowerCase().replace(/\s+/g, '-');
            const childPermissions = menuPermissions[childKey] || [];
            
            if (childPermissions.length === 0) return true;
            
            return hasAnyPermission(childPermissions);
          });

          return {
            ...menuItem,
            children: filteredChildren
          };
        }

        if (menuItem.items) {
          const filteredItems = menuItem.items.map(item => {
            if (item.children) {
              const filteredChildren = item.children.filter(child => {
                // Skip if child is invalid
                if (!child || !child.name) {
                  return false;
                }
                
                const childKey = child.name.toLowerCase().replace(/\s+/g, '-');
                const childPermissions = menuPermissions[childKey] || [];
                
                if (childPermissions.length === 0) return true;
                
                return hasAnyPermission(childPermissions);
              });

              return {
                ...item,
                children: filteredChildren
              };
            }
            return item;
          }).filter(item => {
            if (item.children && item.children.length === 0) {
              return false;
            }
            return true;
          });

          return {
            ...menuItem,
            items: filteredItems
          };
        }

        return menuItem;
      })
      .filter((menuItem): menuItem is MenuItem => {
        if (!menuItem) return false;
        if (menuItem.children && menuItem.children.length === 0) {
          return false;
        }
        if (menuItem.items && menuItem.items.length === 0) {
          return false;
        }
        return true;
      });
  };

  const filteredSidebarContent = filterMenuByPermissions(SidebarContent);
  
  // If no menu items are available, show a basic dashboard menu
  if (filteredSidebarContent.length === 0) {
    return (
      <Sidebar
        className="sidebar-wrapper"
        aria-label="Sidebar with multi-level dropdown example"
      >
        <div className="flex h-full flex-col justify-between py-2">
          <div>
            <div className="mb-6 flex items-center gap-2 px-2">
              <Logo />
            </div>
            <SimpleBar className="h-[calc(100vh-300px)]">
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="/" as={Link}>
                    <span className="mr-3">📊</span>
                    Dashboard
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </SimpleBar>
          </div>
          <div className="p-2">
            <SideProfile />
          </div>
        </div>
      </Sidebar>
    );
  }
  
  const selectedContent = filteredSidebarContent.find(
    (data) => data.id === selectedIconId
  );

  const pathname = usePathname();

  function findActiveUrl(narray: any, targetUrl: any) {
    for (const item of narray) {
      if (item.items) {
        for (const section of item.items) {
          if (section.children) {
            for (const child of section.children) {
              if (child.url === targetUrl) {
                return child.id;
              }
            }
          }
        }
      }
    }
    return null;
  }

  const activeUrl = findActiveUrl(filteredSidebarContent, pathname);

  useEffect(() => {
    if (activeUrl) {
      setSelectedIconId(activeUrl);
    }
  }, [activeUrl, setSelectedIconId]);

  return (
    <Sidebar
      className="sidebar-wrapper"
      aria-label="Sidebar with multi-level dropdown example"
    >
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <div className="mb-6 flex items-center gap-2 px-2">
            <Logo />
          </div>
          <SimpleBar className="h-[calc(100vh-300px)]">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {filteredSidebarContent.map((item, index) => (
                  <NavCollapse
                    key={index}
                    item={item}
                  />
                ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </SimpleBar>
        </div>
        <div className="p-2">
          <SideProfile />
        </div>
      </div>
    </Sidebar>
  );
};

export default PermissionBasedSidebar;

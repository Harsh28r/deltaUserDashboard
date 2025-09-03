"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePermissions } from "@/app/context/PermissionContext";
import { menuPermissions, roleBasedMenus } from "@/app/utils/permissions/menuPermissions";
import SidebarContent from "@/app/(DashboardLayout)/layout/vertical/sidebar/Sidebaritems";
import { MenuItem } from "@/app/(DashboardLayout)/layout/vertical/sidebar/Sidebaritems";

const PermissionSidebar: React.FC = () => {
  const { user } = useAuth();
  const { hasAnyPermission } = usePermissions();

  const filterMenuByPermissions = (menuItems: MenuItem[]): MenuItem[] => {
    if (!user) return [];

    const userRole = user.role.toLowerCase();
    const allowedMenus = roleBasedMenus[userRole] || [];

    return menuItems
      .map(menuItem => {
        // Check if this menu item is allowed for the user's role
        const menuKey = menuItem.name?.toLowerCase().replace(/\s+/g, '-') || '';
        const isAllowedForRole = allowedMenus.some(allowed => 
          menuKey.includes(allowed) || allowed.includes(menuKey)
        );

        if (!isAllowedForRole) {
          return null;
        }

        // Filter children items
        if (menuItem.children) {
          const filteredChildren = menuItem.children.filter(child => {
            const childKey = child.name?.toLowerCase().replace(/\s+/g, '-') || '';
            const childPermissions = menuPermissions[childKey] || [];
            
            if (childPermissions.length === 0) return true; // No specific permissions required
            
            return hasAnyPermission(childPermissions);
          });

          return {
            ...menuItem,
            children: filteredChildren
          };
        }

        // Filter items array
        if (menuItem.items) {
          const filteredItems = menuItem.items.map(item => {
            if (item.children) {
              const filteredChildren = item.children.filter(child => {
                const childKey = child.name?.toLowerCase().replace(/\s+/g, '-') || '';
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
            // Remove items with no children after filtering
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
        // Remove menu items with no children/items after filtering
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

  return <>{filteredSidebarContent}</>;
};

export default PermissionSidebar;


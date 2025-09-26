"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface PermissionContextType {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  userPermissions: string[];
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const { userPermissions } = useAuth();

  const getAliasPermissions = (permission: string): string[] => {
    const aliases: string[] = [];
    // Basic singular/plural normalization
    if (permission.startsWith('lead:')) {
      aliases.push(permission.replace(/^lead:/, 'leads:'));
    }
    if (permission.startsWith('leads:')) {
      aliases.push(permission.replace(/^leads:/, 'lead:'));
    }
    // Special cases that don't map 1:1 by simple prefix
    if (permission === 'lead:update:status') {
      aliases.push('leads:status:update');
    }
    if (permission === 'leads:status:update') {
      aliases.push('lead:update:status');
    }
    if (permission === 'lead:read_all') {
      aliases.push('leads:read_all');
    }
    if (permission === 'leads:read_all') {
      aliases.push('lead:read_all');
    }
    // Map legacy bulk permissions to singular bulk variants
    if (permission === 'leads:bulk') {
      aliases.push('lead:bulk-create', 'lead:bulk-update', 'lead:bulk-delete');
    }
    return aliases;
  };

  const hasPermission = (permission: string): boolean => {
    if (userPermissions.includes(permission)) return true;
    const aliases = getAliasPermissions(permission);
    return aliases.some(p => userPermissions.includes(p));
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const value: PermissionContextType = {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

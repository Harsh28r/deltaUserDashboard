import { useAuth } from '@/app/context/AuthContext';

export const useLeadPermissions = () => {
  const { userPermissions, user } = useAuth();
  
  // Check if user is super admin
  const isSuperAdmin = user?.role === 'superadmin' || user?.email === 'superadmin@deltayards.com';
  
  // If super admin, grant all permissions
  if (isSuperAdmin) {
    return {
      canCreateLeads: true,
      canReadLeads: true,
      canUpdateLeads: true,
      canDeleteLeads: true,
      canUpdateLeadStatus: true,
      isLoading: false
    };
  }
  
  // Check individual permissions
  const canCreateLeads = userPermissions?.includes('lead:create')
    || userPermissions?.includes('leads:create')
    || false;
  const canReadLeads = userPermissions?.includes('lead:read')
    || userPermissions?.includes('lead:read_all')
    || userPermissions?.includes('leads:read')
    || userPermissions?.includes('leads:read_all')
    || false;
  const canUpdateLeads = userPermissions?.includes('lead:update')
    || userPermissions?.includes('lead:bulk-update')
    || userPermissions?.includes('leads:update')
    || false;
  const canDeleteLeads = userPermissions?.includes('lead:delete')
    || userPermissions?.includes('lead:bulk-delete')
    || userPermissions?.includes('leads:delete')
    || false;
  const canUpdateLeadStatus = userPermissions?.includes('lead:update:status')
    || userPermissions?.includes('leads:status:update')
    || false;
  return {
    canCreateLeads,
    canReadLeads,
    canUpdateLeads,
    canDeleteLeads,
    canUpdateLeadStatus,
    isLoading: false
  };
};

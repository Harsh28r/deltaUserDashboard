// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  ADMIN_LOGIN: `${API_BASE_URL}/api/superadmin/admin-login`,
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  
  // Roles
  ROLES: `${API_BASE_URL}/api/superadmin/roles`,
  ROLE_BY_ID: (id: string) => `${API_BASE_URL}/api/superadmin/roles/${id}`,
  
  // Users
  USERS: `${API_BASE_URL}/api/projects`, // Temporary: will extract users from projects
  USERS_BY_ROLE: (roleName: string) => `${API_BASE_URL}/api/projects`, // Temporary: will filter by role
  CREATE_USER: `${API_BASE_URL}/api/superadmin/create-user`,
  CREATE_USER_WITH_PROJECTS: `${API_BASE_URL}/api/superadmin/create-user-with-projects`,
  UPDATE_USER_PROJECTS: `${API_BASE_URL}/api/superadmin/update-user-projects`,
  USER_BY_ID: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}`,
  USER_HISTORY: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}/history`,
  UPDATE_USER: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}`,
  DELETE_USER: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}`,
  
  // Projects
  PROJECTS: `${API_BASE_URL}/api/projects`,
  ASSIGN_PROJECT_MEMBER: `${API_BASE_URL}/api/projects/members/add`,
  ASSIGN_ROLE: `${API_BASE_URL}/api/projects/members/assign-role`,
  BULK_ASSIGN_ROLE: `${API_BASE_URL}/api/projects/members/bulk-assign-role`,
  
  // Lead Management
  LEAD_SOURCES: `${API_BASE_URL}/api/lead-sources`,
  LEAD_SOURCE_BY_ID: (id: string) => `${API_BASE_URL}/api/lead-sources/${id}`,
  CREATE_LEAD_SOURCE: `${API_BASE_URL}/api/lead-sources`,
  UPDATE_LEAD_SOURCE: (id: string) => `${API_BASE_URL}/api/lead-sources/${id}`,
  DELETE_LEAD_SOURCE: (id: string) => `${API_BASE_URL}/api/lead-sources/${id}`,
  
  LEAD_STATUSES: `${API_BASE_URL}/api/lead-statuses`,
  LEAD_STATUS_BY_ID: (id: string) => `${API_BASE_URL}/api/lead-statuses/${id}`,
  CREATE_LEAD_STATUS: `${API_BASE_URL}/api/lead-statuses`,
  UPDATE_LEAD_STATUS: (id: string) => `${API_BASE_URL}/api/lead-statuses/${id}`,
  DELETE_LEAD_STATUS: (id: string) => `${API_BASE_URL}/api/lead-statuses/${id}`,
  
  // Leads
  LEADS: (projectId?: string) => projectId ? `${API_BASE_URL}/api/leads?projectId=${projectId}` : `${API_BASE_URL}/api/leads`,
  LEAD_BY_ID: (id: string) => `${API_BASE_URL}/api/leads/${id}`,
  CREATE_LEAD: (projectId: string) => `${API_BASE_URL}/api/leads`,
  UPDATE_LEAD: (id: string) => `${API_BASE_URL}/api/leads/${id}`,
  DELETE_LEAD: (id: string) => `${API_BASE_URL}/api/leads/${id}`,
  BULK_TRANSFER_LEADS: `${API_BASE_URL}/api/leads/bulk-transfer`,
  CP_SOURCING_UNIQUE_USERS: (projectId: string, channelPartnerId: string) => `${API_BASE_URL}/api/cp-sourcing/unique-users?projectId=${projectId}&channelPartnerId=${channelPartnerId}`,
  CP_SOURCING_UNIQUE_USERS_ALL: `${API_BASE_URL}/api/cp-sourcing-unique-users`,
  
  // Channel Partners
  CHANNEL_PARTNERS: `${API_BASE_URL}/api/channel-partner/`,
  CHANNEL_PARTNER_BY_ID: (id: string) => `${API_BASE_URL}/api/channel-partner/${id}`,
  CREATE_CHANNEL_PARTNER: `${API_BASE_URL}/api/channel-partner/`,
  UPDATE_CHANNEL_PARTNER: (id: string) => `${API_BASE_URL}/api/channel-partner/${id}`,
  DELETE_CHANNEL_PARTNER: (id: string) => `${API_BASE_URL}/api/channel-partner/${id}`,
  UPLOAD_CHANNEL_PARTNER_PHOTO: (id: string) => `${API_BASE_URL}/api/channel-partner/${id}/photo`,
  
  // CP Sourcing
  CP_SOURCING: `${API_BASE_URL}/api/cp-sourcing`,
  CP_SOURCING_BY_ID: (id: string) => `${API_BASE_URL}/api/cp-sourcing/${id}`,
  CREATE_CP_SOURCING: `${API_BASE_URL}/api/cp-sourcing`,
  UPDATE_CP_SOURCING: (id: string) => `${API_BASE_URL}/api/cp-sourcing/${id}`,
  DELETE_CP_SOURCING: (id: string) => `${API_BASE_URL}/api/cp-sourcing/${id}`,
  
  // Permissions
  ALL_USERS_PERMISSIONS: `${API_BASE_URL}/api/permissions/all-users`,
  USER_PERMISSIONS: (userId: string) => `${API_BASE_URL}/api/permissions/user/${userId}/permissions`,
  UPDATE_USER_PERMISSIONS: (userId: string) => `${API_BASE_URL}/api/permissions/user/${userId}/effective-permissions`,
  ROLE_PERMISSIONS: (roleId: string) => `${API_BASE_URL}/api/permissions/role/${roleId}/permissions`,
  UPDATE_ROLE_PERMISSIONS: (roleId: string) => `${API_BASE_URL}/api/permissions/role/${roleId}/permissions`,
};

// Utility function for creating refresh events
export const createRefreshEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('data-refresh'));
  }
};

export default API_ENDPOINTS;

// API Configuration
// export const API_BASE_URL = 'https://deltadb-o1lh.onrender.com'; // Temporarily hardcoded to bypass env var issues
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  ADMIN_LOGIN: `${API_BASE_URL}/api/superadmin/admin-login`,
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  
  // Roles
  ROLES: `${API_BASE_URL}/api/superadmin/roles`,
  ROLE_BY_ID: (id: string) => `${API_BASE_URL}/api/superadmin/roles/${id}`,
  
  // Users - TEMPORARY: Using projects endpoint until backend implements users API
  USERS: `${API_BASE_URL}/api/projects`, // Temporary: will extract users from projects
  USERS_BY_ROLE: (roleName: string) => `${API_BASE_URL}/api/projects`, // Temporary: will filter by role
  CREATE_USER: `${API_BASE_URL}/api/superadmin/create-user`,
  CREATE_USER_WITH_PROJECTS: `${API_BASE_URL}/api/superadmin/create-user-with-projects`,
  UPDATE_USER_PROJECTS: `${API_BASE_URL}/api/superadmin/update-user-projects`,
  USER_BY_ID: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}`,
  USER_HISTORY: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}/history`,
  UPDATE_USER: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}`,
  DELETE_USER: (id: string) => `${API_BASE_URL}/api/superadmin/users/${id}`,
  
  // TODO: Backend needs to implement these endpoints:
  // USERS: `${API_BASE_URL}/api/superadmin/users`,
  // USERS_BY_ROLE: (roleName: string) => `${API_BASE_URL}/api/superadmin/users/role/${roleName}`,
  
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
  CREATE_LEAD: (projectId: string) => `${API_BASE_URL}/api/leads?projectId=${projectId}`,
  UPDATE_LEAD: (id: string) => `${API_BASE_URL}/api/leads/${id}`,
  DELETE_LEAD: (id: string) => `${API_BASE_URL}/api/leads/${id}`,
  
  // Permissions
  ALL_USERS_PERMISSIONS: `${API_BASE_URL}/api/permissions/all-users`,
  USER_PERMISSIONS: (userId: string) => `${API_BASE_URL}/api/permissions/user/${userId}/permissions`,
  UPDATE_USER_PERMISSIONS: (userId: string) => `${API_BASE_URL}/api/permissions/user/${userId}/effective-permissions`,
  ROLE_PERMISSIONS: (roleId: string) => `${API_BASE_URL}/api/permissions/role/${roleId}/permissions`,
  UPDATE_ROLE_PERMISSIONS: (roleId: string) => `${API_BASE_URL}/api/permissions/role/${roleId}/permissions`,
};

// API Service Functions
export class ApiService {
  private static getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Lead Sources
  static async getLeadSources() {
    const response = await fetch(API_ENDPOINTS.LEAD_SOURCES, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async getLeadSourceById(id: string) {
    const response = await fetch(API_ENDPOINTS.LEAD_SOURCE_BY_ID(id), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async createLeadSource(data: any) {
    const response = await fetch(API_ENDPOINTS.CREATE_LEAD_SOURCE, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async updateLeadSource(id: string, data: any) {
    const response = await fetch(API_ENDPOINTS.UPDATE_LEAD_SOURCE(id), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async deleteLeadSource(id: string) {
    const response = await fetch(API_ENDPOINTS.DELETE_LEAD_SOURCE(id), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Lead Statuses
  static async getLeadStatuses() {
    const response = await fetch(API_ENDPOINTS.LEAD_STATUSES, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async getLeadStatusById(id: string) {
    const response = await fetch(API_ENDPOINTS.LEAD_STATUS_BY_ID(id), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async createLeadStatus(data: any) {
    const response = await fetch(API_ENDPOINTS.CREATE_LEAD_STATUS, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async updateLeadStatus(id: string, data: any) {
    const response = await fetch(API_ENDPOINTS.UPDATE_LEAD_STATUS(id), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async deleteLeadStatus(id: string) {
    const response = await fetch(API_ENDPOINTS.DELETE_LEAD_STATUS(id), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Leads
  static async getLeads(projectId?: string) {
    const response = await fetch(API_ENDPOINTS.LEADS(projectId), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async getLeadById(id: string) {
    const response = await fetch(API_ENDPOINTS.LEAD_BY_ID(id), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  static async createLead(projectId: string, data: any) {
    const response = await fetch(API_ENDPOINTS.CREATE_LEAD(projectId), {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async updateLead(id: string, data: any) {
    const response = await fetch(API_ENDPOINTS.UPDATE_LEAD(id), {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async deleteLead(id: string) {
    const response = await fetch(API_ENDPOINTS.DELETE_LEAD(id), {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }
}

// Create a custom event system for refreshing sidebar data
export const createRefreshEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('refreshSidebar'));
  }
};

export const subscribeToRefresh = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('refreshSidebar', callback);
    return () => window.removeEventListener('refreshSidebar', callback);
  }
  return () => {};
};

export default API_ENDPOINTS;

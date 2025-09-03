// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/superadmin/login`,
  USER_PROFILE: `${API_BASE_URL}/api/user/profile`,
  
  // Projects
  PROJECTS: `${API_BASE_URL}/api/projects`,
  
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

export default API_ENDPOINTS;

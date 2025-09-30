import { ApiNotification, NotificationResponse } from "../../app/(DashboardLayout)/layout/vertical/header/Data";
import { API_BASE_URL } from "../../lib/config";

const API_BASE_URL_WITH_API = `${API_BASE_URL}/api`;

export class NotificationService {
  static async fetchNotifications(page: number = 1, limit: number = 20): Promise<NotificationResponse> {
    console.log('Fetching user-specific notifications...');
    
    const token = this.getAuthToken();
    
    if (!token) {
      console.error('No authentication token found! Please login first.');
      throw new Error('Authentication required. Please login to view notifications.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Get current user ID - this ensures we only get notifications for the logged-in user
    const userId = this.getCurrentUserId();
    const endpoint = `${API_BASE_URL_WITH_API}/notifications/${userId}?page=${page}&limit=${limit}`;
    
    console.log('Fetching user-specific notifications from:', endpoint);
    console.log('For user ID:', userId);
    console.log('Using token:', token.substring(0, 20) + '...');

    const response = await fetch(endpoint, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error('Error details:', errorText);
      
      if (response.status === 401) {
        console.error('Authentication failed. Token might be expired or invalid.');
        console.error('Current token:', token.substring(0, 20) + '...');
        
        // Try to clear invalid token
        this.clearInvalidToken();
        throw new Error('Authentication failed. Please login again.');
      }
      
      throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched user-specific notifications:', data);
    
    // Log notification count for current user
    if (data.notifications && Array.isArray(data.notifications)) {
      console.log(`Found ${data.notifications.length} notifications for user ${userId}`);
    }
    
    return data;
  }


  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      console.log('Attempting to mark notification as read:', notificationId);
      
      const token = this.getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('No authentication token found, trying without authorization header');
      }
      
      const userId = this.getCurrentUserId();
      const response = await fetch(`${API_BASE_URL_WITH_API}/notifications/${userId}/${notificationId}/read`, {
        method: 'PUT',
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`API Error marking notification as read: ${response.status} ${response.statusText}`);
        console.warn('Error details:', errorText);
        console.log('Continuing with local state update only');
        return; // Don't throw error, just log and continue
      }

      const result = await response.json();
      console.log('Successfully marked notification as read:', result);
    } catch (error) {
      console.warn('Error marking notification as read:', error);
      console.log('Continuing with local state update only');
      // Don't throw error, just log and continue with local state update
    }
  }

  // Method to get auth token from localStorage or session
  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try different token storage keys and locations
      const possibleKeys = [
        'token', 'authToken', 'accessToken', 'auth_token', 'access_token',
        'jwt', 'jwtToken', 'bearerToken', 'userToken', 'sessionToken'
      ];
      
      let token: string | null = null;
      
      // Check localStorage first
      for (const key of possibleKeys) {
        token = localStorage.getItem(key);
        if (token) {
          console.log(`Found token in localStorage with key: ${key}`);
          break;
        }
      }
      
      // Check sessionStorage if not found in localStorage
      if (!token) {
        for (const key of possibleKeys) {
          token = sessionStorage.getItem(key);
          if (token) {
            console.log(`Found token in sessionStorage with key: ${key}`);
            break;
          }
        }
      }
      
      // Check for nested objects in localStorage (common in some auth libraries)
      if (!token) {
        try {
          const authData = localStorage.getItem('auth');
          if (authData) {
            const parsed = JSON.parse(authData);
            token = parsed.token || parsed.accessToken || parsed.authToken;
            if (token) {
              console.log('Found token in auth object');
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
      
      if (token) {
        // Validate token format
        if (!this.isValidToken(token)) {
          console.error('Invalid token format found, clearing token');
          this.clearInvalidToken();
          return null;
        }
        
        console.log('Retrieved valid token:', `${token.substring(0, 20)}...`);
        return token;
      } else {
        console.log('No token found in any storage location');
        console.log('Available localStorage keys:', Object.keys(localStorage));
        console.log('Available sessionStorage keys:', Object.keys(sessionStorage));
        return null;
      }
    }
    return null;
  }

  // Method to get current user ID from token or storage
  private static getCurrentUserId(): string {
    if (typeof window !== 'undefined') {
      // First, try to get user ID from localStorage or sessionStorage
      const userId = localStorage.getItem('userId') || 
                    localStorage.getItem('user_id') || 
                    localStorage.getItem('currentUserId') ||
                    localStorage.getItem('user') || // Sometimes stored as user object
                    sessionStorage.getItem('userId') ||
                    sessionStorage.getItem('user_id') ||
                    sessionStorage.getItem('currentUserId') ||
                    sessionStorage.getItem('user');
      
      if (userId) {
        // If it's a JSON object, parse it
        try {
          const parsedUser = JSON.parse(userId);
          if (parsedUser._id || parsedUser.id) {
            console.log('Retrieved user ID from user object:', parsedUser._id || parsedUser.id);
            return parsedUser._id || parsedUser.id;
          }
        } catch (e) {
          // If not JSON, treat as direct user ID
          console.log('Retrieved user ID:', userId);
          return userId;
        }
      }
      
      // Try to extract user ID from JWT token
      const token = this.getAuthToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.userId || payload.user_id || payload.sub || payload.id) {
            const tokenUserId = payload.userId || payload.user_id || payload.sub || payload.id;
            console.log('Retrieved user ID from token:', tokenUserId);
            return tokenUserId;
          }
        } catch (e) {
          console.warn('Could not extract user ID from token');
        }
      }
    }
    
    // If no user ID found, throw an error instead of using fallback
    throw new Error('No user ID found. Please ensure you are logged in and user information is stored properly.');
  }

  // Method to clear invalid tokens
  private static clearInvalidToken(): void {
    if (typeof window !== 'undefined') {
      console.log('Clearing invalid tokens from storage...');
      
      // Clear all possible token storage locations
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('accessToken');
      
      console.log('Invalid tokens cleared. User needs to login again.');
    }
  }

  // Method to validate token format
  private static isValidToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }
    
    // Basic JWT token validation (has 3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Token does not appear to be a valid JWT format');
      return false;
    }
    
    return true;
  }

  // Method to handle API errors with better error messages
  private static handleApiError(error: any, operation: string): never {
    console.error(`Error during ${operation}:`, error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the server. Please check your internet connection.`);
    }
    
    if (error.response) {
      throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`);
    }
    
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }

  // Method to refresh notifications (useful for polling)
  static async refreshNotifications(): Promise<NotificationResponse> {
    return await this.fetchNotifications();
  }

  // Method to check authentication status
  static checkAuthStatus(): { isAuthenticated: boolean; hasToken: boolean; tokenValid: boolean; userId: string | null; error?: string } {
    try {
      const token = this.getAuthToken();
      const userId = this.getCurrentUserId();
      
      const status = {
        isAuthenticated: false,
        hasToken: !!token,
        tokenValid: false,
        userId: userId
      };
      
      if (token) {
        status.tokenValid = this.isValidToken(token);
        status.isAuthenticated = status.tokenValid;
      }
      
      console.log('Authentication status:', status);
      return status;
    } catch (error: any) {
      const errorStatus = {
        isAuthenticated: false,
        hasToken: false,
        tokenValid: false,
        userId: null,
        error: error.message
      };
      
      console.log('Authentication status (error):', errorStatus);
      return errorStatus;
    }
  }

  // Method to manually set a token (for testing or when login doesn't store it properly)
  static setAuthToken(token: string, storageKey: string = 'token'): void {
    if (typeof window !== 'undefined') {
      if (this.isValidToken(token)) {
        localStorage.setItem(storageKey, token);
        console.log(`Token set successfully in localStorage with key: ${storageKey}`);
      } else {
        console.error('Invalid token format provided');
      }
    }
  }

  // Method to get all available tokens from storage (for debugging)
  static getAllStoredTokens(): Record<string, string> {
    if (typeof window !== 'undefined') {
      const allTokens: Record<string, string> = {};
      
      // Check all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value && (value.includes('.') || key.toLowerCase().includes('token'))) {
            allTokens[`localStorage.${key}`] = value.substring(0, 20) + '...';
          }
        }
      }
      
      // Check all sessionStorage keys
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          const value = sessionStorage.getItem(key);
          if (value && (value.includes('.') || key.toLowerCase().includes('token'))) {
            allTokens[`sessionStorage.${key}`] = value.substring(0, 20) + '...';
          }
        }
      }
      
      console.log('All stored tokens:', allTokens);
      return allTokens;
    }
    return {};
  }

  // Method to mark all notifications as read
  static async markAllNotificationsAsRead(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL_WITH_API}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to mark all notifications as read: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Marked all notifications as read:', result);
    } catch (error) {
      this.handleApiError(error, 'mark all notifications as read');
    }
  }

  static getNotificationIcon(type: string, priority: string): { icon: string; bgcolor: string; color: string } {
    switch (type) {
      case 'lead_status_change':
        return {
          icon: 'solar:chart-line-duotone',
          bgcolor: 'bg-lightprimary dark:bg-lightprimary',
          color: 'text-primary'
        };
      case 'lead_transferred':
        return {
          icon: 'solar:user-plus-line-duotone',
          bgcolor: 'bg-lightsuccess dark:bg-lightsuccess',
          color: 'text-success'
        };
      case 'test':
        return {
          icon: 'solar:bell-bing-line-duotone',
          bgcolor: 'bg-lightwarning dark:bg-lightwarning',
          color: 'text-warning'
        };
      default:
        return {
          icon: 'solar:bell-bing-line-duotone',
          bgcolor: 'bg-lightsecondary dark:bg-lightsecondary',
          color: 'text-secondary'
        };
    }
  }

  static formatTimeAgo(dateString: string): string {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
}

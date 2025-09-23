"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../utils/api/endpoints';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  level: number;
  mobile?: string;
  companyName?: string;
  isActive: boolean;
  permissions?: {
    allowed: string[];
    denied: string[];
  };
  projectAccess?: {
    canAccessAll: boolean;
    allowedProjects: string[];
    deniedProjects: string[];
    maxProjects: number | null;
  };
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  fetchUserProfile: () => Promise<void>;
  userPermissions: string[];
  projectAccess: {
    canAccessAll: boolean;
    allowedProjects: string[];
    deniedProjects: string[];
    maxProjects: number | null;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [projectAccess, setProjectAccess] = useState<{
    canAccessAll: boolean;
    allowedProjects: string[];
    deniedProjects: string[];
    maxProjects: number | null;
  } | null>(null);

  // Check for existing auth data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');
      
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        // Fetch fresh user profile to ensure we have latest permissions
        await fetchUserProfile();
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (!storedToken) return;

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        console.log('Profile data received:', profileData);
        
        // Update user data
        setUser(profileData.user);
        localStorage.setItem('auth_user', JSON.stringify(profileData.user));
        
        // Update permissions
        if (profileData.permissions) {
          const permissions = profileData.permissions.allowed || [];
          setUserPermissions(permissions);
        }
        
        // Update project access
        if (profileData.projectAccess) {
          setProjectAccess(profileData.projectAccess);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store auth data
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      // Fetch complete user profile with permissions
      await fetchUserProfile();

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    fetchUserProfile,
    userPermissions,
    projectAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

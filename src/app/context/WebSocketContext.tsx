"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../utils/api/endpoints';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
  joinProject: (projectId: string) => void;
  leaveProject: (projectId: string) => void;
  subscribeToReminders: () => void;
  unsubscribeFromReminders: () => void;
  subscribeToLeads: (projectId?: string) => void;
  unsubscribeFromLeads: () => void;
  emitEvent: (event: string, data: any) => void;
  onEvent: (event: string, callback: (data: any) => void) => void;
  offEvent: (event: string, callback?: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      // Disconnect if no token or user
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const newSocket = io(API_BASE_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
      
      // Join user-specific room
      newSocket.emit('join-user-room', user.id);
      
      // Join project rooms if user has project access
      if (user.projectAccess?.allowedProjects) {
        user.projectAccess.allowedProjects.forEach(projectId => {
          newSocket.emit('join-project', projectId);
        });
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('⚠️ WebSocket disconnected:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setConnected(false);
    });

    // Authentication error handler
    newSocket.on('auth-error', (error) => {
      console.error('❌ WebSocket authentication error:', error);
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token, user]);

  // Utility functions
  const joinProject = (projectId: string) => {
    if (socket && connected) {
      socket.emit('join-project', projectId);
      console.log(`Joined project room: ${projectId}`);
    }
  };

  const leaveProject = (projectId: string) => {
    if (socket && connected) {
      socket.emit('leave-project', projectId);
      console.log(`Left project room: ${projectId}`);
    }
  };

  const subscribeToReminders = () => {
    if (socket && connected) {
      socket.emit('subscribe-reminders');
      console.log('Subscribed to reminders');
    }
  };

  const unsubscribeFromReminders = () => {
    if (socket && connected) {
      socket.emit('unsubscribe-reminders');
      console.log('Unsubscribed from reminders');
    }
  };

  const subscribeToLeads = (projectId?: string) => {
    if (socket && connected) {
      if (projectId) {
        socket.emit('subscribe-leads', projectId);
        console.log(`Subscribed to leads for project: ${projectId}`);
      } else {
        socket.emit('subscribe-leads');
        console.log('Subscribed to all leads');
      }
    }
  };

  const unsubscribeFromLeads = () => {
    if (socket && connected) {
      socket.emit('unsubscribe-leads');
      console.log('Unsubscribed from leads');
    }
  };

  const emitEvent = (event: string, data: any) => {
    if (socket && connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const offEvent = (event: string, callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  };

  const value: WebSocketContextType = {
    socket,
    connected,
    joinProject,
    leaveProject,
    subscribeToReminders,
    unsubscribeFromReminders,
    subscribeToLeads,
    unsubscribeFromLeads,
    emitEvent,
    onEvent,
    offEvent,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

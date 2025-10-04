"use client";

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '@/app/utils/api/endpoints';

interface UseSocketOptions {
  autoConnect?: boolean;
  transports?: string[];
  timeout?: number;
}

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

export const useSocket = (
  token: string | null,
  options: UseSocketOptions = {}
): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const {
    autoConnect = true,
    transports = ['websocket', 'polling'],
    timeout = 20000
  } = options;

  useEffect(() => {
    if (!token || !autoConnect) {
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
      transports,
      timeout,
      forceNew: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected (useSocket)');
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('⚠️ WebSocket disconnected (useSocket):', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error (useSocket):', error);
      setConnected(false);
    });

    // Authentication error handler
    newSocket.on('auth-error', (error) => {
      console.error('❌ WebSocket authentication error (useSocket):', error);
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup function
    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [token, autoConnect, transports, timeout]);

  const connect = () => {
    if (socket && !connected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket && connected) {
      socket.disconnect();
    }
  };

  const emit = (event: string, data?: any) => {
    if (socket && connected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  };

  const on = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  };

  return {
    socket,
    connected,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};

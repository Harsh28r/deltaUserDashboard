"use client";

import React from 'react';
import { useWebSocket } from '@/app/context/WebSocketContext';
import { cn } from '@/lib/utils';

interface WebSocketStatusProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function WebSocketStatus({ 
  className, 
  showText = true, 
  size = 'md' 
}: WebSocketStatusProps) {
  const { connected } = useWebSocket();

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Status Dot */}
      <div
        className={cn(
          'rounded-full transition-all duration-300',
          sizeClasses[size],
          connected
            ? 'bg-green-500 shadow-green-500/50 shadow-lg animate-pulse'
            : 'bg-red-500 shadow-red-500/50 shadow-lg'
        )}
        title={connected ? 'Connected' : 'Disconnected'}
      />

      {/* Status Text */}
      {showText && (
        <span
          className={cn(
            'font-medium transition-colors duration-300',
            textSizeClasses[size],
            connected
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          )}
        >
          {connected ? 'Live Updates' : 'Offline'}
        </span>
      )}

      {/* Connection Status Tooltip */}
      <div className="relative group">
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
          {connected 
            ? 'Real-time updates are active' 
            : 'Connection lost - updates may be delayed'
          }
        </div>
      </div>
    </div>
  );
}

// Alternative compact version for headers
export function WebSocketStatusCompact({ className }: { className?: string }) {
  return (
    <WebSocketStatus 
      className={className} 
      showText={false} 
      size="sm" 
    />
  );
}

// Version with additional connection info
export function WebSocketStatusDetailed({ className }: { className?: string }) {
  const { connected, socket } = useWebSocket();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <WebSocketStatus showText={false} size="sm" />
      
      <div className="flex flex-col">
        <span className={cn(
          'text-xs font-medium',
          connected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        )}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        {socket && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ID: {socket.id?.slice(0, 8)}...
          </span>
        )}
      </div>
    </div>
  );
}




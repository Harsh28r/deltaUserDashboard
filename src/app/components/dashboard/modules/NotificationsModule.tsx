"use client";

import React, { useState, useEffect } from "react";
import { Card, Button } from "flowbite-react";
import { Icon } from "@iconify/react";
import PermissionGate from "@/app/components/auth/PermissionGate";
import { useWebSocket } from "@/app/context/WebSocketContext";
import { NotificationService } from "@/app/services/notificationService";
import { ApiNotification } from "@/app/(DashboardLayout)/layout/vertical/header/Data";
import { toast } from "@/hooks/use-toast";
import WebSocketStatus from "@/app/components/WebSocketStatus";

const NotificationsModule = () => {
  const { socket, connected } = useWebSocket();
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // WebSocket event listeners for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: { notification: ApiNotification; createdBy: { _id: string; name: string } }) => {
      console.log('New notification received:', data);
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast({
        title: "New Notification",
        description: data.notification.message || "You have a new notification",
      });
    };

    const handleNotificationRead = (data: { notificationId: string; readBy: { _id: string; name: string } }) => {
      console.log('Notification marked as read:', data);
      setNotifications(prev => 
        prev.map(n => 
          n._id === data.notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Register event listeners
    socket.on('notification', handleNewNotification);
    socket.on('notification-read', handleNotificationRead);

    // Cleanup
    return () => {
      socket.off('notification', handleNewNotification);
      socket.off('notification-read', handleNotificationRead);
    };
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.fetchNotifications();
      
      if (response?.notifications) {
        setNotifications(response.notifications);
        const unread = response.notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lead': return 'solar:user-line-duotone';
      case 'system': return 'solar:settings-line-duotone';
      case 'reminder': return 'solar:clock-circle-line-duotone';
      default: return 'solar:bell-line-duotone';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'lead': return 'bg-red-500';
      case 'system': return 'bg-blue-500';
      case 'reminder': return 'bg-green-500';
      default: return 'bg-orange-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <PermissionGate permission="notifications:read">
      <Card className="h-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Stay updated</p>
          </div>
          <div className="flex items-center gap-2">
            <WebSocketStatus size="sm" showText={false} />
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon icon="solar:bell-line-duotone" className="text-orange-600 dark:text-orange-400" height={20} width={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2 sm:space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4">
                <Icon icon="solar:bell-off-line-duotone" className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 3).map((notification) => (
                <div 
                  key={notification._id}
                  className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-800' 
                      : 'bg-orange-50 dark:bg-orange-900/20 border-l-2 border-orange-500'
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className={`w-2 h-2 ${getNotificationColor(notification.type)} rounded-full mr-2 sm:mr-3 flex-shrink-0`}></div>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                      {notification.message || notification.title}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <div className="space-y-2">
            <PermissionGate permission="notifications:update">
              <Button color="primary" className="w-full text-xs sm:text-sm">
                <Icon icon="solar:bell-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
                <span className="hidden sm:inline">View All Notifications</span>
                <span className="sm:hidden">View All</span>
              </Button>
            </PermissionGate>
            
            <PermissionGate permission="notifications:bulk-update">
              <Button color="light" className="w-full text-xs sm:text-sm">
                <Icon icon="solar:check-read-line-duotone" className="mr-1 sm:mr-2" height={14} width={14} />
                <span className="hidden sm:inline">Mark All as Read</span>
                <span className="sm:hidden">Mark Read</span>
              </Button>
            </PermissionGate>
          </div>
        </div>
      </Card>
    </PermissionGate>
  );
};

export default NotificationsModule;

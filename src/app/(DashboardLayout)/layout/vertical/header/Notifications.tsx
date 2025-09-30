
import { Icon } from "@iconify/react";
import { Badge, Button, Dropdown } from "flowbite-react";
import React, { useState, useEffect } from "react";
import SimpleBar from "simplebar-react";
import Link from "next/link";
import { NotificationService } from "@/app/services/notificationService";
import { ApiNotification, NotificationResponse } from "./Data";
import "@/app/css/components/notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: NotificationResponse = await NotificationService.fetchNotifications();
      
      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      // Check if notifications array exists and is valid
      if (!response.notifications || !Array.isArray(response.notifications)) {
        console.warn('Notifications array is missing or invalid:', response);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      setNotifications(response.notifications);
      
      // Count unread notifications with proper error handling
      const unread = response.notifications.filter(n => n && typeof n === 'object' && !n.read).length;
      setUnreadCount(unread);
      
      console.log(`Loaded ${response.notifications.length} notifications, ${unread} unread`);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load notifications';
      setError(errorMessage);
      console.error('Error fetching notifications:', err);
      
      // Reset state on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: ApiNotification) => {
    if (!notification.read) {
      try {
        await NotificationService.markNotificationAsRead(notification._id);
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id ? { ...n, read: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }
  };

  const getNotificationIcon = (notification: ApiNotification) => {
    return NotificationService.getNotificationIcon(notification.type, notification.priority);
  };

  const formatTimeAgo = (dateString: string) => {
    return NotificationService.formatTimeAgo(dateString);
  };

  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-6 rounded-sm notification-dropdown"
        dismissOnClick={false}
        renderTrigger={() => (
          <div className="relative">
            <span className="h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary notification-icon">
              <Icon icon="solar:bell-bing-line-duotone" height={20} />
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full absolute end-1 top-1 bg-error text-[10px] h-4 w-4 flex justify-center items-center text-white notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        )}
      >
        <div className="flex items-center px-6 justify-between">
          <h3 className="mb-0 text-lg font-semibold text-ld">Notifications</h3>
          {unreadCount > 0 && (
            <Badge color={"primary"}>{unreadCount} new</Badge>
          )}
        </div>

        <SimpleBar className="max-h-80 mt-3">
          {loading ? (
            <div className="px-6 py-4 text-center">
              <div className="flex items-center justify-center">
                <Icon icon="solar:loading-line-duotone" className="notification-loading text-primary" height={20} />
                <span className="ml-2 text-sm text-darklink">Loading notifications...</span>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-4 text-center">
              <div className="text-sm text-error">{error}</div>
              <Button 
                size="sm" 
                color="primary" 
                onClick={fetchNotifications}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty-state">
              <Icon icon="solar:bell-off-line-duotone" className="mx-auto text-gray-400" height={40} />
              <p className="text-sm text-gray-500 mt-2">No notifications yet</p>
            </div>
          ) : (
            notifications
              .filter(notification => notification && typeof notification === 'object' && notification._id)
              .map((notification) => {
                const iconData = getNotificationIcon(notification);
                return (
                  <Dropdown.Item
                    key={notification._id}
                    className={`px-6 py-3 flex justify-between items-center bg-hover group/link w-full border-l-4 notification-item notification-read-transition ${
                      !notification.read ? 'unread notification-priority-normal border-l-primary bg-blue-50 dark:bg-blue-900/20' : 'read border-l-transparent'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`h-11 w-11 flex-shrink-0 rounded-full flex justify-center items-center ${iconData.bgcolor}`}
                      >
                        <Icon icon={iconData.icon} height={20} className={iconData.color} />
                      </div>
                      <div className="ps-4 flex justify-between w-full">
                        <div className="w-3/4 text-start">
                          <h5 className={`mb-1 text-sm group-hover/link:text-primary ${
                            !notification.read ? 'font-semibold' : 'font-normal'
                          }`}>
                            {notification.title || 'No title'}
                          </h5>
                          <div className="text-xs text-darklink line-clamp-2">
                            {notification.message || 'No message'}
                          </div>
                          {notification.type === 'lead_status_change' && notification.data?.leadId && (
                            <div className="text-xs text-gray-500 mt-1">
                              Lead ID: {notification.data.leadId.slice(-8)}
                            </div>
                          )}
                        </div>
                        <div className="text-xs block self-start pt-1.5 text-gray-500">
                          {notification.createdAt ? formatTimeAgo(notification.createdAt) : 'Unknown time'}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="ml-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </Dropdown.Item>
                );
              })
          )}
        </SimpleBar>
        
        {notifications.length > 0 && (
          <div className="pt-5 px-6">
            <Button
              color={"primary"}
              className="w-full border border-primary text-primary hover:bg-primary hover:text-white"
              pill
              outline
              onClick={fetchNotifications}
            >
              Refresh Notifications
            </Button>
          </div>
        )}
      </Dropdown>
    </div>
  );
};

export default Notifications;

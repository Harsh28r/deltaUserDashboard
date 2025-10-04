"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/shadcn-ui/Default-Ui/card';
import { Button } from '@/app/components/shadcn-ui/Default-Ui/button';
import { Badge } from '@/app/components/shadcn-ui/Default-Ui/badge';
import { Clock, Plus, Bell, Calendar } from 'lucide-react';
import WebSocketStatus from '@/app/components/WebSocketStatus';

const RemindersModule = () => {
  const router = useRouter();

  // Mock data for demonstration
  const mockReminders = [
    {
      id: '1',
      title: 'Follow up with client',
      description: 'Call John Doe about project proposal',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      type: 'lead'
    },
    {
      id: '2',
      title: 'Team meeting',
      description: 'Weekly team standup meeting',
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
      type: 'task'
    },
    {
      id: '3',
      title: 'Project deadline',
      description: 'Submit final project deliverables',
      dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      type: 'other'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lead': return 'solar:user-line-duotone';
      case 'task': return 'solar:checklist-minimalistic-line-duotone';
      default: return 'solar:clock-circle-line-duotone';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reminders</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your reminders and notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <WebSocketStatus size="sm" />
          <Button onClick={() => router.push('/apps/reminders')}>
            <Plus className="w-4 h-4 mr-2" />
            New Reminder
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reminders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockReminders.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockReminders.filter(r => {
                    const weekFromNow = new Date();
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return r.dateTime <= weekFromNow;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:clock-circle-line-duotone" className="text-indigo-600" height={20} />
            Recent Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReminders.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No reminders yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create your first reminder to get started
                </p>
                <Button onClick={() => router.push('/apps/reminders')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Reminder
                </Button>
              </div>
            ) : (
              mockReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      <Icon 
                        icon={getTypeIcon(reminder.type)} 
                        className="text-indigo-600 dark:text-indigo-400" 
                        height={16} 
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{reminder.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(reminder.dateTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(reminder.status)}>
                      {reminder.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/apps/reminders')}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start"
              onClick={() => router.push('/apps/reminders')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Create New Reminder</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Set up a new reminder</div>
                </div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto p-4 justify-start"
              onClick={() => router.push('/apps/reminders')}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium">View All Reminders</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Manage all your reminders</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RemindersModule;

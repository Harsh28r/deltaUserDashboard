"use client";

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/app/context/WebSocketContext';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/shadcn-ui/Default-Ui/card';
import { Button } from '@/app/components/shadcn-ui/Default-Ui/button';
import { Input } from '@/app/components/shadcn-ui/Default-Ui/input';
import { Textarea } from '@/app/components/shadcn-ui/Default-Ui/textarea';
import { Badge } from '@/app/components/shadcn-ui/Default-Ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/shadcn-ui/Default-Ui/select';
import { Calendar } from '@/app/components/shadcn-ui/Default-Ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/shadcn-ui/Default-Ui/popover';
import { CalendarIcon, Plus, Trash2, Edit, Bell, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import WebSocketStatus from '@/app/components/WebSocketStatus';

interface Reminder {
  _id: string;
  title: string;
  description: string;
  dateTime: string;
  relatedType: 'task' | 'lead' | 'other';
  relatedId?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'sent' | 'completed' | 'cancelled';
  createdAt: string;
}

const RemindersPage = () => {
  const { socket, connected, subscribeToReminders, unsubscribeFromReminders } = useWebSocket();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    relatedType: 'other' as 'task' | 'lead' | 'other',
    relatedId: ''
  });
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');

  // Subscribe to reminders on mount
  useEffect(() => {
    if (connected) {
      subscribeToReminders();
    }

    return () => {
      if (connected) {
        unsubscribeFromReminders();
      }
    };
  }, [connected, subscribeToReminders, unsubscribeFromReminders]);

  // Listen for WebSocket events
  useEffect(() => {
    if (!socket) return;

    const handleReminderCreated = (data: { reminder: Reminder; createdBy: { _id: string; name: string } }) => {
      console.log('Reminder created:', data);
      setReminders(prev => [data.reminder, ...prev]);
      toast({
        title: "New Reminder",
        description: `${data.createdBy.name} created a reminder: ${data.reminder.title}`,
      });
    };

    const handleReminderUpdated = (data: { reminder: Reminder; updatedBy: { _id: string; name: string } }) => {
      console.log('Reminder updated:', data);
      setReminders(prev => prev.map(r => r._id === data.reminder._id ? data.reminder : r));
      toast({
        title: "Reminder Updated",
        description: `${data.updatedBy.name} updated a reminder: ${data.reminder.title}`,
      });
    };

    const handleReminderDeleted = (data: { reminderId: string; deletedBy: { _id: string; name: string } }) => {
      console.log('Reminder deleted:', data);
      setReminders(prev => prev.filter(r => r._id !== data.reminderId));
      toast({
        title: "Reminder Deleted",
        description: `${data.deletedBy.name} deleted a reminder`,
      });
    };

    const handleReminderStatusChanged = (data: { reminder: Reminder; changedBy: { _id: string; name: string } }) => {
      console.log('Reminder status changed:', data);
      setReminders(prev => prev.map(r => r._id === data.reminder._id ? data.reminder : r));
      toast({
        title: "Reminder Status Changed",
        description: `${data.changedBy.name} changed status of: ${data.reminder.title}`,
      });
    };

    // Register event listeners
    socket.on('reminder-created', handleReminderCreated);
    socket.on('reminder-updated', handleReminderUpdated);
    socket.on('reminder-deleted', handleReminderDeleted);
    socket.on('reminder-status-changed', handleReminderStatusChanged);

    // Cleanup
    return () => {
      socket.off('reminder-created', handleReminderCreated);
      socket.off('reminder-updated', handleReminderUpdated);
      socket.off('reminder-deleted', handleReminderDeleted);
      socket.off('reminder-status-changed', handleReminderStatusChanged);
    };
  }, [socket]);

  // Load initial reminders (mock data for demo)
  useEffect(() => {
    // In a real app, you would fetch from your API
    const mockReminders: Reminder[] = [
      {
        _id: '1',
        title: 'Follow up with client',
        description: 'Call John Doe about project proposal',
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        relatedType: 'lead',
        relatedId: 'lead-123',
        userId: {
          _id: user?.id || '1',
          name: user?.name || 'Current User',
          email: user?.email || 'user@example.com'
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        title: 'Team meeting',
        description: 'Weekly team standup meeting',
        dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        relatedType: 'task',
        userId: {
          _id: user?.id || '1',
          name: user?.name || 'Current User',
          email: user?.email || 'user@example.com'
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
    setReminders(mockReminders);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      toast({
        title: "Error",
        description: "Please select both date and time",
        variant: "destructive"
      });
      return;
    }

    const dateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    const newReminder: Reminder = {
      _id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      dateTime: dateTime.toISOString(),
      relatedType: formData.relatedType,
      relatedId: formData.relatedId || undefined,
      userId: {
        _id: user?.id || '1',
        name: user?.name || 'Current User',
        email: user?.email || 'user@example.com'
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // In a real app, you would emit this to the backend
    if (socket && connected) {
      socket.emit('create-reminder', newReminder);
    }

    setReminders(prev => [newReminder, ...prev]);
    resetForm();
    setIsCreating(false);
    
    toast({
      title: "Reminder Created",
      description: "Your reminder has been created successfully",
    });
  };

  const handleDelete = (reminderId: string) => {
    if (socket && connected) {
      socket.emit('delete-reminder', { reminderId });
    }
    
    setReminders(prev => prev.filter(r => r._id !== reminderId));
    toast({
      title: "Reminder Deleted",
      description: "Reminder has been deleted successfully",
    });
  };

  const handleStatusChange = (reminderId: string, newStatus: Reminder['status']) => {
    if (socket && connected) {
      socket.emit('update-reminder-status', { reminderId, status: newStatus });
    }
    
    setReminders(prev => prev.map(r => 
      r._id === reminderId ? { ...r, status: newStatus } : r
    ));
    
    toast({
      title: "Status Updated",
      description: "Reminder status has been updated",
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dateTime: '',
      relatedType: 'other',
      relatedId: ''
    });
    setDate(undefined);
    setTime('');
    setEditingReminder(null);
  };

  const getStatusColor = (status: Reminder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">Manage your reminders and notifications</p>
        </div>
        <div className="flex items-center gap-4">
          <WebSocketStatus />
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Reminder
          </Button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingReminder) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReminder ? 'Edit Reminder' : 'Create New Reminder'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter reminder title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Related Type</label>
                  <Select
                    value={formData.relatedType}
                    onValueChange={(value: 'task' | 'lead' | 'other') => 
                      setFormData(prev => ({ ...prev, relatedType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter reminder description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingReminder ? 'Update' : 'Create'} Reminder
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reminders List */}
      <div className="grid gap-4">
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reminders yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first reminder to get started
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Reminder
              </Button>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{reminder.title}</h3>
                      <Badge className={getStatusColor(reminder.status)}>
                        {reminder.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{reminder.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(reminder.dateTime), 'PPP p')}
                      </div>
                      <div>
                        Type: {reminder.relatedType}
                      </div>
                      <div>
                        Created by: {reminder.userId.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={reminder.status}
                      onValueChange={(value: Reminder['status']) => 
                        handleStatusChange(reminder._id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingReminder(reminder);
                        setFormData({
                          title: reminder.title,
                          description: reminder.description,
                          dateTime: reminder.dateTime,
                          relatedType: reminder.relatedType,
                          relatedId: reminder.relatedId || ''
                        });
                        setDate(new Date(reminder.dateTime));
                        setTime(format(new Date(reminder.dateTime), 'HH:mm'));
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(reminder._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RemindersPage;

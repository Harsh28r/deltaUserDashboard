# WebSocket Integration Guide

## Overview
This frontend now supports real-time updates using WebSocket (Socket.IO) for instant notifications and data synchronization.

## What's Implemented

### 1. WebSocket Context (`src/app/context/WebSocketContext.tsx`)
- Global WebSocket connection management
- Authentication with JWT tokens
- Connection status tracking
- Utility functions for joining rooms and subscriptions

### 2. WebSocket Hook (`src/hooks/useSocket.ts`)
- Simple hook for WebSocket connection
- Connection status management
- Automatic reconnection handling

### 3. WebSocket Status Component (`src/app/components/WebSocketStatus.tsx`)
- Visual indicator for connection status
- Can be used in headers or anywhere in the app

### 4. Reminders Page Integration
- Real-time updates for reminder CRUD operations
- Live connection status indicator
- Automatic subscription to reminder events

## Available Events

### Reminder Events
- `reminder-created` - New reminder created
- `reminder-updated` - Reminder updated
- `reminder-deleted` - Reminder deleted
- `reminder-status-changed` - Reminder status changed

### Lead Events (from backend)
- `lead-created` - New lead created
- `lead-assigned` - Lead assigned to user
- `lead-updated` - Lead updated
- `lead-status-changed` - Lead status changed
- `lead-deleted` - Lead deleted

### Notification Events
- `notification` - General notifications
- `reminder` - Reminder-specific notifications

## Usage Examples

### 1. Using WebSocket Context
```tsx
import { useWebSocket } from '@/app/context/WebSocketContext';

function MyComponent() {
  const { socket, connected, joinProject, subscribeToReminders } = useWebSocket();

  useEffect(() => {
    if (socket) {
      // Listen for events
      socket.on('lead-created', (data) => {
        console.log('New lead:', data);
      });

      // Subscribe to reminders
      subscribeToReminders();

      // Join project room
      joinProject('project-id');
    }
  }, [socket, subscribeToReminders, joinProject]);

  return (
    <div>
      Status: {connected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

### 2. Using WebSocket Hook
```tsx
import { useSocket } from '@/hooks/useSocket';

function MyComponent() {
  const { token } = useAuth();
  const { socket, connected } = useSocket(token);

  useEffect(() => {
    if (socket) {
      socket.on('lead-updated', (data) => {
        // Handle lead update
      });
    }
  }, [socket]);

  return <div>Connected: {connected}</div>;
}
```

### 3. Adding WebSocket Status to Header
```tsx
import WebSocketStatus from '@/app/components/WebSocketStatus';

function Header() {
  return (
    <header>
      <WebSocketStatus className="ml-auto" />
    </header>
  );
}
```

## Setup Instructions

### 1. Add WebSocket Provider to Layout
```tsx
// In your main layout file
import { WebSocketProvider } from '@/app/context/WebSocketContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Event Data Structures

### Reminder Events
```typescript
// reminder-created
{
  reminder: {
    _id: string;
    title: string;
    description: string;
    dateTime: string;
    relatedType: "task" | "lead" | "other";
    relatedId: string;
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    status: "pending" | "sent" | "completed" | "cancelled";
    createdAt: string;
  };
  createdBy: {
    _id: string;
    name: string;
  };
}

// reminder-updated
{
  reminder: Reminder;
  updatedBy: {
    _id: string;
    name: string;
  };
}

// reminder-deleted
{
  reminderId: string;
  deletedBy: {
    _id: string;
    name: string;
  };
}
```

### Lead Events
```typescript
// lead-created
{
  lead: Lead;
  createdBy: {
    _id: string;
    name: string;
  };
}

// lead-assigned
{
  lead: Lead;
  assignedBy: {
    _id: string;
    name: string;
  };
}
```

## Testing WebSocket Connection

### 1. Check Browser Console
Look for these messages:
```
✅ WebSocket connected
⚠️ WebSocket disconnected
❌ WebSocket connection error
```

### 2. Test with Browser DevTools
```javascript
// In browser console
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => console.log('Connected!'));
socket.on('reminder-created', (data) => console.log('Reminder created:', data));
```

### 3. Visual Indicators
- Green dot: Connected
- Red dot: Disconnected
- "Live Updates" text when connected
- "Offline" text when disconnected

## Troubleshooting

### Connection Issues
1. Check if backend is running on port 5000
2. Verify JWT token is valid
3. Check browser console for errors
4. Ensure CORS is configured correctly

### Not Receiving Events
1. Verify event names match backend
2. Check if you're subscribed to the right rooms
3. Confirm backend is emitting events
4. Check network tab for WebSocket connection

### Performance Considerations
1. Clean up event listeners in useEffect cleanup
2. Use connection status to conditionally render components
3. Implement reconnection logic for production
4. Consider rate limiting for high-frequency events

## Production Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
```

### Security Considerations
1. Always use HTTPS in production
2. Validate JWT tokens on backend
3. Implement proper CORS policies
4. Use secure WebSocket connections (wss://)

## Benefits

### Before (Without WebSocket)
- ❌ Manual page refresh needed
- ❌ No real-time updates
- ❌ Miss important changes
- ❌ Poor user experience

### After (With WebSocket)
- ✅ Instant updates
- ✅ No manual refresh needed
- ✅ Real-time collaboration
- ✅ Better user experience
- ✅ Efficient resource usage

## Next Steps

1. Add WebSocket to other pages (leads, projects, etc.)
2. Implement toast notifications for events
3. Add sound notifications for important events
4. Create real-time collaboration features
5. Add presence indicators (who's online)
6. Implement real-time typing indicators

---

**WebSocket integration is now complete!** 🎉
Your app now supports real-time updates and provides a much better user experience.

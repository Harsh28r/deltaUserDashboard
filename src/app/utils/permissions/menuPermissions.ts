// Permission mapping for menu items
export const menuPermissions: Record<string, string[]> = {
  // Dashboard permissions
  "dashboard": [],
  
  // Notifications
  "notifications": ["notifications:read"],
  "notifications-create": ["notifications:create"],
  "notifications-update": ["notifications:update"],
  "notifications-delete": ["notifications:delete"],
  "notifications-bulk": ["notifications:bulk-update", "notifications:bulk-delete"],
  
  // Leads Source
  "leads-source": ["leadssource:read"],
  "leads-source-create": ["leadssource:create"],
  "leads-source-read-all": ["leadssource:read_all"],
  "leads-source-update": ["leadssource:update"],
  "leads-source-delete": ["leadssource:delete"],
  
  // Leads
  "leads": ["leads:read"],
  "leads-create": ["leads:create"],
  "leads-update": ["leads:update"],
  "leads-bulk": ["leads:bulk"],
  "leads-transfer": ["leads:transfer"],
  
  // Leads Status
  "leads-status": ["leadsstatus:read"],
  "leads-status-create": ["leadsstatus:create"],
  "leads-status-read-all": ["leadsstatus:read_all"],
  "leads-status-update": ["leadsstatus:update"],
  "leads-status-delete": ["leadsstatus:delete"],
  
  // User Management (super admin only)
  "user-management": ["user:read_all"],
  "user-create": ["user:create"],
  "user-update": ["user:update"],
  "user-delete": ["user:delete"],
  
  // Settings (admin only)
  "settings": ["settings:read"],
  "settings-update": ["settings:update"],
};

// Role-based menu visibility
export const roleBasedMenus: Record<string, string[]> = {
  "superadmin": [
    "dashboard", "notifications", "leads-source", "leads", "leads-status", 
    "user-management", "settings"
  ],
  "admin": [
    "dashboard", "notifications", "leads-source", "leads", "leads-status", "settings"
  ],
  "devops": [
    "dashboard", "notifications", "leads-source", "leads", "leads-status"
  ],
  "user": [
    "dashboard", "leads"
  ]
};






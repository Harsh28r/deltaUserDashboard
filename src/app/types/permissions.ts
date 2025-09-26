// Permission constants
export const PERMISSIONS = {
  // Lead permissions
  LEAD_CREATE: 'lead:create',
  LEAD_READ: 'lead:read',
  LEAD_READ_ALL: 'lead:read_all',
  LEAD_UPDATE: 'lead:update',
  LEAD_UPDATE_STATUS: 'lead:update:status',
  LEADS_STATUS_UPDATE: 'leads:status:update',
  LEAD_DELETE: 'lead:delete',
  LEAD_BULK_CREATE: 'lead:bulk-create',
  LEAD_BULK_UPDATE: 'lead:bulk-update',
  LEAD_BULK_DELETE: 'lead:bulk-delete',
  
  // Channel Partner permissions
  CHANNEL_PARTNER_CREATE: 'channel-partner:create',
  CHANNEL_PARTNER_READ: 'channel-partner:read',
  CHANNEL_PARTNER_READ_ALL: 'channel-partner:read_all',
  CHANNEL_PARTNER_UPDATE: 'channel-partner:update',
  CHANNEL_PARTNER_DELETE: 'channel-partner:delete',
  CHANNEL_PARTNER_BULK_CREATE: 'channel-partner:bulk-create',
  CHANNEL_PARTNER_BULK_UPDATE: 'channel-partner:bulk-update',
  CHANNEL_PARTNER_BULK_DELETE: 'channel-partner:bulk-delete',
  
  // Lead Source permissions
  LEAD_SOURCE_CREATE: 'lead-source:create',
  LEAD_SOURCE_READ: 'lead-source:read',
  LEAD_SOURCE_UPDATE: 'lead-source:update',
  LEAD_SOURCE_DELETE: 'lead-source:delete',
  
  // Lead Status permissions
  LEAD_STATUS_CREATE: 'lead-status:create',
  LEAD_STATUS_READ: 'lead-status:read',
  LEAD_STATUS_UPDATE: 'lead-status:update',
  LEAD_STATUS_DELETE: 'lead-status:delete',
  
  // Lead Activities permissions
  LEAD_ACTIVITIES_READ: 'lead-activities:read',
  LEAD_ACTIVITIES_BULK_UPDATE: 'lead-activities:bulk-update',
  LEAD_ACTIVITIES_BULK_DELETE: 'lead-activities:bulk-delete',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

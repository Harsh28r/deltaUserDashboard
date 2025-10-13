export interface Location {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
  accuracy?: number;
}

export interface CheckInOut {
  time: string;
  location: Location;
  selfie?: string;
  platform?: string;
  notes?: string;
}

export interface Break {
  startTime: string;
  endTime?: string;
  reason: string;
  duration?: number; // in minutes
}

export interface WorkLocation {
  time: string;
  location: Location;
  activity: string;
  notes?: string;
}

export interface Attendance {
  _id: string;
  userId: string;
  date: string;
  checkIn?: CheckInOut;
  checkOut?: CheckInOut;
  checkInTime?: string; // For backward compatibility
  checkOutTime?: string; // For backward compatibility
  checkInLocation?: Location; // For backward compatibility
  checkOutLocation?: Location; // For backward compatibility
  status: 'present' | 'absent' | 'on-break' | 'checked-out';
  totalHours: number;
  totalBreakTime: number;
  breaks: Break[];
  workLocations: WorkLocation[];
  isOnBreak: boolean;
  isManualEntry?: boolean;
  manualEntryBy?: string | { name: string; _id: string };
  manualEntryReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStatus {
  status: 'checked-in' | 'checked-out' | 'on-break' | 'not-checked-in' | 'absent';
  attendance: Attendance | null;
  canCheckIn: boolean;
  canCheckOut: boolean;
  message?: string;
}

export interface CheckInPayload {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  selfie?: string;
  platform?: string;
  notes?: string;
}

export interface CheckOutPayload {
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  selfie?: string;
  notes?: string;
}

export interface BreakPayload {
  reason: string;
}

export interface WorkLocationPayload {
  latitude: number;
  longitude: number;
  address: string;
  activity: string;
  notes?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AttendanceHistoryParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AttendanceHistoryResponse {
  attendance: Attendance[];
  pagination: Pagination;
}


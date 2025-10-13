import type {
  AttendanceStatus,
  CheckInPayload,
  CheckOutPayload,
  BreakPayload,
  WorkLocationPayload,
  Attendance,
  AttendanceHistoryParams,
  AttendanceHistoryResponse,
} from '@/app/(DashboardLayout)/types/attendance';
import { API_ENDPOINTS } from '@/lib/config';

// Custom fetcher for attendance API
const attendanceFetcher = async (url: string, options?: RequestInit) => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export const getAttendanceStatus = async (): Promise<AttendanceStatus> => {
  return attendanceFetcher(API_ENDPOINTS.ATTENDANCE_STATUS);
};

export const checkIn = async (payload: CheckInPayload): Promise<Attendance> => {
  return attendanceFetcher(API_ENDPOINTS.ATTENDANCE_CHECK_IN, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const checkOut = async (payload: CheckOutPayload): Promise<Attendance> => {
  return attendanceFetcher(API_ENDPOINTS.ATTENDANCE_CHECK_OUT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const startBreak = async (payload: BreakPayload): Promise<Attendance> => {
  return attendanceFetcher(API_ENDPOINTS.ATTENDANCE_START_BREAK, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const endBreak = async (): Promise<Attendance> => {
  return attendanceFetcher(API_ENDPOINTS.ATTENDANCE_END_BREAK, {
    method: 'POST',
  });
};

export const addWorkLocation = async (payload: WorkLocationPayload): Promise<Attendance> => {
  return attendanceFetcher(API_ENDPOINTS.ATTENDANCE_WORK_LOCATION, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getAttendanceHistory = async (
  startDate?: string,
  endDate?: string
): Promise<Attendance[]> => {
  let url = API_ENDPOINTS.ATTENDANCE_HISTORY;
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (params.toString()) url += `?${params.toString()}`;
  
  return attendanceFetcher(url);
};

export const getTodayAttendance = async (): Promise<Attendance | null> => {
  return attendanceFetcher(API_ENDPOINTS.ATTENDANCE_TODAY);
};

export const getMyAttendanceHistory = async (
  params: AttendanceHistoryParams
): Promise<AttendanceHistoryResponse> => {
  let url = API_ENDPOINTS.ATTENDANCE_HISTORY;
  const searchParams = new URLSearchParams();
  
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  
  if (searchParams.toString()) url += `?${searchParams.toString()}`;
  
  return attendanceFetcher(url);
};


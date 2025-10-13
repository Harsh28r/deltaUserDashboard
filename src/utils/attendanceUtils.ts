export const getCurrentLocation = (): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AttendanceApp/1.0',
        },
      }
    );
    const data = await response.json();
    return data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  } catch (error) {
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};

export const getPlatformInfo = (): string => {
  const userAgent = navigator.userAgent;
  if (/android/i.test(userAgent)) return 'Android';
  if (/iPad|iPhone|iPod/.test(userAgent)) return 'iOS';
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Mac/.test(userAgent)) return 'macOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  return 'Unknown';
};

export const getStatusColor = (
  status: string
): 'success' | 'failure' | 'warning' | 'info' | 'gray' => {
  switch (status) {
    case 'checked-in':
    case 'present':
      return 'success';
    case 'checked-out':
      return 'info';
    case 'on-break':
      return 'warning';
    case 'absent':
    case 'not-checked-in':
      return 'gray';
    default:
      return 'gray';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'checked-in':
      return 'Checked In';
    case 'checked-out':
      return 'Checked Out';
    case 'on-break':
      return 'On Break';
    case 'present':
      return 'Present';
    case 'absent':
      return 'Absent';
    case 'not-checked-in':
      return 'Not Checked In';
    default:
      return status;
  }
};

export const formatHours = (hours: number): string => {
  if (hours < 0) return '0h 0m';
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h}h ${m}m`;
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
};

export const canTakeBreak = (
  status: string,
  isOnBreak: boolean
): { canStart: boolean; canEnd: boolean } => {
  return {
    canStart: status === 'present' && !isOnBreak,
    canEnd: isOnBreak,
  };
};

export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const isWithinWorkHours = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 22; // 6 AM to 10 PM
};

export const getWorkingHoursProgress = (hoursWorked: number, targetHours: number = 8): number => {
  return Math.min((hoursWorked / targetHours) * 100, 100);
};

export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


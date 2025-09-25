export interface LocationData {
  lat: number;
  lng: number;
  address?: string;
  placeName?: string;
  accuracy?: number;
  timestamp?: number;
}

export interface GeocodeResult {
  address: string;
  placeName: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

/**
 * Get current location using browser's geolocation API
 */
export const getCurrentLocation = (options: LocationOptions = {}): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        resolve(locationData);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      defaultOptions
    );
  });
};

/**
 * Reverse geocode coordinates to get address information
 * Using a free geocoding service (you can replace with your preferred service)
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult> => {
  try {
    // Using OpenStreetMap Nominatim (free service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CP-Sourcing-App/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding failed');
    }

    const data = await response.json();
    
    // Extract address components
    const address = data.display_name || '';
    const placeName = data.name || data.display_name?.split(',')[0] || '';
    
    return {
      address,
      placeName,
      city: data.address?.city || data.address?.town || data.address?.village,
      state: data.address?.state,
      country: data.address?.country,
      postalCode: data.address?.postcode
    };
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    
    // Return fallback data
    return {
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      placeName: 'Unknown Location'
    };
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (lat: number, lng: number, precision: number = 4): string => {
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

/**
 * Validate if coordinates are within reasonable bounds
 */
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Get location permission status
 */
export const getLocationPermission = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  if (!navigator.permissions) {
    return 'prompt';
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return permission.state as 'granted' | 'denied' | 'prompt';
  } catch (error) {
    return 'prompt';
  }
};

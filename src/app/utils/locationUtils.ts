// Location utilities for capturing coordinates and reverse geocoding

export interface LocationData {
    lat: number;
    lng: number;
    placeName?: string;
    area?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    fullAddress?: string;
    // Enhanced detailed fields
    building?: string;
    landmark?: string;
    locality?: string;
    sublocality?: string;
    postalCode?: string;
    houseNumber?: string;
    roadType?: string;
    formattedAddress?: string;
    detailedAddress?: string;
  }
  
  export interface GeolocationError {
    code: number;
    message: string;
  }
  
  // Get current location using browser geolocation API
  export const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject({
          code: 0,
          message: 'Geolocation is not supported by this browser.'
        });
        return;
      }
  
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Get detailed location information through reverse geocoding
            const locationData = await reverseGeocode(latitude, longitude);
            resolve(locationData);
          } catch (error) {
            // If reverse geocoding fails, return basic coordinates
            resolve({
              lat: latitude,
              lng: longitude,
              placeName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            });
          }
        },
        (error) => {
          let errorMessage = 'Unknown error occurred';
          
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
          
          reject({
            code: error.code,
            message: errorMessage
          });
        },
        options
      );
    });
  };
  
  // Reverse geocoding using OpenStreetMap Nominatim API
  export const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'DeltaFrontend/1.0'
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }
  
      const data = await response.json();
      
      if (!data || data.error) {
        throw new Error('No location data found');
      }
  
      const address = data.address || {};
      
      // Extract detailed location information
      const locationData: LocationData = {
        lat,
        lng,
        placeName: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        area: address.suburb || address.neighbourhood || address.village || '',
        street: address.road || address.pedestrian || address.footway || '',
        city: address.city || address.town || address.municipality || '',
        state: address.state || address.province || '',
        country: address.country || '',
        fullAddress: data.display_name || '',
        // Enhanced detailed fields
        building: address.building || address.house_name || address.office || '',
        landmark: address.amenity || address.leisure || address.tourism || '',
        locality: address.locality || address.district || '',
        sublocality: address.sublocality || address.sublocality_level_1 || '',
        postalCode: address.postcode || '',
        houseNumber: address.house_number || '',
        roadType: address.road_type || '',
      };
  
      // Create detailed address components
      const addressParts = [];
      
      // Building/House number
      if (locationData.houseNumber) {
        addressParts.push(locationData.houseNumber);
      }
      if (locationData.building) {
        addressParts.push(locationData.building);
      }
      
      // Street with road type
      if (locationData.street) {
        const streetName = locationData.roadType ? 
          `${locationData.street} ${locationData.roadType}` : 
          locationData.street;
        addressParts.push(streetName);
      }
      
      // Landmark
      if (locationData.landmark) {
        addressParts.push(`Near ${locationData.landmark}`);
      }
      
      // Locality
      if (locationData.sublocality) {
        addressParts.push(locationData.sublocality);
      } else if (locationData.locality) {
        addressParts.push(locationData.locality);
      }
      
      // City
      if (locationData.city) {
        addressParts.push(locationData.city);
      }
      
      // State
      if (locationData.state) {
        addressParts.push(locationData.state);
      }
      
      // Postal code
      if (locationData.postalCode) {
        addressParts.push(locationData.postalCode);
      }
      
      // Create formatted addresses
      locationData.formattedAddress = addressParts.join(', ');
      locationData.detailedAddress = addressParts.join(', ');
      
      // Create a more readable place name with building details
      if (locationData.building && locationData.street) {
        locationData.placeName = `${locationData.building}, ${locationData.street}`;
      } else if (locationData.houseNumber && locationData.street) {
        locationData.placeName = `${locationData.houseNumber}, ${locationData.street}`;
      } else if (locationData.street) {
        locationData.placeName = locationData.street;
      } else if (locationData.city) {
        locationData.placeName = locationData.city;
      }
  
      return locationData;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Return basic coordinates if reverse geocoding fails
      return {
        lat,
        lng,
        placeName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      };
    }
  };
  
  // Format location data for display
  export const formatLocationForDisplay = (location: LocationData): string => {
    if (location.placeName && location.placeName !== `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`) {
      return location.placeName;
    }
    
    if (location.street) {
      return location.street;
    }
    
    if (location.city) {
      return location.city;
    }
    
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  };
  
  // Get location summary for form display
  export const getLocationSummary = (location: LocationData): string => {
    const parts = [];
    
    if (location.street) parts.push(location.street);
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    
    return parts.join(', ') || location.placeName || 'Location captured';
  };
  
  // Create a detailed location string like "Building 2, Goddev Mira Road, Mumbai"
  export const getDetailedLocationString = (location: LocationData): string => {
    const parts = [];
    
    // Building/House number first
    if (location.building) {
      parts.push(location.building);
    } else if (location.houseNumber) {
      parts.push(`Building ${location.houseNumber}`);
    }
    
    // Street with road type
    if (location.street) {
      const streetName = location.roadType ? 
        `${location.street} ${location.roadType}` : 
        location.street;
      parts.push(streetName);
    }
    
    // Landmark if available
    if (location.landmark) {
      parts.push(`Near ${location.landmark}`);
    }
    
    // Locality
    if (location.sublocality) {
      parts.push(location.sublocality);
    } else if (location.locality) {
      parts.push(location.locality);
    }
    
    // City
    if (location.city) {
      parts.push(location.city);
    }
    
    // State
    if (location.state) {
      parts.push(location.state);
    }
    
    return parts.join(', ') || location.placeName || 'Location captured';
  };
  
  // Create a short location string for display
  export const getShortLocationString = (location: LocationData): string => {
    const parts = [];
    
    // Building/House number
    if (location.building) {
      parts.push(location.building);
    } else if (location.houseNumber) {
      parts.push(`Building ${location.houseNumber}`);
    }
    
    // Street
    if (location.street) {
      parts.push(location.street);
    }
    
    return parts.join(', ') || location.placeName || 'Location captured';
  };
  
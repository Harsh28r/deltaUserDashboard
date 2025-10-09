/**
 * Utility functions for date and time formatting and validation
 */

type DateTimeType = 'date' | 'datetime' | 'time';

/**
 * Format a value for HTML input display
 */
export function formatForInput(value: string, type: DateTimeType): string {
  if (!value) return '';
  
  try {
    switch (type) {
      case 'date': {
        // Handle various date formats
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';
        
        // Return in YYYY-MM-DD format for date input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      case 'datetime': {
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';
        
        // Return in YYYY-MM-DDTHH:mm format for datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      
      case 'time': {
        // Handle time values (HH:mm or HH:mm:ss)
        if (value.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
          return value.substring(0, 5); // Return HH:mm
        }
        
        // Try parsing as full date/time
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      
      default:
        return value;
    }
  } catch (error) {
    console.error('Error formatting for input:', error);
    return '';
  }
}

/**
 * Format a value for storage (convert from HTML input format to ISO or appropriate format)
 */
export function formatForStorage(value: string, type: DateTimeType): string {
  if (!value) return '';
  
  try {
    switch (type) {
      case 'date': {
        // Input is YYYY-MM-DD, store as ISO date string
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      }
      
      case 'datetime': {
        // Input is YYYY-MM-DDTHH:mm, store as ISO string
        const date = new Date(value);
        if (isNaN(date.getTime())) return value;
        return date.toISOString(); // Full ISO format
      }
      
      case 'time': {
        // Input is HH:mm, store as is or with seconds
        if (value.match(/^\d{2}:\d{2}$/)) {
          return `${value}:00`; // Add seconds
        }
        return value;
      }
      
      default:
        return value;
    }
  } catch (error) {
    console.error('Error formatting for storage:', error);
    return value;
  }
}

/**
 * Validate and format a date/time value for display
 */
export function validateDateTime(value: string, type: DateTimeType): { isValid: boolean; formatted: string; error?: string } {
  if (!value) {
    return { isValid: false, formatted: '', error: 'No value provided' };
  }
  
  try {
    switch (type) {
      case 'date': {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return { isValid: false, formatted: value, error: 'Invalid date' };
        }
        
        const formatted = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return { isValid: true, formatted };
      }
      
      case 'datetime': {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return { isValid: false, formatted: value, error: 'Invalid datetime' };
        }
        
        const formatted = date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        return { isValid: true, formatted };
      }
      
      case 'time': {
        // Validate time format HH:mm or HH:mm:ss
        if (!value.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
          return { isValid: false, formatted: value, error: 'Invalid time format' };
        }
        
        const [hours, minutes] = value.split(':').map(Number);
        if (hours > 23 || minutes > 59) {
          return { isValid: false, formatted: value, error: 'Time out of range' };
        }
        
        // Format as 12-hour time
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const formatted = `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
        return { isValid: true, formatted };
      }
      
      default:
        return { isValid: false, formatted: value, error: 'Unknown type' };
    }
  } catch (error) {
    return { isValid: false, formatted: value, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Get relative time string (e.g., "in 2 days", "3 hours ago")
 */
export function getRelativeTime(value: string): string {
  if (!value) return '';
  
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSecs = Math.abs(diffMs) / 1000;
    const diffMins = diffSecs / 60;
    const diffHours = diffMins / 60;
    const diffDays = diffHours / 24;
    
    const isFuture = diffMs > 0;
    const prefix = isFuture ? 'in ' : '';
    const suffix = isFuture ? '' : ' ago';
    
    if (diffSecs < 60) {
      return `${prefix}${Math.floor(diffSecs)} second${Math.floor(diffSecs) !== 1 ? 's' : ''}${suffix}`;
    } else if (diffMins < 60) {
      return `${prefix}${Math.floor(diffMins)} minute${Math.floor(diffMins) !== 1 ? 's' : ''}${suffix}`;
    } else if (diffHours < 24) {
      return `${prefix}${Math.floor(diffHours)} hour${Math.floor(diffHours) !== 1 ? 's' : ''}${suffix}`;
    } else if (diffDays < 30) {
      return `${prefix}${Math.floor(diffDays)} day${Math.floor(diffDays) !== 1 ? 's' : ''}${suffix}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${prefix}${months} month${months !== 1 ? 's' : ''}${suffix}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${prefix}${years} year${years !== 1 ? 's' : ''}${suffix}`;
    }
  } catch (error) {
    console.error('Error getting relative time:', error);
    return '';
  }
}

/**
 * Format date to DD/MM/YYYY
 */
export function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDateToYYYYMMDD(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


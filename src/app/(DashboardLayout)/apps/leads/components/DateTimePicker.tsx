"use client";

import React, { useState } from 'react';
import { TextInput, Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { formatForInput, formatForStorage, validateDateTime, getRelativeTime } from '../../../../../utils/datetimeUtils';

interface DateTimePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  type: 'date' | 'datetime' | 'time';
  label?: string;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  id,
  value,
  onChange,
  placeholder,
  className = "w-full",
  required = false,
  type,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Convert input value back to proper format for storage
  const handleInputChange = (inputValue: string) => {
    const formattedValue = formatForStorage(inputValue, type);
    console.log('DateTimePicker - Input change:', {
      type,
      inputValue,
      formattedValue,
      isValid: validateDateTime(formattedValue, type).isValid
    });
    onChange(formattedValue);
  };

  const formatDisplayValue = (val: string) => {
    const validation = validateDateTime(val, type);
    return validation.formatted;
  };

  const getInputType = () => {
    switch (type) {
      case 'date':
        return 'date';
      case 'datetime':
        return 'datetime-local';
      case 'time':
        return 'time';
      default:
        return 'text';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'date':
        return 'solar:calendar-line-duotone';
      case 'datetime':
        return 'solar:calendar-add-line-duotone';
      case 'time':
        return 'solar:clock-circle-line-duotone';
      default:
        return 'solar:calendar-line-duotone';
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    
    switch (type) {
      case 'date':
        return 'Select date';
      case 'datetime':
        return 'Select date and time';
      case 'time':
        return 'Select time';
      default:
        return 'Select value';
    }
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <TextInput
          id={id}
          type={getInputType()}
          value={formatForInput(value, type)}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={getPlaceholder()}
          className={`${className} pr-10`}
          required={required}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Icon 
            icon={getIcon()} 
            className="h-5 w-5 text-gray-400 dark:text-gray-500" 
          />
        </div>
      </div>
      
      {/* Display formatted value for better UX */}
      {value && (
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-2 mb-1">
            <Icon icon="solar:eye-line-duotone" className="text-blue-600 dark:text-blue-400 text-sm" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Selected Value:
            </span>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            {formatDisplayValue(value)}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Raw: {value} | Input: {formatForInput(value, type)}
          </div>
          {type !== 'time' && (
            <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              {getRelativeTime(value)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;

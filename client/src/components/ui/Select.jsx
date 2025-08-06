import React, { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * ANCHOR: Select Component
 * A reusable select component with options and validation
 */
const Select = forwardRef(({
  label,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  fullWidth = true,
  size = 'md',
  placeholder = 'Select an option',
  options = [],
  className = '',
  ...props
}, ref) => {
  // Base select classes
  const baseClasses = 'block w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-white';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };
  
  // State classes
  const stateClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Determine state
  const getState = () => {
    if (error) return 'error';
    if (success) return 'success';
    return 'default';
  };
  
  const selectClasses = classNames(
    baseClasses,
    sizeClasses[size],
    stateClasses[getState()],
    widthClasses,
    className
  );
  
  const labelClasses = classNames(
    'block text-sm font-medium mb-1',
    {
      'text-gray-700': !error,
      'text-red-600': error
    }
  );
  
  const errorClasses = 'mt-1 text-sm text-red-600';
  const successClasses = 'mt-1 text-sm text-green-600';
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className={errorClasses}>
          {error}
        </p>
      )}
      
      {success && !error && (
        <p className={successClasses}>
          {success}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 
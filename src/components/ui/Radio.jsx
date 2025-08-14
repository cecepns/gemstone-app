import React, { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * ANCHOR: Radio Component
 * A reusable radio component with various states and validation
 */
const Radio = forwardRef(({
  label,
  checked = false,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  // Base radio classes
  const baseClasses = 'border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  // State classes
  const stateClasses = {
    default: 'border-gray-300',
    error: 'border-red-300 focus:ring-red-500',
    success: 'border-green-300 focus:ring-green-500'
  };
  
  // Determine state
  const getState = () => {
    if (error) return 'error';
    if (success) return 'success';
    return 'default';
  };
  
  const radioClasses = classNames(
    baseClasses,
    sizeClasses[size],
    stateClasses[getState()],
    className
  );
  
  const labelClasses = classNames(
    'ml-2 text-sm font-medium',
    {
      'text-gray-700': !error,
      'text-red-600': error,
      'cursor-pointer': !disabled,
      'cursor-not-allowed': disabled
    }
  );
  
  const errorClasses = 'mt-1 text-sm text-red-600';
  const successClasses = 'mt-1 text-sm text-green-600';
  
  const handleChange = (e) => {
    if (disabled) return;
    onChange?.(e);
  };
  
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="radio"
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          className={radioClasses}
          {...props}
        />
      </div>
      
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
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

Radio.displayName = 'Radio';

export default Radio; 
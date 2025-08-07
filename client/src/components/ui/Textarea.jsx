import React, { forwardRef } from 'react';
import classNames from 'classnames';

/**
 * ANCHOR: Textarea Component
 * A reusable textarea component with various states and validation
 */
const Textarea = forwardRef(({
  label,
  placeholder,
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
  rows = 4,
  maxLength,
  showCharacterCount = false,
  className = '',
  ...props
}, ref) => {
  // Base textarea classes
  const baseClasses = 'block w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed resize-vertical';
  
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
  
  const textareaClasses = classNames(
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
  const characterCountClasses = 'mt-1 text-xs text-gray-500 text-right';
  
  const currentLength = value?.length || 0;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        {...props}
      />
      
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
      
      {showCharacterCount && maxLength && (
        <p className={characterCountClasses}>
          {currentLength} / {maxLength} karakter
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea; 
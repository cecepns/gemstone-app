import React from 'react';
import classNames from 'classnames';

/**
 * ANCHOR: Badge Component
 * A reusable badge component with various colors and sizes
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
  ...props
}) => {
  // Base badge classes
  const baseClasses = 'inline-flex items-center font-medium';
  
  // Variant classes
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-50 text-gray-600',
    dark: 'bg-gray-800 text-white'
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm'
  };
  
  // Rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';
  
  const badgeClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses,
    className
  );
  
  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge; 
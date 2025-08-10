import classNames from 'classnames';
import React from 'react';

/**
 * ANCHOR: Card Component
 * A reusable card component with various layouts and styles
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  className = '',
  ...props
}) => {
  // Base card classes
  const baseClasses = 'bg-white rounded-lg sm:rounded-xl border';

  // Variant classes
  const variantClasses = {
    default: 'border-gray-200',
    elevated: 'border-gray-200 shadow-lg',
    outlined: 'border-gray-300',
    flat: 'border-gray-100',
  };

  // Responsive padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-4 sm:p-6 lg:p-8',
    xl: 'p-6 sm:p-8 lg:p-10',
  };

  // Responsive shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const cardClasses = classNames(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    shadowClasses[shadow],
    className,
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * ANCHOR: Card Header Component
 * Header section for card component
 */
const CardHeader = ({
  children,
  className = '',
  ...props
}) => {
  const headerClasses = classNames(
    'border-b border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4',
    className,
  );

  return (
    <div className={headerClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * ANCHOR: Card Body Component
 * Body section for card component
 */
const CardBody = ({
  children,
  className = '',
  ...props
}) => {
  const bodyClasses = classNames(
    'flex-1',
    className,
  );

  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * ANCHOR: Card Footer Component
 * Footer section for card component
 */
const CardFooter = ({
  children,
  className = '',
  ...props
}) => {
  const footerClasses = classNames(
    'border-t border-gray-200 pt-3 sm:pt-4 mt-3 sm:mt-4',
    className,
  );

  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

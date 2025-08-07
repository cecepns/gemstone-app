import React, { useEffect } from 'react';
import classNames from 'classnames';

/**
 * ANCHOR: Modal Component
 * A reusable modal component with backdrop and animations
 */
const Modal = ({
  isOpen = false,
  onClose,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
  ...props
}) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose?.();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closeOnEscape]);
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full mx-4'
  };
  
  const modalClasses = classNames(
    'bg-white rounded-lg shadow-xl transform transition-all',
    sizeClasses[size],
    className
  );
  
  const backdropClasses = classNames(
    'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50',
    {
      'opacity-0 pointer-events-none': !isOpen,
      'opacity-100': isOpen
    }
  );
  
  const contentClasses = classNames(
    'transform transition-all duration-300',
    {
      'scale-95 opacity-0': !isOpen,
      'scale-100 opacity-100': isOpen
    }
  );
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose?.();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className={backdropClasses} onClick={handleBackdropClick} {...props}>
      <div className={contentClasses}>
        <div className={modalClasses}>
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * ANCHOR: Modal Header Component
 * Header section for modal component
 */
const ModalHeader = ({
  children,
  onClose,
  className = '',
  ...props
}) => {
  const headerClasses = classNames(
    'flex items-center justify-between p-6 border-b border-gray-200',
    className
  );
  
  return (
    <div className={headerClasses} {...props}>
      <div className="flex-1">
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * ANCHOR: Modal Body Component
 * Body section for modal component
 */
const ModalBody = ({
  children,
  className = '',
  ...props
}) => {
  const bodyClasses = classNames(
    'p-6',
    className
  );
  
  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * ANCHOR: Modal Footer Component
 * Footer section for modal component
 */
const ModalFooter = ({
  children,
  className = '',
  ...props
}) => {
  const footerClasses = classNames(
    'flex items-center justify-end space-x-3 p-6 border-t border-gray-200',
    className
  );
  
  return (
    <div className={footerClasses} {...props}>
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal; 
/**
 * Date utility functions for consistent Indonesian timezone handling
 * All functions use Asia/Jakarta timezone to ensure consistent date display
 */

/**
 * Format date for input fields (YYYY-MM-DD format)
 * @param {string} dateString - Date string from database
 * @returns {string} - Formatted date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) {
    return '';
  }

  // Extract YYYY-MM-DD directly if present to avoid timezone shift
  const match = String(dateString).match(/^(\d{4}-\d{2}-\d{2})/);
  if (match && match[1]) {
    return match[1];
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '';
  }

  // Use Indonesian timezone (Asia/Jakarta) to format the date
  const year = date.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  });
  const month = date.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Jakarta',
    month: '2-digit',
  });
  const day = date.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit',
  });

  return `${year}-${month}-${day}`;
};

/**
 * Format date for display in Indonesian locale
 * @param {string} dateString - Date string to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date for display
 */
export const formatDateForDisplay = (dateString, options = {}) => {
  if (!dateString) {
    return '-';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const defaultOptions = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return date.toLocaleDateString('id-ID', { ...defaultOptions, ...options });
};

/**
 * Get current date in YYYY-MM-DD format for date input
 * @returns {string} - Current date in YYYY-MM-DD format
 */
export const getCurrentDate = () => {
  const now = new Date();
  return now.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Jakarta',
  });
};

/**
 * Format date for table display (short format)
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date for table display
 */
export const formatDateForTable = (dateString) => {
  return formatDateForDisplay(dateString, {
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date for print display (long format)
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date for print display
 */
export const formatDateForPrint = (dateString) => {
  return formatDateForDisplay(dateString, {
    month: 'long',
  });
};

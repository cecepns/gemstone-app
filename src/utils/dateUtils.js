// ANCHOR: Date Utilities - Shared date formatting functions

/**
 * Format date for display in Indonesian locale
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) {
    return '-';
  }
  return new Date(dateString).toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date for display in English locale (for public verification)
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDateEnglish = (dateString) => {
  if (!dateString) {
    return '-';
  }
  return new Date(dateString).toLocaleDateString('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date with time for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) {
    return '-';
  }
  return new Date(dateString).toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format date for display in Indonesian locale (for error messages and validation)
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date for display
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) {
    return '-';
  }
  return new Date(dateString).toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date for HTML input (YYYY-MM-DD format)
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date for input
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} - Current date for input
 */
export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
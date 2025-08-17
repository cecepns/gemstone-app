// ANCHOR: API Utilities - Centralized API request functions with authentication and error handling

// Base API configuration
const API_BASE_URL = 'https://api-inventory.isavralabel.com/gemstone/api';
// const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get authentication headers for API requests
 * @param {string} token - JWT token
 * @returns {Object} - Headers object with authorization
 */
const getAuthHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Extract token from AuthContext header
 * @param {Object} authHeader - Auth header object from getAuthHeader()
 * @returns {string|null} - Extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.Authorization) {
    return null;
  }

  return authHeader.Authorization.replace('Bearer ', '');
};

/**
 * Handle API response and extract data
 * @param {Response} response - Fetch response object
 * @returns {Promise<Object>} - Parsed response data
 */
const handleResponse = async(response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
};

/**
 * Handle API errors with proper error messages
 * @param {Error} error - Error object
 * @returns {string} - User-friendly error message
 */
const handleError = (error) => {
  console.error('API Error:', error);

  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.';
  }

  return error.message || 'An unexpected error occurred.';
};

/**
 * Make GET request to API
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {string} options.token - JWT token for authentication
 * @param {Object} options.params - Query parameters
 * @returns {Promise<Object>} - API response data
 */
export const apiGet = async(endpoint, { token = null, params = {} } = {}) => {
  try {
    // Build URL with query parameters
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    return await handleResponse(response);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Make POST request to API
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {Object} options.data - Request body data
 * @param {string} options.token - JWT token for authentication
 * @param {boolean} options.isFormData - Whether to send as FormData
 * @returns {Promise<Object>} - API response data
 */
export const apiPost = async(endpoint, { data = {}, token = null, isFormData = false } = {}) => {
  try {
    let body;
    const headers = getAuthHeaders(token);

    if (isFormData) {
      // Remove Content-Type for FormData - browser will set it automatically
      delete headers['Content-Type'];
      body = data;
    } else {
      body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body,
    });

    return await handleResponse(response);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Make PUT request to API
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {Object} options.data - Request body data
 * @param {string} options.token - JWT token for authentication
 * @returns {Promise<Object>} - API response data
 */
export const apiPut = async(endpoint, { data = {}, token = null } = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    return await handleResponse(response);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Make DELETE request to API
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {string} options.token - JWT token for authentication
 * @returns {Promise<Object>} - API response data
 */
export const apiDelete = async(endpoint, { token = null } = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    return await handleResponse(response);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Make GET request that expects a Blob (e.g., file download)
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {string} options.token - JWT token for authentication
 * @returns {Promise<{ blob: Blob, response: Response }>} - Blob and raw response
 */
export const apiGetBlob = async(endpoint, { token = null } = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      // Try to parse JSON error if available
      try {
        const data = await response.json();
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      } catch (_) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const blob = await response.blob();
    return { blob, response };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Upload file to API
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @param {FormData} options.formData - FormData containing file and other data
 * @param {string} options.token - JWT token for authentication
 * @returns {Promise<Object>} - API response data
 */
export const apiUpload = async(endpoint, { formData, token = null } = {}) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it automatically with boundary

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Upload file to API using PUT method
 * @param {string} endpoint
 * @param {{ formData: FormData, token?: string }} options
 */
export const apiUploadPut = async(endpoint, { formData, token = null } = {}) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: formData,
    });
    return await handleResponse(response);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

// Specific API functions for common operations

/**
 * Admin login
 * @param {string} username - Admin username
 * @param {string} password - Admin password
 * @returns {Promise<Object>} - Login response with token and admin data
 */
export const loginAdmin = async(username, password) => {
  return await apiPost('/admin/login', {
    data: { username, password },
  });
};

/**
 * Verify admin token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Token verification response
 */
export const verifyAdminToken = async(token) => {
  return await apiGet('/admin/verify', { token });
};

/**
 * Get basic admin dashboard stats
 * @param {Object} authHeader - Auth header from getAuthHeader()
 */
export const getAdminStats = async(authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet('/admin/stats', { token });
};

/**
 * Get all gemstones (admin) - with automatic token extraction
 * @param {Object} options - Request options
 * @param {Object} options.authHeader - Auth header from getAuthHeader()
 * @param {Object} options.params - Query parameters (page, limit, search, sortBy, sortOrder)
 * @returns {Promise<Object>} - Gemstones list response
 */
export const getGemstones = async({ authHeader, params = {} } = {}) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet('/gemstones', { token, params });
};

/**
 * Get gemstone detail (admin) - with automatic token extraction
 * @param {string} id - Gemstone ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Gemstone detail response
 */
export const getGemstoneDetail = async(id, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet(`/gemstones/${id}/detail`, { token });
};

/**
 * Create new gemstone - with automatic token extraction
 * @param {FormData} formData - FormData with gemstone data and image
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Created gemstone response
 */
export const createGemstone = async(formData, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiUpload('/gemstones', { formData, token });
};

/**
 * Update gemstone by ID - supports JSON or FormData when updating image
 * @param {string} id - Gemstone ID
 * @param {FormData|Object} data - Payload (use FormData if including image)
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Updated gemstone response
 */
export const updateGemstone = async(id, data, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  if (data instanceof FormData) {
    // Send as multipart for image update
    return await apiUploadPut(`/gemstones/${id}`, { formData: data, token });
  }
  return await apiPut(`/gemstones/${id}`, { data, token });
};

/**
 * Delete gemstone - with automatic token extraction
 * @param {string} id - Gemstone ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Delete response
 */
export const deleteGemstone = async(id, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiDelete(`/gemstones/${id}`, { token });
};

/**
 * Verify gemstone by unique ID (public)
 * @param {string} uniqueId - Unique gemstone ID
 * @returns {Promise<Object>} - Verification response
 */
export const verifyGemstone = async(uniqueId) => {
  return await apiGet(`/gemstones/${uniqueId}`);
};

/**
 * Get gemstone owners history (public)
 * @param {string} uniqueId - Unique gemstone ID
 * @returns {Promise<Object>} - Owners history response
 */
export const getGemstoneOwnersPublic = async(uniqueId) => {
  return await apiGet(`/gemstones/${uniqueId}/owners/public`);
};

// ======================================
// GEMSTONE OWNERS API FUNCTIONS
// ======================================

/**
 * Get gemstone owners history
 * @param {string} gemstoneId - Gemstone ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Owners history response
 */
export const getGemstoneOwners = async(gemstoneId, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet(`/gemstones/${gemstoneId}/owners`, { token });
};

/**
 * Add new owner to gemstone
 * @param {string} gemstoneId - Gemstone ID
 * @param {Object} ownerData - Owner data
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Add owner response
 */
export const addGemstoneOwner = async(gemstoneId, ownerData, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiPost(`/gemstones/${gemstoneId}/owners`, { data: ownerData, token });
};

/**
 * Update owner information
 * @param {string} gemstoneId - Gemstone ID
 * @param {string} ownerId - Owner ID
 * @param {Object} ownerData - Updated owner data
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Update owner response
 */
export const updateGemstoneOwner = async(gemstoneId, ownerId, ownerData, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiPut(`/gemstones/${gemstoneId}/owners/${ownerId}`, { data: ownerData, token });
};

/**
 * Delete owner record
 * @param {string} gemstoneId - Gemstone ID
 * @param {string} ownerId - Owner ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Delete owner response
 */
export const deleteGemstoneOwner = async(gemstoneId, ownerId, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiDelete(`/gemstones/${gemstoneId}/owners/${ownerId}`, { token });
};

// ======================================
// GEMSTONE GALLERY API FUNCTIONS
// ======================================

/**
 * Get gemstone photos
 * @param {string} gemstoneId - Gemstone ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Photos response
 */
export const getGemstonePhotos = async(gemstoneId, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet(`/gemstones/${gemstoneId}/photos`, { token });
};

/**
 * Upload photo to gemstone
 * @param {string} gemstoneId - Gemstone ID
 * @param {FormData} formData - FormData containing photo and caption
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Upload response
 */
export const uploadGemstonePhoto = async(gemstoneId, formData, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiPost(`/gemstones/${gemstoneId}/photos`, { data: formData, isFormData: true, token });
};

/**
 * Update photo caption
 * @param {string} gemstoneId - Gemstone ID
 * @param {string} photoId - Photo ID
 * @param {Object} photoData - Updated photo data
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Update response
 */
export const updateGemstonePhoto = async(gemstoneId, photoId, photoData, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiPut(`/gemstones/${gemstoneId}/photos/${photoId}`, { data: photoData, token });
};

/**
 * Delete photo from gemstone
 * @param {string} gemstoneId - Gemstone ID
 * @param {string} photoId - Photo ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Delete response
 */
export const deleteGemstonePhoto = async(gemstoneId, photoId, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiDelete(`/gemstones/${gemstoneId}/photos/${photoId}`, { token });
};

/**
 * Get all owners from all gemstones (for template selection)
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - All owners response
 */
export const getAllOwners = async(authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet('/owners/all', { token });
};

// ======================================
// ADMIN SETTINGS API FUNCTIONS
// ======================================

/**
 * Change admin password
 * @param {{ currentPassword: string, newPassword: string }} payload
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Response
 */
export const changeAdminPassword = async(payload, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiPost('/admin/change-password', { data: payload, token });
};

/**
 * Download database backup as SQL file
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<{ blob: Blob, filename: string }>} - Backup blob and filename
 */
export const downloadDatabaseBackup = async(authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  const { blob, response } = await apiGetBlob('/admin/backup', { token });
  const disposition = response.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^";]+)"?/i);
  const filename = match ? match[1] : 'gemstone_backup.sql';
  return { blob, filename };
};


// ANCHOR: API Utilities - Centralized API request functions with authentication and error handling

// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get authentication headers for API requests
 * @param {string} token - JWT token
 * @returns {Object} - Headers object with authorization
 */
const getAuthHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json'
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
const handleResponse = async (response) => {
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
export const apiGet = async (endpoint, { token = null, params = {} } = {}) => {
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
      headers: getAuthHeaders(token)
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
export const apiPost = async (endpoint, { data = {}, token = null, isFormData = false } = {}) => {
  try {
    let body;
    let headers = getAuthHeaders(token);
    
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
      body
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
export const apiPut = async (endpoint, { data = {}, token = null } = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data)
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
export const apiDelete = async (endpoint, { token = null } = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    });

    return await handleResponse(response);
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
export const apiUpload = async (endpoint, { formData, token = null } = {}) => {
  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Don't set Content-Type for FormData - browser will set it automatically with boundary

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
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
export const loginAdmin = async (username, password) => {
  return await apiPost('/admin/login', {
    data: { username, password }
  });
};

/**
 * Verify admin token
 * @param {string} token - JWT token
 * @returns {Promise<Object>} - Token verification response
 */
export const verifyAdminToken = async (token) => {
  return await apiGet('/admin/verify', { token });
};

/**
 * Get all gemstones (admin) - with automatic token extraction
 * @param {Object} options - Request options
 * @param {Object} options.authHeader - Auth header from getAuthHeader()
 * @param {Object} options.params - Query parameters (page, limit, search, sortBy, sortOrder)
 * @returns {Promise<Object>} - Gemstones list response
 */
export const getGemstones = async ({ authHeader, params = {} } = {}) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet('/gemstones', { token, params });
};

/**
 * Get gemstone detail (admin) - with automatic token extraction
 * @param {string} id - Gemstone ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Gemstone detail response
 */
export const getGemstoneDetail = async (id, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiGet(`/gemstones/${id}/detail`, { token });
};

/**
 * Create new gemstone - with automatic token extraction
 * @param {FormData} formData - FormData with gemstone data and image
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Created gemstone response
 */
export const createGemstone = async (formData, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiUpload('/gemstones', { formData, token });
};

/**
 * Delete gemstone - with automatic token extraction
 * @param {string} id - Gemstone ID
 * @param {Object} authHeader - Auth header from getAuthHeader()
 * @returns {Promise<Object>} - Delete response
 */
export const deleteGemstone = async (id, authHeader) => {
  const token = authHeader ? extractTokenFromHeader(authHeader) : null;
  return await apiDelete(`/gemstones/${id}`, { token });
};

/**
 * Verify gemstone by unique ID (public)
 * @param {string} uniqueId - Unique gemstone ID
 * @returns {Promise<Object>} - Verification response
 */
export const verifyGemstone = async (uniqueId) => {
  return await apiGet(`/gemstones/${uniqueId}`);
}; 
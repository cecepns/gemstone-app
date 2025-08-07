# API Utilities

This module provides centralized API request functions with proper error handling, authentication, and consistent response formatting.

## Features

- **Centralized API calls**: All API requests go through this module
- **Automatic error handling**: Consistent error messages and handling
- **Authentication support**: Automatic token management from AuthContext
- **Type safety**: Proper parameter validation
- **File upload support**: Built-in FormData handling

## Usage

### Basic API Functions

```javascript
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '../utils/api';

// GET request
const data = await apiGet('/endpoint', { 
  token: 'jwt_token',
  params: { page: 1, limit: 10 }
});

// POST request
const result = await apiPost('/endpoint', {
  data: { name: 'value' },
  token: 'jwt_token'
});

// PUT request
const updated = await apiPut('/endpoint', {
  data: { id: 1, name: 'new_value' },
  token: 'jwt_token'
});

// DELETE request
await apiDelete('/endpoint', { token: 'jwt_token' });

// File upload
const formData = new FormData();
formData.append('file', file);
const uploaded = await apiUpload('/upload', { formData, token: 'jwt_token' });
```

### Specific API Functions (with automatic token extraction)

```javascript
import { 
  loginAdmin, 
  verifyAdminToken, 
  getGemstones, 
  getGemstoneDetail,
  createGemstone,
  deleteGemstone,
  verifyGemstone 
} from '../utils/api';
import { useAuth } from '../context/AuthContext';

// In your component
const { getAuthHeader } = useAuth();

// Admin login
const loginResult = await loginAdmin('username', 'password');

// Verify admin token
const isValid = await verifyAdminToken('jwt_token');

// Get gemstones (admin) - automatic token extraction
const gemstones = await getGemstones({ 
  authHeader: getAuthHeader(),
  params: { page: 1, limit: 50 }
});

// Get gemstone detail (admin) - automatic token extraction
const gemstone = await getGemstoneDetail('gemstone_id', getAuthHeader());

// Create gemstone - automatic token extraction
const formData = new FormData();
formData.append('name', 'Ruby');
formData.append('gemstoneImage', file);
const created = await createGemstone(formData, getAuthHeader());

// Delete gemstone - automatic token extraction
await deleteGemstone('gemstone_id', getAuthHeader());

// Verify gemstone (public)
const verified = await verifyGemstone('unique_id');
```

## Error Handling

All functions throw errors with user-friendly messages:

```javascript
try {
  const data = await getGemstones({ authHeader: getAuthHeader() });
} catch (error) {
  console.error(error.message); // "Authentication failed. Please login again."
}
```

## Configuration

The API base URL is configured in `api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

To change the base URL for different environments, modify this constant.

## Authentication

The module automatically handles JWT token authentication:

- **Automatic token extraction**: Functions accept `authHeader` from `getAuthHeader()` and automatically extract the token
- **No manual token handling**: Components no longer need to manually extract tokens with `getAuthHeader().Authorization?.replace('Bearer ', '')`
- **Headers are automatically set**: With `Authorization: Bearer <token>`
- **Failed authentication**: Throws appropriate error messages

## File Uploads

For file uploads, use the `apiUpload` function or specific functions like `createGemstone`:

```javascript
const formData = new FormData();
formData.append('name', 'Gemstone Name');
formData.append('gemstoneImage', file);

const result = await createGemstone(formData, getAuthHeader());
```

The module automatically handles:
- FormData creation
- Proper headers for multipart/form-data
- File validation (done in components)
- Automatic token extraction from AuthContext 
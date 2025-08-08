// ANCHOR: Express Server Setup for Gemstone Verification App
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const QRCode = require('qrcode');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create Express application
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ======================================
// STATIC FILE SERVING MIDDLEWARE
// ======================================

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Specific route for uploads with proper headers
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'), {
  // Set proper cache headers for images
  setHeaders: (res, path) => {
    if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png') || path.endsWith('.gif')) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours cache
      res.setHeader('Content-Type', 'image/' + path.split('.').pop());
    }
  }
}));

// ======================================
// MULTER CONFIGURATION FOR FILE UPLOAD
// ======================================

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public/uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, fileName);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
  }
};

// Multer instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Error Upload File',
        message: 'Ukuran file terlalu besar. Maksimal 5MB.'
      });
    }
    return res.status(400).json({
      error: 'Error Upload File',
      message: error.message
    });
  } else if (error) {
    return res.status(400).json({
      error: 'Error Upload File',
      message: error.message
    });
  }
  next();
};

// ======================================
// JWT CONFIGURATION
// ======================================

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'gemstone_verification_secret_key_2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// ANCHOR: API Base URL
// Global base URL for API responses and QR code links
const SERVER_BASE_URL = process.env.SERVER_BASE_URL || 'http://localhost:5000';
const API_BASE_URL = process.env.API_BASE_URL || `${SERVER_BASE_URL}/api`;
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || 'http://localhost:5173';

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gemstone_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Initialize database connection test
testConnection();

// ======================================
// HELPER FUNCTIONS
// ======================================

/**
 * Generate unique identifiers for gemstone
 * @returns {Object} Object containing unique_id_number and qr_code_data_url
 */
async function generateIdentifiers() {
  try {
    // Generate unique ID with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const unique_id_number = `GEM-${timestamp}-${randomString}`;
    
    // Create verification URL that will be encoded in QR code
    const verificationUrl = `${CLIENT_BASE_URL}/verify/${unique_id_number}`;
    
    // Generate QR code as data URL
    const qr_code_data_url = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return {
      unique_id_number,
      qr_code_data_url
    };
  } catch (error) {
    throw new Error('Gagal menghasilkan identifier: ' + error.message);
  }
}

// ======================================
// AUTHENTICATION MIDDLEWARE
// ======================================

/**
 * Middleware to verify JWT token from Authorization header
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyToken = (req, res, next) => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Header Authorization tidak ditemukan'
      });
    }
    
    // Check if header format is correct (Bearer [token])
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Format token tidak valid. Gunakan: Bearer [token]'
      });
    }
    
    // Extract token from header
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Check if token exists
    if (!token) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Token tidak ditemukan'
      });
    }
    
    // Verify token using jsonwebtoken
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add decoded payload to req.admin for use in subsequent routes
    req.admin = {
      id: decoded.id,
      username: decoded.username,
      type: decoded.type,
      iat: decoded.iat,
      exp: decoded.exp
    };
    
    // Call next() to continue to the next middleware/route
    next();
    
  } catch (error) {
    // Handle JWT verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token tidak valid'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token sudah kadaluarsa'
      });
    } else if (error.name === 'NotBeforeError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token belum aktif'
      });
    } else {
      console.error('Token verification error:', error);
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Gagal memverifikasi token'
      });
    }
  }
};

// ======================================
// API ROUTES - Add your routes here
// ======================================

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gemstone verification server is running',
    timestamp: new Date().toISOString()
  });
});

// ======================================
// GEMSTONE ROUTES
// ======================================

/**
 * POST /api/gemstones - Create new gemstone (Admin only)
 * Handles file upload and stores gemstone data
 */
app.post('/api/gemstones', verifyToken, upload.single('gemstoneImage'), handleMulterError, async (req, res) => {
  try {
    // Extract data from request body
    const {
      name,
      description,
      weight_carat,
      dimensions_mm,
      color,
      treatment,
      origin
    } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Nama batu mulia harus diisi'
      });
    }
    
    // Generate unique identifiers
    const identifiers = await generateIdentifiers();
    
    // Handle uploaded file
    let photo_url = null;
    if (req.file) {
      // Create public URL for the uploaded file
      photo_url = `/uploads/${req.file.filename}`;
    }
    
    // Prepare data for database insertion
    const gemstoneData = {
      unique_id_number: identifiers.unique_id_number,
      name: name || null,
      description: description || null,
      weight_carat: weight_carat ? parseFloat(weight_carat) : null,
      dimensions_mm: dimensions_mm || null,
      color: color || null,
      treatment: treatment || null,
      origin: origin || null,
      photo_url: photo_url,
      qr_code_data_url: identifiers.qr_code_data_url
    };
    
    // Insert into database
    const insertQuery = `
      INSERT INTO gemstones (
        unique_id_number, name, description, weight_carat, 
        dimensions_mm, color, treatment, origin, 
        photo_url, qr_code_data_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      gemstoneData.unique_id_number,
      gemstoneData.name,
      gemstoneData.description,
      gemstoneData.weight_carat,
      gemstoneData.dimensions_mm,
      gemstoneData.color,
      gemstoneData.treatment,
      gemstoneData.origin,
      gemstoneData.photo_url,
      gemstoneData.qr_code_data_url
    ];
    
    const [result] = await pool.execute(insertQuery, values);
    
    // Fetch the created gemstone
    const [rows] = await pool.execute(
      'SELECT * FROM gemstones WHERE id = ?',
      [result.insertId]
    );
    
    const createdGemstone = rows[0];
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Batu mulia berhasil dibuat',
      data: {
        ...createdGemstone,
        photo_url: createdGemstone.photo_url ? `${SERVER_BASE_URL}${createdGemstone.photo_url}` : null
      }
    });
    
  } catch (error) {
    console.error('Error creating gemstone:', error);
    
    // Clean up uploaded file if database insertion fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Gagal membuat batu mulia: ' + error.message
    });
  }
});

/**
 * GET /api/gemstones/:id - Verify gemstone by unique ID (Public access)
 * Used for QR code verification and public certificate lookup
 */
app.get('/api/gemstones/:id', async (req, res) => {
  try {
    // Extract unique ID from URL parameter
    const { id } = req.params;
    
    // Validate ID parameter
    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Parameter ID diperlukan'
      });
    }
    
    // Query database for gemstone by unique_id_number
    const [rows] = await pool.execute(
      'SELECT * FROM gemstones WHERE unique_id_number = ?',
      [id]
    );
    
    // Check if gemstone was found
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Sertifikat tidak ditemukan'
      });
    }
    
    // Get the gemstone data
    const gemstone = rows[0];
    
    // Format response with full photo URL
    const responseData = {
      ...gemstone,
      photo_url: gemstone.photo_url ? `${SERVER_BASE_URL}${gemstone.photo_url}` : null,
      // Add verification status
      verified: true,
      verification_timestamp: new Date().toISOString()
    };
    
    // Return gemstone data
    res.status(200).json({
      success: true,
      message: 'Sertifikat ditemukan',
      data: responseData
    });
    
  } catch (error) {
    console.error('Error verifying gemstone:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Gagal memverifikasi sertifikat: ' + error.message
    });
  }
});

// ======================================
// ADMIN AUTHENTICATION ROUTES
// ======================================

/**
 * POST /api/admin/login - Admin login authentication
 * Handles username/password authentication and returns JWT token
 */
app.post('/api/admin/login', async (req, res) => {
  try {
    // Extract username and password from request body
    const { username, password } = req.body;
    
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username dan password harus diisi'
      });
    }
    
    // Search for admin in database by username
    const [rows] = await pool.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    
    // Check if admin was found
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Admin tidak ditemukan'
      });
    }
    
    const admin = rows[0];

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Password salah'
      });
    }
    
    // Create JWT token with admin information
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username,
        type: 'admin'
      },
      JWT_SECRET,
      { 
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'gemstone-verification-system',
        audience: 'admin-panel'
      }
    );
    
    // Update last login timestamp (optional)
    await pool.execute(
      'UPDATE admins SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [admin.id]
    );
    
    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token: token,
        admin: {
          id: admin.id,
          username: admin.username,
          created_at: admin.created_at
        },
        expires_in: JWT_EXPIRES_IN
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Terjadi kesalahan saat login'
    });
  }
});

/**
 * GET /api/admin/verify - Verify admin token (Protected route example)
 * Uses verifyToken middleware to check authentication
 */
app.get('/api/admin/verify', verifyToken, (req, res) => {
  try {
    // If we reach here, token is valid (thanks to verifyToken middleware)
    res.status(200).json({
      success: true,
      message: 'Token valid',
      data: {
        admin: req.admin,
        authenticated: true,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Gagal memverifikasi token'
    });
  }
});

/**
 * GET /api/gemstones - Get all gemstones (Admin only)
 * Returns paginated list of all gemstones with optional filtering
 */
app.get('/api/gemstones', verifyToken, async (req, res) => {
  try {
    // Extract query parameters for pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'desc';
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Build WHERE clause for search
    let whereClause = '';
    let whereParams = [];
    
    if (search) {
      whereClause = `
        WHERE name LIKE ? OR 
              unique_id_number LIKE ? OR 
              color LIKE ? OR 
              origin LIKE ? OR 
              description LIKE ?
      `;
      const searchPattern = `%${search}%`;
      whereParams = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern];
    }
    
    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['id', 'name', 'weight_carat', 'color', 'origin', 'created_at'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    // Build the main query
    const query = `
      SELECT 
        id,
        unique_id_number,
        name,
        description,
        weight_carat,
        dimensions_mm,
        color,
        treatment,
        origin,
        photo_url,
        qr_code_data_url,
        created_at
      FROM gemstones 
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ? OFFSET ?
    `;
    
    // Execute query with parameters
    const queryParams = [...whereParams, limit, offset];
    const [rows] = await pool.execute(query, queryParams);
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM gemstones 
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, whereParams);
    const total = countResult[0].total;
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Format response data with full photo URLs
    const formattedData = rows.map(gemstone => ({
      ...gemstone,
      photo_url: gemstone.photo_url ? `${SERVER_BASE_URL}${gemstone.photo_url}` : null
    }));
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Batu mulia berhasil diambil',
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        search,
        sortBy: validSortBy,
        sortOrder: validSortOrder
      }
    });
    
  } catch (error) {
    console.error('Error fetching gemstones:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Gagal mengambil batu mulia: ' + error.message
    });
  }
});

/**
 * GET /api/gemstones/:id/detail - Get single gemstone by ID (Admin only)
 * Returns detailed gemstone information for admin panel
 */
app.get('/api/gemstones/:id/detail', verifyToken, async (req, res) => {
  try {
    // Extract ID from URL parameter
    const { id } = req.params;
    
    // Validate ID parameter
    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ID parameter is required'
      });
    }
    
    // Query database for gemstone by ID
    const [rows] = await pool.execute(
      'SELECT * FROM gemstones WHERE id = ?',
      [id]
    );
    
    // Check if gemstone was found
    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Gemstone not found'
      });
    }
    
    // Get the gemstone data
    const gemstone = rows[0];
    
    // Format response with full photo URL
    const responseData = {
      ...gemstone,
      photo_url: gemstone.photo_url ? `${SERVER_BASE_URL}${gemstone.photo_url}` : null
    };
    
    // Return gemstone data
    res.status(200).json({
      success: true,
      message: 'Detail batu mulia berhasil diambil',
      data: responseData
    });
    
  } catch (error) {
    console.error('Error fetching gemstone detail:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Gagal mengambil detail batu mulia: ' + error.message
    });
  }
});

/**
 * DELETE /api/gemstones/:id - Delete gemstone by ID (Admin only)
 * Permanently removes gemstone from database
 */
app.delete('/api/gemstones/:id', verifyToken, async (req, res) => {
  try {
    // Extract ID from URL parameter
    const { id } = req.params;
    
    // Validate ID parameter
    if (!id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ID parameter is required'
      });
    }
    
    // First, get the gemstone to check if it exists and get photo URL
    const [existingRows] = await pool.execute(
      'SELECT photo_url FROM gemstones WHERE id = ?',
      [id]
    );
    
    // Check if gemstone was found
    if (existingRows.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Gemstone not found'
      });
    }
    
    const gemstone = existingRows[0];
    
    // Delete from database
    const [result] = await pool.execute(
      'DELETE FROM gemstones WHERE id = ?',
      [id]
    );
    
    // Check if deletion was successful
    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Gemstone not found'
      });
    }
    
    // Delete associated photo file if it exists
    if (gemstone.photo_url) {
      try {
        const filePath = path.join(__dirname, 'public', gemstone.photo_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Error deleting photo file:', fileError);
        // Don't fail the request if file deletion fails
      }
    }
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Batu mulia berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleting gemstone:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Gagal menghapus batu mulia: ' + error.message
    });
  }
});

// TODO: Add more protected routes here
// app.post('/api/gemstones', verifyToken, createGemstone); // Already has verifyToken
// app.put('/api/gemstones/:id', verifyToken, updateGemstone);
// app.post('/api/admin/logout', verifyToken, logoutAdmin);
// app.get('/api/admin/dashboard', verifyToken, getDashboardStats);

// ======================================
// ERROR HANDLING MIDDLEWARE
// ======================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Rute ${req.originalUrl} tidak ada di server ini`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: error.message || 'Terjadi kesalahan!'
  });
});

// ======================================
// START SERVER
// ======================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: ${API_BASE_URL}/health`);
});

// Export app for testing purposes
module.exports = app;
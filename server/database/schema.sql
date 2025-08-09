-- ANCHOR: Database Schema for Gemstone Verification System

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS gemstone_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE gemstone_db;

-- Create admins table for authentication
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add indexes for performance
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123 - hashed with bcrypt)
-- Note: Change this password after first login!
INSERT INTO admins (username, password) VALUES 
('admin', '$2b$10$YYQzJiQ4hMZ2DcqxSVimqOBLd48yb3UHnUq6VSRXwsyqPq.DtNwSu')
ON DUPLICATE KEY UPDATE username = username;

-- Create gemstones table
CREATE TABLE IF NOT EXISTS gemstones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    unique_id_number VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NULL,
    description TEXT NULL,
    weight_carat DECIMAL(10, 2) NULL,
    dimensions_mm VARCHAR(100) NULL,
    color VARCHAR(100) NULL,
    treatment VARCHAR(255) NULL,
    origin VARCHAR(255) NULL,
    photo_url VARCHAR(255) NULL,
    qr_code_data_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Add indexes for performance
    INDEX idx_unique_id (unique_id_number),
    INDEX idx_name (name),
    INDEX idx_color (color),
    INDEX idx_origin (origin),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create gemstone owners history table
CREATE TABLE IF NOT EXISTS gemstone_owners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gemstone_id INT NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    owner_phone VARCHAR(50) NOT NULL,
    owner_email VARCHAR(255) NULL,
    owner_address TEXT NULL,
    ownership_start_date DATE NOT NULL,
    ownership_end_date DATE NULL,
    is_current_owner BOOLEAN DEFAULT FALSE,
    notes TEXT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (gemstone_id) REFERENCES gemstones(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE RESTRICT,
    
    -- Add indexes for performance
    INDEX idx_gemstone_id (gemstone_id),
    INDEX idx_owner_name (owner_name),
    INDEX idx_owner_email (owner_email),
    INDEX idx_is_current_owner (is_current_owner),
    INDEX idx_ownership_start_date (ownership_start_date),
    INDEX idx_created_at (created_at),
    
    -- Ensure only one current owner per gemstone
    UNIQUE KEY unique_current_owner (gemstone_id, is_current_owner)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Insert sample data for testing
-- INSERT INTO gemstones (
--     unique_id_number, 
--     name, 
--     description, 
--     weight_carat, 
--     dimensions_mm, 
--     color, 
--     treatment, 
--     origin
-- ) VALUES 
-- (
--     'GEM001', 
--     'Blue Sapphire', 
--     'High quality blue sapphire with excellent clarity', 
--     2.50, 
--     '8.5 x 6.5 x 4.2', 
--     'Royal Blue', 
--     'Heat Treatment', 
--     'Sri Lanka'
-- ),
-- (
--     'GEM002', 
--     'Ruby', 
--     'Natural ruby with vivid red color', 
--     1.75, 
--     '7.2 x 5.8 x 3.9', 
--     'Pigeon Blood Red', 
--     'None', 
--     'Myanmar'
-- );

-- Show table structure
DESCRIBE gemstones;
DESCRIBE gemstone_owners;
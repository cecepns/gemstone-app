-- Migration: Add Settings Table
-- Date: 2024
-- Description: Add simplified settings table for storing key-value configuration data (email and phone)

USE gemstone_db;

-- Create simplified settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) UNIQUE NOT NULL COMMENT 'Unique key for the setting',
    setting_value TEXT NULL COMMENT 'Value for the setting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add indexes for performance
    INDEX idx_setting_key (setting_key),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert email, phone, and instagram settings
INSERT INTO settings (setting_key, setting_value) VALUES 
('email', ''),
('phone', ''),
('instagram', '@gemstonestory')
ON DUPLICATE KEY UPDATE 
    setting_value = VALUES(setting_value),
    updated_at = CURRENT_TIMESTAMP;

-- Verify the table structure
DESCRIBE settings;

-- Show sample data
SELECT 
    id,
    setting_key,
    setting_value,
    created_at,
    updated_at
FROM settings 
ORDER BY setting_key;

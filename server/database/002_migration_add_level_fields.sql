-- Migration: Add Level Fields to Gemstones Table
-- Date: 2024
-- Description: Add 5 level fields for tracking gemstone supply chain

USE gemstone_db;

-- Add new level fields to existing gemstones table
ALTER TABLE gemstones 
ADD COLUMN rough_seller TEXT NULL COMMENT 'Data penjual rough (level 1)',
ADD COLUMN cutter TEXT NULL COMMENT 'Data tukang potong (level 2)',
ADD COLUMN polisher TEXT NULL COMMENT 'Data tukang poles (level 3)',
ADD COLUMN first_seller TEXT NULL COMMENT 'Data seller pertama (level 4)',
ADD COLUMN gemologist_lab TEXT NULL COMMENT 'Data lab resmi gemologist (level 5)';

-- Verify the changes
DESCRIBE gemstones;

-- Show sample data structure
SELECT 
    id,
    unique_id_number,
    name,
    rough_seller,
    cutter,
    polisher,
    first_seller,
    gemologist_lab
FROM gemstones 
LIMIT 5;

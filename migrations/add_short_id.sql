-- Migration: Add short_id column to memes table
-- Purpose: Enable short, clean URLs for memes (e.g., /m/dQw4w9Wg instead of /meme/uuid)
-- Date: 2026-02-07

-- Add short_id column with uniqueness constraint
ALTER TABLE memes 
ADD COLUMN IF NOT EXISTS short_id VARCHAR(12) UNIQUE;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_memes_short_id ON memes(short_id);

-- Optional: Generate short IDs for existing memes
-- You can run this after creating the generate_short_id function
-- UPDATE memes SET short_id = generate_random_short_id() WHERE short_id IS NULL;

-- Note: Short IDs will be generated in the application layer using nanoid
-- This ensures collision-resistant IDs with better entropy than SQL random functions

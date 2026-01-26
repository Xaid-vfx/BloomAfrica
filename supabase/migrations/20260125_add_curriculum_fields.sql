-- Migration: Add curriculum fields to TrainerProfiles
-- Created: 2026-01-25
-- Description: Add curriculum type, notes, and file URL fields for the new curriculum onboarding section

-- Add curriculum_type column to TrainerProfiles
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS curriculum_type TEXT
CHECK (curriculum_type IN ('own', 'prentis', 'custom', 'later'));

-- Add curriculum_notes column for custom curriculum requirements
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS curriculum_notes TEXT;

-- Add curriculum_file_url column for uploaded curriculum documents
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS curriculum_file_url TEXT;

-- Update current_section constraint to allow 8 sections
-- First drop the existing constraint, then add the new one
ALTER TABLE TrainerProfiles
DROP CONSTRAINT IF EXISTS trainerprofiles_current_section_check;

ALTER TABLE TrainerProfiles
ADD CONSTRAINT trainerprofiles_current_section_check
CHECK (current_section BETWEEN 1 AND 8);

-- Add completed_sections array for tracking which sections have been completed
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS completed_sections INT[];

-- Add registrant information fields
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS registrant_full_name TEXT,
ADD COLUMN IF NOT EXISTS registrant_position TEXT,
ADD COLUMN IF NOT EXISTS registrant_nin TEXT,
ADD COLUMN IF NOT EXISTS registrant_phone TEXT;

-- Add verification fields
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS cac_number TEXT,
ADD COLUMN IF NOT EXISTS tin_number TEXT,
ADD COLUMN IF NOT EXISTS business_registration_date DATE,
ADD COLUMN IF NOT EXISTS bvn_number TEXT;

-- Add request_prentis_teaching field for teaching team section
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS request_prentis_teaching BOOLEAN;

-- Add curriculum_amount to TrainerSubscriptions
ALTER TABLE TrainerSubscriptions
ADD COLUMN IF NOT EXISTS curriculum_amount INTEGER DEFAULT 0;

-- Comments for documentation
COMMENT ON COLUMN TrainerProfiles.curriculum_type IS 'Type of curriculum: own = upload their own, prentis = use ready-made, custom = request custom curriculum, later = decide after onboarding';
COMMENT ON COLUMN TrainerProfiles.curriculum_notes IS 'Notes/requirements for custom curriculum requests';
COMMENT ON COLUMN TrainerProfiles.curriculum_file_url IS 'URL to uploaded curriculum document in Supabase Storage';
COMMENT ON COLUMN TrainerProfiles.completed_sections IS 'Array of section numbers that have been completed';
COMMENT ON COLUMN TrainerSubscriptions.curriculum_amount IS 'Amount charged for Prentis curriculum (ready-made or custom)';

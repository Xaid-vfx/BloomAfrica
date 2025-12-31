-- Migration: Create TrainerProfiles and TrainerMentors tables
-- Created: 2025-01-31
-- Description: Tables for storing comprehensive trainer onboarding profile data

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TrainerProfiles Table
-- =====================================================
CREATE TABLE IF NOT EXISTS TrainerProfiles (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Completion tracking
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  current_section INT DEFAULT 1 CHECK (current_section BETWEEN 1 AND 5),

  -- Section 1: Business Identity
  business_name TEXT,
  trainer_category TEXT CHECK (trainer_category IN ('Individual/Artisan/Small Business', 'Company')),
  primary_industry TEXT,
  business_bio TEXT,
  years_in_operation INT CHECK (years_in_operation >= 0),

  -- Section 2: Verification & Trust (URLs to Supabase Storage)
  business_registration_url TEXT,
  owner_manager_id_url TEXT,
  professional_licenses_urls TEXT[], -- Array of URLs

  -- Section 3: Workspace & Facility
  physical_address TEXT,
  workspace_photo_urls TEXT[], -- Array of 3-5 image URLs
  facility_features TEXT[], -- Array of selected features
  team_size INT CHECK (team_size >= 0),

  -- Section 4: Program Intent & Certification
  prentis_accreditation BOOLEAN,
  alternative_certification TEXT,
  general_program_types TEXT[], -- Array: ['Hands-on', 'Technical', 'Business']
  avg_program_duration TEXT,
  typical_commitment TEXT CHECK (typical_commitment IN ('Full-time', 'Part-time')),
  outcome_intent TEXT[], -- Array: ['Direct Hire', 'Market Ready']
  support_provided TEXT[] -- Array: ['Stipend', 'Tools', 'Workspace', 'Housing']
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_trainer_profiles_user_id ON TrainerProfiles(user_id);
CREATE INDEX IF NOT EXISTS idx_trainer_profiles_completed ON TrainerProfiles(is_completed);
CREATE INDEX IF NOT EXISTS idx_trainer_profiles_trainer_category ON TrainerProfiles(trainer_category);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trainer_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trainer_profiles_updated_at
  BEFORE UPDATE ON TrainerProfiles
  FOR EACH ROW
  EXECUTE FUNCTION update_trainer_profiles_updated_at();

-- =====================================================
-- TrainerMentors Table
-- =====================================================
CREATE TABLE IF NOT EXISTS TrainerMentors (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES TrainerProfiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Mentor information
  mentor_name TEXT NOT NULL,
  years_experience INT CHECK (years_experience >= 0),
  specialization TEXT,
  professional_bio TEXT,
  photo_url TEXT,

  -- Ordering
  display_order INT DEFAULT 0
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_trainer_mentors_profile_id ON TrainerMentors(profile_id);
CREATE INDEX IF NOT EXISTS idx_trainer_mentors_display_order ON TrainerMentors(profile_id, display_order);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE TrainerProfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE TrainerMentors ENABLE ROW LEVEL SECURITY;

-- TrainerProfiles RLS Policies
CREATE POLICY "Users can view their own trainer profile"
  ON TrainerProfiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trainer profile"
  ON TrainerProfiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trainer profile"
  ON TrainerProfiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trainer profile"
  ON TrainerProfiles FOR DELETE
  USING (auth.uid() = user_id);

-- TrainerMentors RLS Policies
CREATE POLICY "Users can view mentors for their profile"
  ON TrainerMentors FOR SELECT
  USING (profile_id IN (
    SELECT id FROM TrainerProfiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert mentors for their profile"
  ON TrainerMentors FOR INSERT
  WITH CHECK (profile_id IN (
    SELECT id FROM TrainerProfiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update mentors for their profile"
  ON TrainerMentors FOR UPDATE
  USING (profile_id IN (
    SELECT id FROM TrainerProfiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete mentors for their profile"
  ON TrainerMentors FOR DELETE
  USING (profile_id IN (
    SELECT id FROM TrainerProfiles WHERE user_id = auth.uid()
  ));

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE TrainerProfiles IS 'Comprehensive trainer profile data collected during onboarding';
COMMENT ON TABLE TrainerMentors IS 'Teaching team members associated with a trainer profile';

COMMENT ON COLUMN TrainerProfiles.is_completed IS 'Determines if trainer can access other platform features';
COMMENT ON COLUMN TrainerProfiles.current_section IS 'Tracks progress for auto-save/resume functionality';
COMMENT ON COLUMN TrainerProfiles.trainer_category IS 'Type of trainer: Individual/Artisan/Small Business or Company';
COMMENT ON COLUMN TrainerProfiles.workspace_photo_urls IS 'Array of 3-5 workspace image URLs from Supabase Storage';
COMMENT ON COLUMN TrainerMentors.display_order IS 'Order in which mentors should be displayed';

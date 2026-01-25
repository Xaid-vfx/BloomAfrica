-- Migration: Add account_status to TrainerProfiles
-- Created: 2026-01-25
-- Description: Add account review status field for admin approval workflow

-- Add account_status column to TrainerProfiles
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'pending_review'
CHECK (account_status IN ('pending_review', 'approved', 'rejected'));

-- Add index for account status queries
CREATE INDEX IF NOT EXISTS idx_trainer_profiles_account_status ON TrainerProfiles(account_status);

-- Add admin notes field for review comments
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add reviewed_at and reviewed_by fields
ALTER TABLE TrainerProfiles
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by UUID;

-- Comments for documentation
COMMENT ON COLUMN TrainerProfiles.account_status IS 'pending_review = awaiting admin approval, approved = can post apprenticeships, rejected = needs profile updates';
COMMENT ON COLUMN TrainerProfiles.admin_notes IS 'Notes from admin during review process';
COMMENT ON COLUMN TrainerProfiles.reviewed_at IS 'Timestamp when account was reviewed';
COMMENT ON COLUMN TrainerProfiles.reviewed_by IS 'Admin user ID who reviewed the account';

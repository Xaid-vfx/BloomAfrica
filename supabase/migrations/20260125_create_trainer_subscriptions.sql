-- Migration: Create TrainerSubscriptions table
-- Created: 2026-01-25
-- Description: Table for storing trainer subscription pricing and payment status

-- =====================================================
-- TrainerSubscriptions Table
-- =====================================================
CREATE TABLE IF NOT EXISTS TrainerSubscriptions (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  profile_id UUID REFERENCES TrainerProfiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Pricing breakdown (stored for record)
  base_tier TEXT NOT NULL, -- 'Artisan' or 'Corporate'
  base_amount INTEGER NOT NULL,
  teaching_team_amount INTEGER DEFAULT 0,
  accreditation_amount INTEGER DEFAULT 0,
  direct_hire_amount INTEGER DEFAULT 0,
  industry_multiplier DECIMAL(3,2) DEFAULT 1.00,
  subtotal INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),

  -- Payment information
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,

  -- Metadata
  pricing_input JSONB -- Store original pricing input for reference
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_trainer_subscriptions_user_id ON TrainerSubscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_trainer_subscriptions_profile_id ON TrainerSubscriptions(profile_id);
CREATE INDEX IF NOT EXISTS idx_trainer_subscriptions_status ON TrainerSubscriptions(status);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_trainer_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trainer_subscriptions_updated_at
  BEFORE UPDATE ON TrainerSubscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_trainer_subscriptions_updated_at();

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE TrainerSubscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscription
CREATE POLICY "Users can view their own subscription"
  ON TrainerSubscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own subscription
CREATE POLICY "Users can insert their own subscription"
  ON TrainerSubscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscription
CREATE POLICY "Users can update their own subscription"
  ON TrainerSubscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON TABLE TrainerSubscriptions IS 'Trainer subscription pricing and payment status';
COMMENT ON COLUMN TrainerSubscriptions.status IS 'pending = not paid, active = paid and valid, expired = subscription ended, cancelled = manually cancelled';
COMMENT ON COLUMN TrainerSubscriptions.base_tier IS 'Artisan (Individual/Artisan/Small Business) or Corporate (Company)';
COMMENT ON COLUMN TrainerSubscriptions.pricing_input IS 'Original onboarding data used for pricing calculation';

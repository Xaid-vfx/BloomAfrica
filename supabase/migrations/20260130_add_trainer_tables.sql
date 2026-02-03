-- Migration: Add Missing Trainer Tables
-- Date: 2026-01-30
-- Description: Creates TrainerProfiles, TrainerSubscriptions, and TrainerMentors tables
--              for trainer onboarding, subscription management, and teaching team features.

-- ============================================================================
-- 1. TrainerProfiles Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."TrainerProfiles" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_id" uuid NOT NULL,

    -- Onboarding progress
    "current_section" smallint DEFAULT 1,
    "is_completed" boolean DEFAULT false,
    "completed_at" timestamp with time zone,
    "completed_sections" integer[] DEFAULT '{}',

    -- Section 1: Registrant Information
    "registrant_full_name" text,
    "registrant_position" text,
    "registrant_nin" text,
    "registrant_phone" text,

    -- Section 2: Trainer Category
    "trainer_category" text,

    -- Section 3: Business Identity
    "business_name" text,
    "primary_industry" text,
    "business_bio" text,
    "years_in_operation" integer,

    -- Section 4: Verification & Trust
    "cac_number" text,
    "tin_number" text,
    "business_registration_date" date,
    "bvn_number" text,
    "business_registration_url" text,
    "owner_manager_id_url" text,
    "professional_licenses_urls" text[],

    -- Section 5: Workspace & Facility
    "physical_address" text,
    "workspace_photo_urls" text[],
    "facility_features" text[],
    "team_size" integer,

    -- Section 6: Program Intent
    "prentis_accreditation" boolean,
    "alternative_certification" text,
    "general_program_types" text[],
    "avg_program_duration" text,
    "typical_commitment" text,
    "outcome_intent" text[],
    "support_provided" text[],

    -- Section 7: Curriculum
    "curriculum_type" text,
    "curriculum_notes" text,
    "curriculum_files" text[],
    "curriculum_file_url" text,

    -- Section 8: Teaching Team
    "request_prentis_teaching" boolean,

    -- Account status (for admin approval)
    "account_status" text DEFAULT 'pending_review',

    PRIMARY KEY ("id")
);

-- Add foreign key constraint (skip if exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerProfiles_user_id_fkey') THEN
        ALTER TABLE "public"."TrainerProfiles"
            ADD CONSTRAINT "TrainerProfiles_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

-- Create unique constraint on user_id (skip if exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerProfiles_user_id_key') THEN
        ALTER TABLE "public"."TrainerProfiles"
            ADD CONSTRAINT "TrainerProfiles_user_id_key" UNIQUE ("user_id");
    END IF;
END $$;

-- Set ownership and grants
ALTER TABLE "public"."TrainerProfiles" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."TrainerProfiles" TO "anon";
GRANT ALL ON TABLE "public"."TrainerProfiles" TO "authenticated";
GRANT ALL ON TABLE "public"."TrainerProfiles" TO "service_role";

-- Enable RLS
ALTER TABLE "public"."TrainerProfiles" ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own profile (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON "public"."TrainerProfiles";
CREATE POLICY "Users can view own profile" ON "public"."TrainerProfiles"
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON "public"."TrainerProfiles";
CREATE POLICY "Users can insert own profile" ON "public"."TrainerProfiles"
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON "public"."TrainerProfiles";
CREATE POLICY "Users can update own profile" ON "public"."TrainerProfiles"
    FOR UPDATE USING (auth.uid() = user_id);


-- ============================================================================
-- 2. TrainerSubscriptions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."TrainerSubscriptions" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "user_id" uuid NOT NULL,
    "profile_id" uuid,

    -- Subscription status
    "status" text DEFAULT 'pending',

    -- Pricing breakdown
    "base_tier" text,
    "base_amount" numeric DEFAULT 0,
    "teaching_team_amount" numeric DEFAULT 0,
    "accreditation_amount" numeric DEFAULT 0,
    "direct_hire_amount" numeric DEFAULT 0,
    "curriculum_amount" numeric DEFAULT 0,
    "industry_multiplier" numeric DEFAULT 1,
    "subtotal" numeric DEFAULT 0,
    "total_amount" numeric DEFAULT 0,

    -- Payment info
    "payment_reference" text,
    "paid_at" timestamp with time zone,
    "expires_at" timestamp with time zone,

    -- Pricing input (stored for reference)
    "pricing_input" jsonb,

    PRIMARY KEY ("id")
);

-- Add foreign key constraints (skip if exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerSubscriptions_user_id_fkey') THEN
        ALTER TABLE "public"."TrainerSubscriptions"
            ADD CONSTRAINT "TrainerSubscriptions_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerSubscriptions_profile_id_fkey') THEN
        ALTER TABLE "public"."TrainerSubscriptions"
            ADD CONSTRAINT "TrainerSubscriptions_profile_id_fkey"
            FOREIGN KEY ("profile_id") REFERENCES "public"."TrainerProfiles"("id")
            ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;
END $$;

-- Create unique constraint on user_id (skip if exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerSubscriptions_user_id_key') THEN
        ALTER TABLE "public"."TrainerSubscriptions"
            ADD CONSTRAINT "TrainerSubscriptions_user_id_key" UNIQUE ("user_id");
    END IF;
END $$;

-- Set ownership and grants
ALTER TABLE "public"."TrainerSubscriptions" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."TrainerSubscriptions" TO "anon";
GRANT ALL ON TABLE "public"."TrainerSubscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."TrainerSubscriptions" TO "service_role";

-- Enable RLS
ALTER TABLE "public"."TrainerSubscriptions" ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own subscription" ON "public"."TrainerSubscriptions";
CREATE POLICY "Users can view own subscription" ON "public"."TrainerSubscriptions"
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscription" ON "public"."TrainerSubscriptions";
CREATE POLICY "Users can insert own subscription" ON "public"."TrainerSubscriptions"
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscription" ON "public"."TrainerSubscriptions";
CREATE POLICY "Users can update own subscription" ON "public"."TrainerSubscriptions"
    FOR UPDATE USING (auth.uid() = user_id);


-- ============================================================================
-- 3. TrainerMentors Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."TrainerMentors" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "profile_id" uuid NOT NULL,

    -- Mentor details
    "mentor_name" text,
    "years_experience" integer,
    "specialization" text,
    "professional_bio" text,
    "photo_url" text,
    "display_order" integer DEFAULT 0,

    PRIMARY KEY ("id")
);

-- Add foreign key constraint (skip if exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerMentors_profile_id_fkey') THEN
        ALTER TABLE "public"."TrainerMentors"
            ADD CONSTRAINT "TrainerMentors_profile_id_fkey"
            FOREIGN KEY ("profile_id") REFERENCES "public"."TrainerProfiles"("id")
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

-- Set ownership and grants
ALTER TABLE "public"."TrainerMentors" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."TrainerMentors" TO "anon";
GRANT ALL ON TABLE "public"."TrainerMentors" TO "authenticated";
GRANT ALL ON TABLE "public"."TrainerMentors" TO "service_role";

-- Enable RLS
ALTER TABLE "public"."TrainerMentors" ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can access mentors linked to their profile (drop and recreate to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own mentors" ON "public"."TrainerMentors";
CREATE POLICY "Users can view own mentors" ON "public"."TrainerMentors"
    FOR SELECT USING (
        profile_id IN (SELECT id FROM "public"."TrainerProfiles" WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can insert own mentors" ON "public"."TrainerMentors";
CREATE POLICY "Users can insert own mentors" ON "public"."TrainerMentors"
    FOR INSERT WITH CHECK (
        profile_id IN (SELECT id FROM "public"."TrainerProfiles" WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can update own mentors" ON "public"."TrainerMentors";
CREATE POLICY "Users can update own mentors" ON "public"."TrainerMentors"
    FOR UPDATE USING (
        profile_id IN (SELECT id FROM "public"."TrainerProfiles" WHERE user_id = auth.uid())
    );

DROP POLICY IF EXISTS "Users can delete own mentors" ON "public"."TrainerMentors";
CREATE POLICY "Users can delete own mentors" ON "public"."TrainerMentors"
    FOR DELETE USING (
        profile_id IN (SELECT id FROM "public"."TrainerProfiles" WHERE user_id = auth.uid())
    );


-- ============================================================================
-- 4. Storage Bucket (if not exists)
-- ============================================================================

-- Note: Storage buckets are typically created via Supabase Dashboard
-- This will create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('TrainerProfiles', 'TrainerProfiles', true)
ON CONFLICT (id) DO NOTHING;

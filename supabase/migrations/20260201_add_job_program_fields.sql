-- Migration: Add Program Details Fields to Jobs Table
-- Date: 2026-02-01
-- Description: Adds program_type, outcome_intent, and support_provided columns to Jobs table
--              to align with trainer onboarding questionnaire fields.

-- Add program_type column (single value)
ALTER TABLE "public"."Jobs"
ADD COLUMN IF NOT EXISTS "program_type" text;

-- Add outcome_intent column (array of values)
ALTER TABLE "public"."Jobs"
ADD COLUMN IF NOT EXISTS "outcome_intent" text[];

-- Add support_provided column (array of values)
ALTER TABLE "public"."Jobs"
ADD COLUMN IF NOT EXISTS "support_provided" text[];

-- Add comments for documentation
COMMENT ON COLUMN "public"."Jobs"."program_type" IS 'Type of training program: Hands-on Craft/Trade, Technical/Engineering, or Business & Operations';
COMMENT ON COLUMN "public"."Jobs"."outcome_intent" IS 'Expected outcomes after completion: Direct Hire and/or Market Ready';
COMMENT ON COLUMN "public"."Jobs"."support_provided" IS 'Additional support provided: Monthly Stipend, Tools and Equipment, Workspace/Studio Access, Housing/Accommodation';

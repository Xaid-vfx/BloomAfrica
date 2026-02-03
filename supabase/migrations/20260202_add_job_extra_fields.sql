-- Add new fields to Jobs table for enhanced apprenticeship postings

-- Program classification
ALTER TABLE "public"."Jobs" ADD COLUMN IF NOT EXISTS "program_type" text;

-- What happens after completion (can be multiple)
ALTER TABLE "public"."Jobs" ADD COLUMN IF NOT EXISTS "outcome_intent" text[];

-- Additional support provided (can be multiple)
ALTER TABLE "public"."Jobs" ADD COLUMN IF NOT EXISTS "support_provided" text[];

-- Facility features available (can be multiple)
ALTER TABLE "public"."Jobs" ADD COLUMN IF NOT EXISTS "facility_features" text[];

-- Link to curriculum
ALTER TABLE "public"."Jobs" ADD COLUMN IF NOT EXISTS "curriculum_id" uuid;
ALTER TABLE "public"."Jobs" ADD COLUMN IF NOT EXISTS "curriculum_name" text;

-- Add foreign key constraint for curriculum (if PrentisCurriculums table exists)
-- ALTER TABLE "public"."Jobs" ADD CONSTRAINT "Jobs_curriculum_id_fkey"
--     FOREIGN KEY ("curriculum_id") REFERENCES "public"."PrentisCurriculums"("id")
--     ON UPDATE CASCADE ON DELETE SET NULL;

COMMENT ON COLUMN "public"."Jobs"."program_type" IS 'Type of program: Hands-on Craft/Trade, Technical/Engineering, Business & Operations';
COMMENT ON COLUMN "public"."Jobs"."outcome_intent" IS 'What happens after completion: Direct Hire, Market Ready';
COMMENT ON COLUMN "public"."Jobs"."support_provided" IS 'Additional support: Monthly Stipend, Tools and Equipment, Workspace/Studio Access, Housing/Accommodation';
COMMENT ON COLUMN "public"."Jobs"."facility_features" IS 'Available facilities: On-site tools, Safety gear provided, Internet access, etc.';
COMMENT ON COLUMN "public"."Jobs"."curriculum_id" IS 'Reference to the curriculum used for this apprenticeship';
COMMENT ON COLUMN "public"."Jobs"."curriculum_name" IS 'Denormalized curriculum name for display';

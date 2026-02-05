-- Migration: Create Curriculum Tables
-- Date: 2026-02-02
-- Description: Creates PrentisCurriculums (master catalog), TrainerCurriculums (shortlist),
--              and adds curriculum fields to Jobs table.

-- ============================================================================
-- 1. PrentisCurriculums Table (Master Catalog)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."PrentisCurriculums" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,

    -- Basic Info
    "name" text NOT NULL,
    "slug" text NOT NULL,
    "description" text,
    "short_description" text,

    -- Industry Matching
    "primary_industry" text NOT NULL,
    "secondary_industries" text[] DEFAULT '{}',

    -- Program Details
    "program_type" text, -- 'Hands-on Craft/Trade', 'Technical/Engineering', 'Business & Operations'
    "duration_weeks" integer,
    "skill_level" text DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'

    -- Learning Content
    "learning_outcomes" text[] DEFAULT '{}',

    -- Access Control
    "required_subscription_tier" text, -- 'Artisan', 'Corporate', or null for all tiers

    -- Status
    "is_active" boolean DEFAULT true,
    "is_featured" boolean DEFAULT false,

    PRIMARY KEY ("id")
);

-- Create unique constraint on slug
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'PrentisCurriculums_slug_key') THEN
        ALTER TABLE "public"."PrentisCurriculums"
            ADD CONSTRAINT "PrentisCurriculums_slug_key" UNIQUE ("slug");
    END IF;
END $$;

-- Create index on primary_industry for faster queries
CREATE INDEX IF NOT EXISTS "idx_prentiscurriculums_primary_industry" ON "public"."PrentisCurriculums" ("primary_industry");

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS "idx_prentiscurriculums_is_active" ON "public"."PrentisCurriculums" ("is_active");

-- Set ownership and grants
ALTER TABLE "public"."PrentisCurriculums" OWNER TO "postgres";

GRANT SELECT ON TABLE "public"."PrentisCurriculums" TO "anon";
GRANT SELECT ON TABLE "public"."PrentisCurriculums" TO "authenticated";
GRANT ALL ON TABLE "public"."PrentisCurriculums" TO "service_role";

-- Enable RLS
ALTER TABLE "public"."PrentisCurriculums" ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read active curriculums
DROP POLICY IF EXISTS "Anyone can view active curriculums" ON "public"."PrentisCurriculums";
CREATE POLICY "Anyone can view active curriculums" ON "public"."PrentisCurriculums"
    FOR SELECT USING (is_active = true);


-- ============================================================================
-- 2. TrainerCurriculums Table (Shortlist)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."TrainerCurriculums" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,

    -- Relationships
    "user_id" uuid NOT NULL,
    "profile_id" uuid,
    "curriculum_id" uuid NOT NULL,

    -- Status
    "is_active" boolean DEFAULT true,
    "added_at" timestamp with time zone DEFAULT now() NOT NULL,

    -- Optional notes
    "notes" text,

    PRIMARY KEY ("id")
);

-- Add foreign key constraints
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerCurriculums_user_id_fkey') THEN
        ALTER TABLE "public"."TrainerCurriculums"
            ADD CONSTRAINT "TrainerCurriculums_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id")
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerCurriculums_profile_id_fkey') THEN
        ALTER TABLE "public"."TrainerCurriculums"
            ADD CONSTRAINT "TrainerCurriculums_profile_id_fkey"
            FOREIGN KEY ("profile_id") REFERENCES "public"."TrainerProfiles"("id")
            ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerCurriculums_curriculum_id_fkey') THEN
        ALTER TABLE "public"."TrainerCurriculums"
            ADD CONSTRAINT "TrainerCurriculums_curriculum_id_fkey"
            FOREIGN KEY ("curriculum_id") REFERENCES "public"."PrentisCurriculums"("id")
            ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;

-- Create unique constraint on (user_id, curriculum_id)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TrainerCurriculums_user_curriculum_key') THEN
        ALTER TABLE "public"."TrainerCurriculums"
            ADD CONSTRAINT "TrainerCurriculums_user_curriculum_key" UNIQUE ("user_id", "curriculum_id");
    END IF;
END $$;

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS "idx_trainercurriculums_user_id" ON "public"."TrainerCurriculums" ("user_id");

-- Set ownership and grants
ALTER TABLE "public"."TrainerCurriculums" OWNER TO "postgres";

GRANT ALL ON TABLE "public"."TrainerCurriculums" TO "anon";
GRANT ALL ON TABLE "public"."TrainerCurriculums" TO "authenticated";
GRANT ALL ON TABLE "public"."TrainerCurriculums" TO "service_role";

-- Enable RLS
ALTER TABLE "public"."TrainerCurriculums" ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own shortlist
DROP POLICY IF EXISTS "Users can view own curriculum shortlist" ON "public"."TrainerCurriculums";
CREATE POLICY "Users can view own curriculum shortlist" ON "public"."TrainerCurriculums"
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add to own shortlist" ON "public"."TrainerCurriculums";
CREATE POLICY "Users can add to own shortlist" ON "public"."TrainerCurriculums"
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own shortlist" ON "public"."TrainerCurriculums";
CREATE POLICY "Users can update own shortlist" ON "public"."TrainerCurriculums"
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own shortlist" ON "public"."TrainerCurriculums";
CREATE POLICY "Users can delete from own shortlist" ON "public"."TrainerCurriculums"
    FOR DELETE USING (auth.uid() = user_id);


-- ============================================================================
-- 3. Add Curriculum Fields to Jobs Table
-- ============================================================================

-- Add curriculum_id column (foreign key to PrentisCurriculums)
ALTER TABLE "public"."Jobs"
ADD COLUMN IF NOT EXISTS "curriculum_id" uuid;

-- Add curriculum_name column (denormalized for display)
ALTER TABLE "public"."Jobs"
ADD COLUMN IF NOT EXISTS "curriculum_name" text;

-- Add foreign key constraint for curriculum_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Jobs_curriculum_id_fkey') THEN
        ALTER TABLE "public"."Jobs"
            ADD CONSTRAINT "Jobs_curriculum_id_fkey"
            FOREIGN KEY ("curriculum_id") REFERENCES "public"."PrentisCurriculums"("id")
            ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN "public"."Jobs"."curriculum_id" IS 'Reference to the Prentis curriculum used for this apprenticeship';
COMMENT ON COLUMN "public"."Jobs"."curriculum_name" IS 'Denormalized curriculum name for display purposes';


-- ============================================================================
-- 4. Seed Data: Prentis Curriculums
-- ============================================================================

INSERT INTO "public"."PrentisCurriculums"
    ("name", "slug", "description", "short_description", "primary_industry", "secondary_industries", "program_type", "duration_weeks", "skill_level", "learning_outcomes", "required_subscription_tier", "is_active", "is_featured")
VALUES
    -- Fashion & Textiles (2)
    (
        'Fashion Design Fundamentals',
        'fashion-design-fundamentals',
        'A comprehensive introduction to fashion design covering sketching, pattern making, fabric selection, and garment construction. Perfect for aspiring fashion designers and tailors.',
        'Learn the essentials of fashion design from sketching to garment creation',
        'Fashion & Textiles',
        '{"Creative Arts"}',
        'Hands-on Craft/Trade',
        12,
        'beginner',
        '{"Create fashion sketches and technical drawings", "Develop basic patterns for various garments", "Select appropriate fabrics for different designs", "Construct complete garments from scratch", "Understand fashion industry standards"}',
        NULL,
        true,
        true
    ),
    (
        'Advanced Tailoring & Bespoke',
        'advanced-tailoring-bespoke',
        'Master the art of bespoke tailoring with advanced techniques in suit construction, alterations, and custom fitting. For experienced tailors ready to elevate their craft.',
        'Master bespoke tailoring and custom suit construction',
        'Fashion & Textiles',
        '{}',
        'Hands-on Craft/Trade',
        24,
        'advanced',
        '{"Construct custom-fitted suits and jackets", "Master hand-stitching techniques", "Perform professional alterations", "Create bespoke patterns from measurements", "Manage client consultations and fittings"}',
        'Corporate',
        true,
        false
    ),

    -- Automotive (2)
    (
        'Automotive Mechanics Essentials',
        'automotive-mechanics-essentials',
        'Learn fundamental automotive repair and maintenance skills including engine diagnostics, brake systems, and routine servicing. Industry-standard training for aspiring mechanics.',
        'Foundation course in automotive repair and maintenance',
        'Automotive',
        '{"Technology & Electronics"}',
        'Technical/Engineering',
        16,
        'beginner',
        '{"Diagnose common engine problems", "Perform brake system repairs", "Execute routine maintenance procedures", "Use diagnostic tools and equipment", "Understand vehicle safety systems"}',
        NULL,
        true,
        true
    ),
    (
        'Electric Vehicle Technology',
        'electric-vehicle-technology',
        'Specialized training in electric and hybrid vehicle systems, battery technology, and high-voltage safety. Prepare for the future of automotive technology.',
        'Specialize in electric and hybrid vehicle systems',
        'Automotive',
        '{"Technology & Electronics"}',
        'Technical/Engineering',
        20,
        'intermediate',
        '{"Service electric vehicle powertrains", "Handle high-voltage systems safely", "Diagnose EV-specific issues", "Maintain battery management systems", "Understand regenerative braking systems"}',
        'Corporate',
        true,
        true
    ),

    -- Food & Beverage (2)
    (
        'Culinary Arts Foundation',
        'culinary-arts-foundation',
        'Comprehensive culinary training covering cooking techniques, food safety, menu planning, and kitchen management. Build a solid foundation for a career in food service.',
        'Build essential culinary skills and kitchen expertise',
        'Food & Beverage',
        '{"Hospitality"}',
        'Hands-on Craft/Trade',
        16,
        'beginner',
        '{"Master fundamental cooking techniques", "Ensure food safety and hygiene standards", "Plan and cost menus effectively", "Manage kitchen operations", "Present dishes professionally"}',
        NULL,
        true,
        true
    ),
    (
        'Pastry & Baking Professional',
        'pastry-baking-professional',
        'Specialized training in pastry arts, bread making, cake decoration, and dessert creation. Perfect for aspiring pastry chefs and bakery entrepreneurs.',
        'Master the art of pastry and professional baking',
        'Food & Beverage',
        '{}',
        'Hands-on Craft/Trade',
        14,
        'intermediate',
        '{"Create artisan breads and pastries", "Design and decorate cakes", "Prepare classic and modern desserts", "Manage bakery production", "Develop signature recipes"}',
        NULL,
        true,
        false
    ),

    -- Beauty & Cosmetics (2)
    (
        'Professional Makeup Artistry',
        'professional-makeup-artistry',
        'Complete makeup artistry training from everyday looks to bridal and special effects. Learn color theory, skin preparation, and professional application techniques.',
        'Become a certified makeup artist with professional techniques',
        'Beauty & Cosmetics',
        '{"Creative Arts"}',
        'Hands-on Craft/Trade',
        10,
        'beginner',
        '{"Apply makeup for various occasions", "Understand skin types and preparation", "Master color theory for different skin tones", "Create bridal and editorial looks", "Build a professional makeup kit"}',
        NULL,
        true,
        true
    ),
    (
        'Hair Styling & Treatment',
        'hair-styling-treatment',
        'Comprehensive hair styling training including cutting, coloring, chemical treatments, and hair care. Prepare for salon work or entrepreneurship.',
        'Master hair cutting, coloring, and professional styling',
        'Beauty & Cosmetics',
        '{}',
        'Hands-on Craft/Trade',
        16,
        'beginner',
        '{"Execute precision haircuts", "Apply color and highlights safely", "Perform chemical treatments", "Style hair for different occasions", "Recommend hair care solutions"}',
        NULL,
        true,
        true
    ),

    -- Technology & Electronics (2)
    (
        'Electronics Repair Technician',
        'electronics-repair-technician',
        'Learn to diagnose and repair electronic devices including smartphones, computers, and home appliances. Covers soldering, circuit analysis, and component replacement.',
        'Diagnose and repair electronic devices professionally',
        'Technology & Electronics',
        '{}',
        'Technical/Engineering',
        12,
        'beginner',
        '{"Diagnose electronic faults systematically", "Perform component-level repairs", "Use diagnostic and testing equipment", "Solder and desolder components safely", "Handle customer devices professionally"}',
        NULL,
        true,
        true
    ),
    (
        'Solar Installation & Maintenance',
        'solar-installation-maintenance',
        'Specialized training in solar panel installation, inverter setup, and system maintenance. Join the growing renewable energy sector.',
        'Install and maintain solar energy systems',
        'Technology & Electronics',
        '{"Hardware & Construction"}',
        'Technical/Engineering',
        14,
        'intermediate',
        '{"Design basic solar power systems", "Install solar panels safely", "Configure inverters and batteries", "Troubleshoot system issues", "Maintain solar installations"}',
        NULL,
        true,
        true
    ),

    -- Woodwork & Furniture (1)
    (
        'Furniture Making & Carpentry',
        'furniture-making-carpentry',
        'Traditional and modern woodworking techniques for creating furniture, cabinets, and decorative items. Learn joinery, finishing, and workshop management.',
        'Create quality furniture with professional techniques',
        'Woodwork & Furniture',
        '{"Creative Arts"}',
        'Hands-on Craft/Trade',
        20,
        'beginner',
        '{"Use hand and power tools safely", "Execute various joinery techniques", "Construct furniture from plans", "Apply professional finishes", "Manage workshop operations"}',
        NULL,
        true,
        true
    ),

    -- Hardware & Construction (2)
    (
        'Plumbing Fundamentals',
        'plumbing-fundamentals',
        'Essential plumbing skills including pipe installation, fixture mounting, and repair techniques. Covers residential and light commercial applications.',
        'Master essential plumbing installation and repair',
        'Hardware & Construction',
        '{}',
        'Technical/Engineering',
        14,
        'beginner',
        '{"Install various pipe systems", "Mount and connect fixtures", "Diagnose and repair leaks", "Read plumbing blueprints", "Ensure code compliance"}',
        NULL,
        true,
        false
    ),
    (
        'Electrical Installation',
        'electrical-installation',
        'Comprehensive electrical training covering wiring, circuit installation, and safety compliance. Prepare for work in residential and commercial settings.',
        'Learn professional electrical installation techniques',
        'Hardware & Construction',
        '{"Technology & Electronics"}',
        'Technical/Engineering',
        16,
        'beginner',
        '{"Install electrical circuits safely", "Read and interpret wiring diagrams", "Test and troubleshoot electrical systems", "Ensure compliance with electrical codes", "Install fixtures and outlets"}',
        NULL,
        true,
        true
    ),

    -- Metalwork & Fabrication (1)
    (
        'Welding & Metal Fabrication',
        'welding-metal-fabrication',
        'Hands-on welding training covering MIG, TIG, and stick welding techniques. Learn metal cutting, shaping, and fabrication for various industries.',
        'Master welding and metal fabrication techniques',
        'Metalwork & Fabrication',
        '{"Hardware & Construction", "Automotive"}',
        'Hands-on Craft/Trade',
        16,
        'beginner',
        '{"Perform MIG and TIG welding", "Cut and shape metal accurately", "Read fabrication drawings", "Ensure weld quality and safety", "Operate welding equipment properly"}',
        NULL,
        true,
        true
    ),

    -- Agriculture (2)
    (
        'Sustainable Farming Practices',
        'sustainable-farming-practices',
        'Learn modern sustainable agriculture techniques including organic farming, crop rotation, and soil management. Ideal for aspiring farmers and agricultural entrepreneurs.',
        'Master sustainable agriculture and farming techniques',
        'Agriculture',
        '{}',
        'Hands-on Craft/Trade',
        12,
        'beginner',
        '{"Implement organic farming methods", "Manage soil health naturally", "Plan crop rotation systems", "Control pests sustainably", "Manage water resources efficiently"}',
        NULL,
        true,
        true
    ),
    (
        'Poultry & Livestock Management',
        'poultry-livestock-management',
        'Comprehensive training in raising poultry and livestock including breeding, feeding, health management, and business operations.',
        'Learn professional poultry and livestock farming',
        'Agriculture',
        '{}',
        'Business & Operations',
        14,
        'beginner',
        '{"Manage poultry production cycles", "Ensure animal health and welfare", "Optimize feeding programs", "Handle breeding operations", "Run farm business operations"}',
        NULL,
        true,
        false
    )
ON CONFLICT (slug) DO NOTHING;

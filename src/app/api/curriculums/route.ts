import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
    checkCurriculumEligibility,
    type Curriculum,
    type TrainerProfile,
    type TrainerSubscription,
} from '@/lib/curriculum/checkEligibility';

/**
 * GET /api/curriculums
 * Browse eligible curriculums for the authenticated trainer
 * Returns curriculums filtered by trainer's industry with eligibility info
 */
export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get trainer profile
        const { data: trainerProfile, error: profileError } = await supabase
            .from('TrainerProfiles')
            .select('id, user_id, primary_industry, business_name')
            .eq('user_id', user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching trainer profile:', profileError);
            return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
        }

        // Get trainer subscription
        const { data: subscription, error: subError } = await supabase
            .from('TrainerSubscriptions')
            .select('id, user_id, base_tier, status')
            .eq('user_id', user.id)
            .single();

        if (subError && subError.code !== 'PGRST116') {
            console.error('Error fetching subscription:', subError);
        }

        // Get trainer's existing shortlist for marking
        const { data: shortlistedIds } = await supabase
            .from('TrainerCurriculums')
            .select('curriculum_id')
            .eq('user_id', user.id)
            .eq('is_active', true);

        const shortlistSet = new Set((shortlistedIds || []).map((item) => item.curriculum_id));

        // Get all active curriculums
        const { data: curriculums, error: curriculumError } = await supabase
            .from('PrentisCurriculums')
            .select('*')
            .eq('is_active', true)
            .order('is_featured', { ascending: false })
            .order('name');

        if (curriculumError) {
            console.error('Error fetching curriculums:', curriculumError);
            return NextResponse.json({ error: 'Failed to fetch curriculums' }, { status: 500 });
        }

        // Process curriculums with eligibility check
        const processedCurriculums = (curriculums || []).map((curriculum: Curriculum) => {
            const eligibility = checkCurriculumEligibility(
                curriculum,
                trainerProfile as TrainerProfile | null,
                subscription as TrainerSubscription | null
            );

            return {
                ...curriculum,
                isInShortlist: shortlistSet.has(curriculum.id),
                eligibility,
            };
        });

        // Filter to only show curriculums matching trainer's industry (primary or secondary)
        const trainerIndustry = trainerProfile?.primary_industry;
        const filteredCurriculums = trainerIndustry
            ? processedCurriculums.filter(
                  (c) =>
                      c.primary_industry === trainerIndustry ||
                      (c.secondary_industries || []).includes(trainerIndustry)
              )
            : processedCurriculums;

        return NextResponse.json({
            curriculums: filteredCurriculums,
            trainerIndustry: trainerProfile?.primary_industry || null,
            subscriptionTier: subscription?.base_tier || null,
        });
    } catch (error) {
        console.error('Error in curriculums route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

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
 * GET /api/curriculums/shortlist
 * Get trainer's shortlisted curriculums (joined with curriculum details)
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

        // Get trainer's shortlisted curriculums with full curriculum details
        const { data: shortlist, error: shortlistError } = await supabase
            .from('TrainerCurriculums')
            .select(`
                id,
                curriculum_id,
                added_at,
                notes,
                is_active,
                curriculum:PrentisCurriculums (
                    id,
                    name,
                    slug,
                    description,
                    short_description,
                    primary_industry,
                    secondary_industries,
                    program_type,
                    duration_weeks,
                    skill_level,
                    learning_outcomes,
                    required_subscription_tier,
                    is_featured
                )
            `)
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('added_at', { ascending: false });

        if (shortlistError) {
            console.error('Error fetching shortlist:', shortlistError);
            return NextResponse.json({ error: 'Failed to fetch shortlist' }, { status: 500 });
        }

        // Flatten the response to include curriculum details at top level
        const curriculums = (shortlist || [])
            .filter((item) => item.curriculum) // Filter out any orphaned entries
            .map((item) => ({
                shortlistId: item.id,
                addedAt: item.added_at,
                notes: item.notes,
                ...(item.curriculum as object),
            }));

        return NextResponse.json({ curriculums });
    } catch (error) {
        console.error('Error in shortlist route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/curriculums/shortlist
 * Add a curriculum to trainer's shortlist
 */
export async function POST(request: Request) {
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

        const { curriculum_id } = await request.json();

        if (!curriculum_id) {
            return NextResponse.json({ error: 'curriculum_id is required' }, { status: 400 });
        }

        // Get curriculum details
        const { data: curriculum, error: curriculumError } = await supabase
            .from('PrentisCurriculums')
            .select('*')
            .eq('id', curriculum_id)
            .eq('is_active', true)
            .single();

        if (curriculumError || !curriculum) {
            return NextResponse.json({ error: 'Curriculum not found' }, { status: 404 });
        }

        // Get trainer profile for eligibility check
        const { data: trainerProfile } = await supabase
            .from('TrainerProfiles')
            .select('id, user_id, primary_industry, business_name')
            .eq('user_id', user.id)
            .single();

        // Get subscription for eligibility check
        const { data: subscription } = await supabase
            .from('TrainerSubscriptions')
            .select('id, user_id, base_tier, status')
            .eq('user_id', user.id)
            .single();

        // Check eligibility
        const eligibility = checkCurriculumEligibility(
            curriculum as Curriculum,
            trainerProfile as TrainerProfile | null,
            subscription as TrainerSubscription | null
        );

        if (!eligibility.isEligible) {
            return NextResponse.json(
                {
                    error: 'Not eligible for this curriculum',
                    reason: eligibility.reason,
                    issues: eligibility.issues,
                },
                { status: 403 }
            );
        }

        // Check if already in shortlist
        const { data: existing } = await supabase
            .from('TrainerCurriculums')
            .select('id, is_active')
            .eq('user_id', user.id)
            .eq('curriculum_id', curriculum_id)
            .single();

        if (existing) {
            if (existing.is_active) {
                return NextResponse.json(
                    { error: 'Curriculum already in shortlist' },
                    { status: 409 }
                );
            }

            // Re-activate if previously removed
            const { error: updateError } = await supabase
                .from('TrainerCurriculums')
                .update({ is_active: true, added_at: new Date().toISOString() })
                .eq('id', existing.id);

            if (updateError) {
                console.error('Error re-activating shortlist entry:', updateError);
                return NextResponse.json(
                    { error: 'Failed to add to shortlist' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                success: true,
                message: 'Curriculum added to shortlist',
                shortlistId: existing.id,
            });
        }

        // Add to shortlist
        const { data: newEntry, error: insertError } = await supabase
            .from('TrainerCurriculums')
            .insert({
                user_id: user.id,
                profile_id: trainerProfile?.id || null,
                curriculum_id: curriculum_id,
                is_active: true,
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('Error adding to shortlist:', insertError);
            return NextResponse.json({ error: 'Failed to add to shortlist' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Curriculum added to shortlist',
            shortlistId: newEntry.id,
        });
    } catch (error) {
        console.error('Error in shortlist POST route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

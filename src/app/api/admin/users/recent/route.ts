import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '500', 10);

        // Fetch seekers (learners)
        const { data: seekers, error: seekersError } = await supabaseAdmin
            .from('Seekers')
            .select('unique_id, name, email, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (seekersError) {
            console.error('Error fetching seekers:', seekersError);
            return NextResponse.json({ error: seekersError.message }, { status: 500 });
        }

        // Fetch recruiters (trainers)
        const { data: recruiters, error: recruitersError } = await supabaseAdmin
            .from('Recruiters')
            .select('uniqueid, name, email, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (recruitersError) {
            console.error('Error fetching recruiters:', recruitersError);
            return NextResponse.json({ error: recruitersError.message }, { status: 500 });
        }

        // Fetch TrainerProfiles to get names for trainers without names in Recruiters table
        const recruiterIds = (recruiters || []).map(r => r.uniqueid);
        const { data: trainerProfiles } = await supabaseAdmin
            .from('TrainerProfiles')
            .select('user_id, registrant_full_name')
            .in('user_id', recruiterIds);

        // Create a map of user_id to registrant_full_name
        const profileNameMap = new Map<string, string>();
        (trainerProfiles || []).forEach(p => {
            if (p.registrant_full_name) {
                profileNameMap.set(p.user_id, p.registrant_full_name);
            }
        });

        // Normalize and combine users
        const normalizedSeekers = (seekers || []).map(s => ({
            id: s.unique_id,
            name: s.name,
            email: s.email,
            type: 'learner' as const,
            created_at: s.created_at
        }));

        const normalizedRecruiters = (recruiters || []).map(r => {
            // Get name from TrainerProfiles if not in Recruiters table
            const name = r.name || profileNameMap.get(r.uniqueid) || null;
            return {
                id: r.uniqueid,
                name,
                email: r.email,
                type: 'trainer' as const,
                created_at: r.created_at
            };
        });

        // Combine and sort by created_at desc
        const allUsers = [...normalizedSeekers, ...normalizedRecruiters]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, limit);

        return NextResponse.json({ users: allUsers });
    } catch (error) {
        console.error('Error in recent users route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

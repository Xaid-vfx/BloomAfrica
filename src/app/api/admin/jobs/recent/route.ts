import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '500');

        const supabase = createRouteHandlerClient({ cookies });

        const { data: jobs, error } = await supabase
            .from('Jobs')
            .select(`
                uid,
                title,
                company_name,
                location,
                city,
                state,
                country,
                type,
                category,
                created_at,
                deadline,
                recruiter,
                isVerified
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching jobs:', error);
            return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
        }

        return NextResponse.json({ jobs: jobs || [] });
    } catch (error) {
        console.error('Error in recent jobs route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

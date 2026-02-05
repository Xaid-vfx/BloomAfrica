import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/curriculums
 * Fetch all curriculums for admin dashboard
 */
export async function GET() {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // Get all curriculums (both active and inactive)
        const { data: curriculums, error } = await supabase
            .from('PrentisCurriculums')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching curriculums:', error);
            return NextResponse.json({ error: 'Failed to fetch curriculums' }, { status: 500 });
        }

        return NextResponse.json({ curriculums: curriculums || [] });
    } catch (error) {
        console.error('Error in admin curriculums route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

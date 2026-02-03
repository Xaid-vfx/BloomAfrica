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

export async function GET() {
    try {
        // Fetch completed profiles that need review (pending_review or null status)
        const { data, error } = await supabaseAdmin
            .from('TrainerProfiles')
            .select('id, user_id, business_name, registrant_full_name, trainer_category, primary_industry, created_at, account_status')
            .eq('is_completed', true)
            .or('account_status.eq.pending_review,account_status.is.null')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching pending trainers:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ trainers: data || [] });
    } catch (error) {
        console.error('Error in pending trainers route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

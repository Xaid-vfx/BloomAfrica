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

export async function POST(request: Request) {
    try {
        const { profileId, status } = await request.json();

        if (!profileId || !status) {
            return NextResponse.json({ error: 'profileId and status are required' }, { status: 400 });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'status must be "approved" or "rejected"' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('TrainerProfiles')
            .update({ account_status: status })
            .eq('id', profileId)
            .select()
            .single();

        if (error) {
            console.error('Error updating trainer status:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, trainer: data });
    } catch (error) {
        console.error('Error in update-status route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

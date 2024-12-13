import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { jobId, seekerId } = await request.json();
        const supabase = createRouteHandlerClient({ cookies });

        const { data, error } = await supabase
            .from('jobpayments')
            .select('status')
            .eq('job_id', jobId)
            .eq('seeker_id', seekerId)
            .eq('status', 'success')
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return NextResponse.json({
            status: data ? data.status : null
        });
    } catch (error) {
        console.error('Error checking payment status:', error);
        return NextResponse.json({
            status: null,
            error: error instanceof Error ? error.message : 'An error occurred'
        }, { status: 500 });
    }
}
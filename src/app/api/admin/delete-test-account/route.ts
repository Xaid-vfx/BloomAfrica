import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with service role
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
        const { id, email, type } = await request.json();

        // Delete from profile tables
        if (type === 'seeker') {
            await supabaseAdmin.from('Education').delete().eq('unique_id', id);
            await supabaseAdmin.from('Seekers').delete().eq('unique_id', id);
        } else {
            await supabaseAdmin.from('CompanyInfo').delete().eq('unique_id', id);
            await supabaseAdmin.from('Recruiters').delete().eq('uniqueid', id);
        }

        // Delete from users table
        await supabaseAdmin.from('users').delete().eq('email', email);

        // Delete from test_accounts table
        const { error } = await supabaseAdmin
            .from('test_accounts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting test account:', error);
            return new NextResponse(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in delete-test-account:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 
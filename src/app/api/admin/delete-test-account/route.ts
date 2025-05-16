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

        // First, get the auth user id using the email
        const { data: userData, error: userError } = await supabaseAdmin
            .auth
            .admin
            .listUsers();

        if (userError) {
            console.error('Error fetching users:', userError);
            throw userError;
        }

        const authUser = userData.users.find(user => user.email === email);
        
        if (!authUser) {
            console.error('Auth user not found for email:', email);
            throw new Error('Auth user not found');
        }

        // Delete from auth.users table
        const { error: deleteAuthError } = await supabaseAdmin
            .auth
            .admin
            .deleteUser(authUser.id);

        if (deleteAuthError) {
            console.error('Error deleting auth user:', deleteAuthError);
            throw deleteAuthError;
        }

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
            throw error;
        }

        return new NextResponse(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error in delete-test-account:', error);
        return new NextResponse(JSON.stringify({ 
            error: error.message || 'Internal server error',
            details: error.details || ''
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 
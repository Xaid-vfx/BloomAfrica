import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with service role key
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Make sure to add SUPABASE_SERVICE_ROLE_KEY to your .env.local
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { email, password, accountType } = await request.json();

        // Create user with email confirmed
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                name: accountType === 'seeker' ? 'Test User' : 'Test Recruiter',
                type: accountType
            }
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ user: data.user });
    } catch (error: any) {
        console.error('Error creating test account:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create account' },
            { status: 500 }
        );
    }
} 
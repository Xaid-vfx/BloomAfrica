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
        const { userId, userType } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        if (!userType || !['learner', 'trainer'].includes(userType)) {
            return NextResponse.json({ error: 'userType must be "learner" or "trainer"' }, { status: 400 });
        }

        // Delete from tables with foreign key constraints to auth.users first
        // These tables reference auth.users directly
        const tablesToClean = [
            { table: 'TermsOfService', column: 'user_id' },
            { table: 'PrivacyPolicy', column: 'user_id' },
            { table: 'Agreements', column: 'user_id' },
            { table: 'messages', column: 'sender_id' },
            { table: 'messages', column: 'receiver_id' },
            { table: 'RecruiterBankDetails', column: 'recruiter_id' },
        ];

        for (const { table, column } of tablesToClean) {
            const { error } = await supabaseAdmin
                .from(table)
                .delete()
                .eq(column, userId);

            if (error) {
                console.error(`Error deleting from ${table}:`, error);
            }
        }

        // Delete from the appropriate profile table (foreign key constraints)
        if (userType === 'learner') {
            // Delete seeker-related data first
            const seekerTables = ['Applicants', 'Saved', 'Education', 'Experience'];
            for (const table of seekerTables) {
                const column = table === 'Applicants' || table === 'Saved' ? 'seeker_id' : 'unique_id';
                const { error } = await supabaseAdmin
                    .from(table)
                    .delete()
                    .eq(column, userId);

                if (error) {
                    console.error(`Error deleting from ${table}:`, error);
                }
            }

            const { error: seekerError } = await supabaseAdmin
                .from('Seekers')
                .delete()
                .eq('unique_id', userId);

            if (seekerError) {
                console.error('Error deleting seeker profile:', seekerError);
            }
        } else {
            // Delete trainer-related data
            // First delete Jobs posted by recruiter (and related Applicants via cascade)
            const { error: jobsError } = await supabaseAdmin
                .from('Jobs')
                .delete()
                .eq('recruiter', userId);

            if (jobsError) {
                console.error('Error deleting jobs:', jobsError);
            }

            // Delete CompanyInfo
            const { error: companyError } = await supabaseAdmin
                .from('CompanyInfo')
                .delete()
                .eq('unique_id', userId);

            if (companyError) {
                console.error('Error deleting company info:', companyError);
            }

            const { error: recruiterError } = await supabaseAdmin
                .from('Recruiters')
                .delete()
                .eq('uniqueid', userId);

            if (recruiterError) {
                console.error('Error deleting recruiter profile:', recruiterError);
            }

            // Also delete TrainerProfile if exists
            const { error: trainerProfileError } = await supabaseAdmin
                .from('TrainerProfiles')
                .delete()
                .eq('user_id', userId);

            if (trainerProfileError) {
                console.error('Error deleting trainer profile:', trainerProfileError);
            }
        }

        // Delete from users table
        const { error: usersError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('uid', userId);

        if (usersError) {
            console.error('Error deleting from users table:', usersError);
        }

        // Delete from user table (different from users)
        const { error: userTableError } = await supabaseAdmin
            .from('user')
            .delete()
            .eq('id', userId);

        if (userTableError) {
            console.error('Error deleting from user table:', userTableError);
        }

        // Finally, delete from auth.users using admin API
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (authError) {
            console.error('Error deleting auth user:', authError);
            return NextResponse.json({ error: authError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in delete user route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

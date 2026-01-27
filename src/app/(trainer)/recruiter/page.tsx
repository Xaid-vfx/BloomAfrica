import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function RecruiterPage({ searchParams }: Props) {
    // Allow easy access to onboarding page for testing with ?goto=onboarding
    if (searchParams.goto === 'onboarding') {
        redirect('/recruiter/onboarding');
    }

    // Check onboarding status before redirecting
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.id) {
        try {
            const { data: trainerProfile } = await supabase
                .from('TrainerProfiles')
                .select('is_completed')
                .eq('user_id', user.id)
                .single();

            const isOnboardingComplete = trainerProfile?.is_completed || false;

            // Redirect to onboarding if profile doesn't exist or is not complete
            if (!trainerProfile || !isOnboardingComplete) {
                redirect('/recruiter/onboarding');
            }
        } catch (error) {
            // If there's any error (table doesn't exist, query failed, etc.), redirect to onboarding to be safe
            redirect('/recruiter/onboarding');
        }
    }

    redirect('/recruiter/dashboard');
}
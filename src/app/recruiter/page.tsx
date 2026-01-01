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

            // Redirect based on onboarding status
            if (!isOnboardingComplete && trainerProfile !== null) {
                redirect('/recruiter/onboarding');
            }
        } catch (error) {
            // Table doesn't exist yet - allow redirect to dashboard for local development
        }
    }

    redirect('/recruiter/dashboard');
}
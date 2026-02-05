import Sidebar from '@/components/trainer/Sidebar/Sidebar';
import MobileSidebar from '@/components/trainer/MobileSidebar/MobileSidebar';
import getUser from '@/lib/api/getUser';
import getCompany from '@/lib/api/getCompany';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { RecruiterProvider, type TrainerSubscription } from '@/context/RecruiterContext';
import ContentWrapper from './ContentWrapper';

async function fetchRecruiter(id: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Recruiters').select().eq('uniqueid', id).single()
    return data;
}

async function fetchTrainerProfile(userId: string) {
    try {
        const supabase = createServerComponentClient({ cookies })
        const { data, error } = await supabase
            .from('TrainerProfiles')
            .select('*')
            .eq('user_id', userId)
            .single()
        return data;
    } catch (error) {
        // Table doesn't exist yet - return null for local development
        console.log('TrainerProfiles table not found - using local storage')
        return null;
    }
}

async function fetchSubscription(userId: string): Promise<TrainerSubscription> {
    try {
        const supabase = createServerComponentClient({ cookies })
        const { data, error } = await supabase
            .from('TrainerSubscriptions')
            .select('*')
            .eq('user_id', userId)
            .single()
        return data;
    } catch (error) {
        // Table doesn't exist yet - return null for local development
        console.log('TrainerSubscriptions table not found - using local storage')
        return null;
    }
}

export default async function RecruiterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getUser();

    if (!user?.id) {
        redirect('/signup');
    }

    const company = await getCompany(user.id);
    const recruiter = await fetchRecruiter(user.id);
    const trainerProfile = await fetchTrainerProfile(user.id);
    const subscription = await fetchSubscription(user.id);

    if (!recruiter) {
        redirect('/signup');
    }

    // Check if onboarding is complete (used by context, redirect handled by middleware)
    const isOnboardingComplete = trainerProfile?.is_completed || false;

    return (
        <RecruiterProvider user={user} company={company} recruiter={recruiter} trainerProfile={trainerProfile} subscription={subscription} isOnboardingComplete={isOnboardingComplete}>
            <div className="flex flex-col bg-[#0A1F44] h-screen overflow-hidden">
                {/* Main Content */}
                <div className='flex flex-row lg:gap-5 lg:p-5 h-full'>
                    {/* Sidebar - Only visible on desktop */}
                    <div className='hidden lg:block h-full lg:w-[20%]'>
                        <Sidebar />
                    </div>

                    {/* Content Area */}
                    <div className="w-full flex flex-col h-screen lg:h-full lg:w-[80%] pl-16 lg:pl-0 bg-white lg:bg-transparent">
                        <ContentWrapper>
                            {children}
                        </ContentWrapper>
                    </div>
                </div>

                {/* Mobile Sidebar Navigation */}
                <MobileSidebar />
            </div>
        </RecruiterProvider>
    );
} 
import { Suspense } from 'react';
import Sidebar from '@/components/Recruiter/Sidebar/Sidebar';
import MobileSidebar from '@/components/Recruiter/MobileSidebar/MobileSidebar';
import getUser from '@/lib/getUser/getUser';
import getCompany from '@/lib/getCompany/getCompany';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { RecruiterProvider, type TrainerSubscription } from '@/context/RecruiterContext';

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

    // Check if onboarding is complete
    // For local development without database, check localStorage
    const isOnboardingComplete = trainerProfile?.is_completed || false;

    // Get current path to check if user is on onboarding page
    const headersList = headers();
    const pathname = headersList.get('x-invoke-path') || '';

    // Redirect to onboarding if not complete and trying to access other pages
    // Skip redirect if trainerProfile is null (table doesn't exist yet)
    if (trainerProfile !== null && !isOnboardingComplete && !pathname.includes('/onboarding')) {
        redirect('/recruiter/onboarding');
    }

    return (
        <RecruiterProvider user={user} company={company} recruiter={recruiter} trainerProfile={trainerProfile} subscription={subscription}>
            <div className="flex flex-col bg-[#0A1F44] h-screen overflow-hidden">
                {/* Main Content */}
                <div className='flex flex-row lg:gap-5 lg:p-5 h-full'>
                    {/* Sidebar - Only visible on desktop */}
                    <div className='hidden lg:block h-full lg:w-[20%]'>
                        <Sidebar />
                    </div>

                    {/* Content Area */}
                    <div className="w-full flex flex-col h-screen lg:h-full lg:w-[80%] pl-16 lg:pl-0 bg-white lg:bg-transparent">
                        <Suspense fallback={
                            <div className='relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden'>
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14B8A6]"></div>
                                    <p className="text-[#14B8A6] font-medium text-sm">Loading...</p>
                                </div>
                            </div>
                        }>
                            {children}
                        </Suspense>
                    </div>
                </div>

                {/* Mobile Sidebar Navigation */}
                <MobileSidebar />
            </div>
        </RecruiterProvider>
    );
} 
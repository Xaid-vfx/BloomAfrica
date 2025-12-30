import { Suspense } from 'react';
import Header from '@/components/Recruiter/Header/Header';
import Sidebar from '@/components/Recruiter/Sidebar/Sidebar';
import getUser from '@/lib/getUser/getUser';
import getCompany from '@/lib/getCompany/getCompany';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { RecruiterProvider } from '@/context/RecruiterContext';

async function fetchRecruiter(id: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Recruiters').select().eq('uniqueid', id).single()
    return data;
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

    if (!recruiter) {
        redirect('/signup');
    }

    return (
        <RecruiterProvider user={user} company={company} recruiter={recruiter}>
            <div className="flex flex-col bg-[#0A1F44] min-h-screen">
                {/* Mobile Header - Only visible on mobile */}
                <div className="lg:hidden">
                    <Header name={company?.name || ""} />
                </div>

                {/* Main Content */}
                <div className='flex flex-row lg:gap-5 lg:p-5 h-screen lg:h-auto'>
                    {/* Sidebar - Only visible on desktop */}
                    <div className='h-full lg:w-[20%]'>
                        <Sidebar />
                    </div>

                    {/* Content Area */}
                    <div className="w-full flex flex-col h-full lg:w-[80%]" style={{ height: 'calc(100vh - 2.5rem)' }}>
                        <Suspense fallback={
                            <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
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
            </div>
        </RecruiterProvider>
    );
} 
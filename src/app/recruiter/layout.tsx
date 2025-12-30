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
                        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
                            {children}
                        </Suspense>
                    </div>
                </div>
            </div>
        </RecruiterProvider>
    );
} 
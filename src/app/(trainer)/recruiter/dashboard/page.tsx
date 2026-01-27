'use client'

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRecruiter } from '@/context/RecruiterContext';
import { useRouter } from 'next/navigation';

const Dashboard = dynamic(() => import('@/components/trainer/Dashboard/Dashboard'), {
    loading: () => (
        <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14B8A6]"></div>
                <p className="text-[#14B8A6] font-medium text-sm">Loading...</p>
            </div>
        </div>
    )
});

export default function DashboardPage() {
    const { user, company, recruiter } = useRecruiter();
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <Suspense fallback={
            <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14B8A6]"></div>
                    <p className="text-[#14B8A6] font-medium text-sm">Loading...</p>
                </div>
            </div>
        }>
            <Dashboard
                user={user}
                company={company}
                recruiter={recruiter}
                onNavigate={handleNavigation}
            />
        </Suspense>
    );
} 
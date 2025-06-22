'use client'

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRecruiter } from '@/context/RecruiterContext';
import { useRouter } from 'next/navigation';

const Dashboard = dynamic(() => import('@/components/Recruiter/Dashboard/Dashboard'), {
    loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function DashboardPage() {
    const { user, company, recruiter } = useRecruiter();
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <Dashboard
                user={user}
                company={company}
                recruiter={recruiter}
                onNavigate={handleNavigation}
            />
        </Suspense>
    );
} 
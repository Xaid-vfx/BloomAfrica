'use client'

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const EditRecruiter = dynamic(() => import('@/components/Recruiter/RecruiterContent/EditRecruiter'), {
    loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function CompanyPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <EditRecruiter />
        </Suspense>
    );
} 
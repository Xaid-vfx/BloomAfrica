'use client'

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const BankDetails = dynamic(() => import('@/components/Recruiter/BankDetails/BankDetails'), {
    loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function BankDetailsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <BankDetails />
        </Suspense>
    );
} 
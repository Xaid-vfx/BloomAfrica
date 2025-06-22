'use client'

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Listing = dynamic(() => import('@/components/Recruiter/Listing/Listing'), {
    loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function ListingsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <Listing />
        </Suspense>
    );
} 
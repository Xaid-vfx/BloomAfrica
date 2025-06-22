'use client'

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Messages = dynamic(() => import('@/components/Recruiter/Messages/Messages'), {
    loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
            <Messages />
        </Suspense>
    );
} 
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Recruiter Dashboard | Bloom'
}

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function RecruiterPage({ searchParams }: Props) {
    // Allow easy access to onboarding page for testing with ?goto=onboarding
    if (searchParams.goto === 'onboarding') {
        redirect('/recruiter/onboarding');
    }

    // Layout handles auth and onboarding checks
    redirect('/recruiter/dashboard');
}
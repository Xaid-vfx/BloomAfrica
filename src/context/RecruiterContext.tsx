'use client'

import { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled' | null;
export type AccountStatus = 'pending_review' | 'approved' | 'rejected' | null;

export type TrainerSubscription = {
    id: string;
    user_id: string;
    profile_id: string;
    status: SubscriptionStatus;
    base_tier: string;
    base_amount: number;
    teaching_team_amount: number;
    accreditation_amount: number;
    direct_hire_amount: number;
    industry_multiplier: number;
    subtotal: number;
    total_amount: number;
    payment_reference: string | null;
    paid_at: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
} | null;

type RecruiterContextType = {
    user: any;
    company: any;
    recruiter: any;
    trainerProfile: any;
    subscription: TrainerSubscription;
    subscriptionStatus: SubscriptionStatus;
    hasActiveSubscription: boolean;
    accountStatus: AccountStatus;
    isAccountApproved: boolean;
    canPostApprenticeships: boolean;
    isOnboardingComplete: boolean;
    completedOnboardingSections: number[];
    refreshOnboardingStatus: () => Promise<void>;
    isLoading: boolean;
};

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

type RecruiterProviderProps = {
    children: ReactNode;
    user: any;
    company: any;
    recruiter: any;
    trainerProfile: any;
    subscription: TrainerSubscription;
    isOnboardingComplete: boolean;
};

export function RecruiterProvider({
    children,
    user,
    company,
    recruiter,
    trainerProfile,
    subscription,
    isOnboardingComplete: serverIsComplete
}: RecruiterProviderProps) {
    const supabase = createClientComponentClient();

    // Initialize directly from server props - no loading state
    const serverComplete = serverIsComplete || trainerProfile?.is_completed || false;
    const serverSections = serverComplete ? [1, 2, 3, 4, 5, 6, 7, 8] : (trainerProfile?.completed_sections || []);

    const [isOnboardingComplete, setIsOnboardingComplete] = useState(serverComplete);
    const [completedOnboardingSections, setCompletedOnboardingSections] = useState<number[]>(serverSections);
    const [isLoading, setIsLoading] = useState(true);
    const hasCheckedLocalStorage = useRef(false);

    const subscriptionStatus: SubscriptionStatus = subscription?.status || null;
    const hasActiveSubscription = subscriptionStatus === 'active';
    const accountStatus: AccountStatus = isOnboardingComplete
        ? (trainerProfile?.account_status || 'pending_review')
        : null;
    const isAccountApproved = accountStatus === 'approved';
    const canPostApprenticeships = hasActiveSubscription && isAccountApproved;

    // Only check localStorage if server says incomplete (for local dev without DB)
    useEffect(() => {
        if (hasCheckedLocalStorage.current) return;
        hasCheckedLocalStorage.current = true;

        // If server already says complete, we're done loading
        if (serverComplete) {
            setIsLoading(false);
            return;
        }

        async function checkLocalStorage() {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                if (!authUser) return;

                const localComplete = localStorage.getItem(`trainer_onboarding_complete_${authUser.id}`);
                if (localComplete === 'true') {
                    setIsOnboardingComplete(true);
                    setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8]);
                    return;
                }

                const localData = localStorage.getItem(`trainer_profile_${authUser.id}`);
                if (localData) {
                    const data = JSON.parse(localData);
                    if (data.is_completed) {
                        setIsOnboardingComplete(true);
                        setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8]);
                    } else if (data.completed_sections) {
                        setCompletedOnboardingSections(data.completed_sections);
                    }
                }
            } catch (e) {
                // Ignore
            } finally {
                setIsLoading(false);
            }
        }

        checkLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshOnboardingStatus = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            const { data, error } = await supabase
                .from('TrainerProfiles')
                .select('is_completed, completed_sections')
                .eq('user_id', authUser.id)
                .single();

            if (!error && data) {
                if (data.is_completed) {
                    setIsOnboardingComplete(true);
                    setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8]);
                } else {
                    setCompletedOnboardingSections(data.completed_sections || []);
                }
            } else {
                // Fallback to localStorage for local development
                const localComplete = localStorage.getItem(`trainer_onboarding_complete_${authUser.id}`);
                if (localComplete === 'true') {
                    setIsOnboardingComplete(true);
                    setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8]);
                    return;
                }

                const localData = localStorage.getItem(`trainer_profile_${authUser.id}`);
                if (localData) {
                    const parsedData = JSON.parse(localData);
                    if (parsedData.is_completed) {
                        setIsOnboardingComplete(true);
                        setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8]);
                    } else if (parsedData.completed_sections) {
                        setCompletedOnboardingSections(parsedData.completed_sections);
                    }
                }
            }
        } catch (e) {
            // Ignore
        }
    }, [supabase]);

    return (
        <RecruiterContext.Provider value={{
            user,
            company,
            recruiter,
            trainerProfile,
            subscription,
            subscriptionStatus,
            hasActiveSubscription,
            accountStatus,
            isAccountApproved,
            canPostApprenticeships,
            isOnboardingComplete,
            completedOnboardingSections,
            refreshOnboardingStatus,
            isLoading,
        }}>
            {children}
        </RecruiterContext.Provider>
    );
}

export function useRecruiter() {
    const context = useContext(RecruiterContext);
    if (context === undefined) {
        throw new Error('useRecruiter must be used within a RecruiterProvider');
    }
    return context;
}

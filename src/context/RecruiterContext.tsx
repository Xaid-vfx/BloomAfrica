'use client'

import { createContext, useContext, ReactNode } from 'react';

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
    canPostApprenticeships: boolean; // true only if paid AND approved
};

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export function RecruiterProvider({
    children,
    user,
    company,
    recruiter,
    trainerProfile,
    subscription
}: Omit<RecruiterContextType, 'subscriptionStatus' | 'hasActiveSubscription' | 'accountStatus' | 'isAccountApproved' | 'canPostApprenticeships'> & { children: ReactNode }) {
    const subscriptionStatus: SubscriptionStatus = subscription?.status || null;
    const hasActiveSubscription = subscriptionStatus === 'active';

    // Account status - derived from trainer profile
    // After onboarding completion, account is "pending_review" until admin approves
    const accountStatus: AccountStatus = trainerProfile?.is_completed
        ? (trainerProfile?.account_status || 'pending_review')
        : null;
    const isAccountApproved = accountStatus === 'approved';

    // Can only post apprenticeships if both paid AND approved
    const canPostApprenticeships = hasActiveSubscription && isAccountApproved;

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
            canPostApprenticeships
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
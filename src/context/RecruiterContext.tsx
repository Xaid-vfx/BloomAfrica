'use client'

import { createContext, useContext, ReactNode } from 'react';

type RecruiterContextType = {
    user: any;
    company: any;
    recruiter: any;
    trainerProfile: any;
};

const RecruiterContext = createContext<RecruiterContextType | undefined>(undefined);

export function RecruiterProvider({ children, user, company, recruiter, trainerProfile }: RecruiterContextType & { children: ReactNode }) {
    return (
        <RecruiterContext.Provider value={{ user, company, recruiter, trainerProfile }}>
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
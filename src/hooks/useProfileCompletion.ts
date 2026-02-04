'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ProfileSections = {
    personalInfo: boolean;
    education: boolean;
    experience: boolean;
};

type ProfileCompletionResult = {
    isComplete: boolean;
    sections: ProfileSections;
    loading: boolean;
};

export default function useProfileCompletion(userId: string | null): ProfileCompletionResult {
    const [sections, setSections] = useState<ProfileSections>({
        personalInfo: false,
        education: false,
        experience: false,
    });
    const [loading, setLoading] = useState(true);
    const supabase = createClientComponentClient();

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        async function checkProfileCompletion() {
            setLoading(true);

            const [seekerResult, educationResult, experienceResult] = await Promise.all([
                supabase.from('Seekers').select('name, gender, country, state').eq('unique_id', userId).maybeSingle(),
                supabase.from('Education').select('school_name, field, level').eq('unique_id', userId).maybeSingle(),
                supabase.from('Experience').select('company_name, cv').eq('unique_id', userId).maybeSingle(),
            ]);

            const seeker = seekerResult.data;
            const education = educationResult.data;
            const experience = experienceResult.data;

            const personalInfoComplete = !!(
                seeker?.name &&
                seeker?.gender &&
                seeker?.country &&
                seeker?.state
            );

            const educationComplete = !!(
                education?.school_name &&
                education?.field &&
                education?.level
            );

            const experienceComplete = !!(
                experience?.company_name || experience?.cv
            );

            setSections({
                personalInfo: personalInfoComplete,
                education: educationComplete,
                experience: experienceComplete,
            });
            setLoading(false);
        }

        checkProfileCompletion();

        // Subscribe to real-time changes for immediate updates
        const seekersChannel = supabase
            .channel('seekers-profile-completion')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Seekers', filter: `unique_id=eq.${userId}` }, () => {
                checkProfileCompletion();
            })
            .subscribe();

        const educationChannel = supabase
            .channel('education-profile-completion')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Education', filter: `unique_id=eq.${userId}` }, () => {
                checkProfileCompletion();
            })
            .subscribe();

        const experienceChannel = supabase
            .channel('experience-profile-completion')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'Experience', filter: `unique_id=eq.${userId}` }, () => {
                checkProfileCompletion();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(seekersChannel);
            supabase.removeChannel(educationChannel);
            supabase.removeChannel(experienceChannel);
        };
    }, [userId, supabase]);

    const isComplete = sections.personalInfo && sections.education && sections.experience;

    return { isComplete, sections, loading };
}

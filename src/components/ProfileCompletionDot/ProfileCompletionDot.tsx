'use client';
import useProfileCompletion from '@/hooks/useProfileCompletion';

type Props = {
    userId: string | null;
    className?: string;
};

export default function ProfileCompletionDot({ userId, className = '' }: Props) {
    const { isComplete, loading } = useProfileCompletion(userId);

    if (loading || isComplete || !userId) {
        return null;
    }

    return (
        <div className={`bg-orange-500 rounded-full w-2 h-2 ${className}`} />
    );
}

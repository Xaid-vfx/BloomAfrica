/**
 * Curriculum Eligibility Checker
 *
 * Verifies if a trainer can access a specific curriculum based on:
 * 1. Industry match (primary or secondary)
 * 2. Subscription tier requirements
 */

export type SubscriptionTier = 'Artisan' | 'Corporate' | null;

export interface Curriculum {
    id: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    primary_industry: string;
    secondary_industries?: string[];
    program_type?: string;
    duration_weeks?: number;
    skill_level?: 'beginner' | 'intermediate' | 'advanced';
    learning_outcomes?: string[];
    required_subscription_tier?: SubscriptionTier;
    is_active?: boolean;
    is_featured?: boolean;
}

export interface TrainerProfile {
    id: string;
    user_id: string;
    primary_industry?: string;
    business_name?: string;
}

export interface TrainerSubscription {
    id: string;
    user_id: string;
    base_tier?: string;
    status?: string;
}

export interface EligibilityResult {
    isEligible: boolean;
    reason?: string;
    issues: string[];
}

// Tier hierarchy - higher index = more access
const TIER_HIERARCHY: Record<string, number> = {
    'Artisan': 1,
    'Corporate': 2,
};

/**
 * Check if a trainer is eligible to access a curriculum
 */
export function checkCurriculumEligibility(
    curriculum: Curriculum,
    trainerProfile: TrainerProfile | null,
    subscription: TrainerSubscription | null
): EligibilityResult {
    const issues: string[] = [];

    // If no trainer profile, not eligible
    if (!trainerProfile) {
        return {
            isEligible: false,
            reason: 'Trainer profile required',
            issues: ['No trainer profile found'],
        };
    }

    // Check 1: Industry match
    const trainerIndustry = trainerProfile.primary_industry;
    const curriculumPrimaryIndustry = curriculum.primary_industry;
    const curriculumSecondaryIndustries = curriculum.secondary_industries || [];

    const industryMatches =
        trainerIndustry === curriculumPrimaryIndustry ||
        curriculumSecondaryIndustries.includes(trainerIndustry || '');

    if (!industryMatches) {
        issues.push(`This curriculum is for ${curriculumPrimaryIndustry} industry`);
    }

    // Check 2: Subscription tier
    const requiredTier = curriculum.required_subscription_tier;
    const trainerTier = subscription?.base_tier as SubscriptionTier;

    let tierSufficient = true;

    if (requiredTier) {
        // If curriculum requires a tier, check if trainer has sufficient tier
        if (!trainerTier) {
            tierSufficient = false;
            issues.push(`Requires ${requiredTier} subscription tier`);
        } else {
            const requiredLevel = TIER_HIERARCHY[requiredTier] || 0;
            const trainerLevel = TIER_HIERARCHY[trainerTier] || 0;

            if (trainerLevel < requiredLevel) {
                tierSufficient = false;
                issues.push(`Requires ${requiredTier} subscription tier (you have ${trainerTier})`);
            }
        }
    }

    const isEligible = industryMatches && tierSufficient;

    return {
        isEligible,
        reason: isEligible ? undefined : issues[0],
        issues,
    };
}

/**
 * Filter a list of curriculums to only those eligible for a trainer
 */
export function filterEligibleCurriculums(
    curriculums: Curriculum[],
    trainerProfile: TrainerProfile | null,
    subscription: TrainerSubscription | null
): (Curriculum & { eligibility: EligibilityResult })[] {
    return curriculums.map((curriculum) => ({
        ...curriculum,
        eligibility: checkCurriculumEligibility(curriculum, trainerProfile, subscription),
    }));
}

/**
 * Check if trainer's industry matches curriculum
 */
export function matchesTrainerIndustry(
    curriculum: Curriculum,
    trainerIndustry: string | undefined
): boolean {
    if (!trainerIndustry) return false;

    return (
        curriculum.primary_industry === trainerIndustry ||
        (curriculum.secondary_industries || []).includes(trainerIndustry)
    );
}

/**
 * Check if trainer's subscription tier is sufficient for curriculum
 */
export function hasSufficientTier(
    requiredTier: SubscriptionTier,
    trainerTier: string | undefined
): boolean {
    // If no tier required, always sufficient
    if (!requiredTier) return true;

    // If tier required but trainer has none, not sufficient
    if (!trainerTier) return false;

    const requiredLevel = TIER_HIERARCHY[requiredTier] || 0;
    const trainerLevel = TIER_HIERARCHY[trainerTier] || 0;

    return trainerLevel >= requiredLevel;
}

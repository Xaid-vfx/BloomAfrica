'use client'

import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn, spacing, typography } from '@/styles/mobile-design-tokens'

interface OnboardingProgressMobileProps {
  completedSections: number
  totalSections: number
  onContinue?: () => void
  className?: string
}

export default function OnboardingProgressMobile({
  completedSections,
  totalSections,
  onContinue,
  className,
}: OnboardingProgressMobileProps) {
  const router = useRouter()
  const progress = (completedSections / totalSections) * 100
  const isComplete = completedSections === totalSections

  const handleClick = () => {
    if (onContinue) {
      onContinue()
    } else {
      router.push('/recruiter/onboarding')
    }
  }

  if (isComplete) {
    return null
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'py-3 px-4 cursor-pointer',
        'bg-yellow-50 border-2 border-yellow-400 rounded-lg',
        'transition-all duration-200',
        'hover:bg-yellow-100 hover:border-yellow-500',
        'active:scale-98',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="text-yellow-700 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1 min-w-0">
          <p className={cn(typography.label, 'text-yellow-900 mb-1')}>
            Complete Your Onboarding
          </p>
          <p className={cn(typography.helper, 'text-yellow-700 mb-2')}>
            {completedSections} of {totalSections} sections complete
          </p>

          {/* Progress bar */}
          <div className="relative h-1.5 bg-yellow-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-yellow-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact banner version for top of hamburger menu
export function OnboardingBanner({
  completedSections,
  totalSections,
  onContinue,
  className,
}: OnboardingProgressMobileProps) {
  const router = useRouter()
  const isComplete = completedSections === totalSections

  const handleClick = () => {
    if (onContinue) {
      onContinue()
    } else {
      router.push('/recruiter/onboarding')
    }
  }

  if (isComplete) {
    return null
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        'py-2.5 px-4 cursor-pointer',
        'bg-gradient-to-r from-yellow-50 to-orange-50',
        'border-l-4 border-yellow-500',
        'transition-all duration-200',
        'hover:from-yellow-100 hover:to-orange-100',
        'active:scale-98',
        'mb-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        <div className="flex-1">
          <p className={cn(typography.bodySmall, 'text-yellow-900 font-semibold')}>
            {totalSections - completedSections} step{totalSections - completedSections !== 1 ? 's' : ''} remaining
          </p>
          <p className={cn(typography.helper, 'text-yellow-700 text-xs')}>
            Tap to continue onboarding
          </p>
        </div>
        <CheckCircle2 className="text-yellow-600" size={18} />
      </div>
    </div>
  )
}

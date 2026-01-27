'use client'

import { cn, mobile, spacing, typography } from '@/styles/mobile-design-tokens'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitle?: string
  className?: string
  showPercentage?: boolean
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitle,
  className,
  showPercentage = false,
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div
      className={cn(
        mobile.stickyHeader,
        spacing.pagePadding,
        'py-2',
        className
      )}
    >
      <div className="max-w-3xl mx-auto">
        {/* Step counter and title */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={cn(typography.label, 'text-[#14B8A6]')}>
              Step {currentStep} of {totalSteps}
            </span>
            {showPercentage && (
              <span className={cn(typography.helper, 'text-gray-500')}>
                ({Math.round(progress)}%)
              </span>
            )}
          </div>
          {stepTitle && (
            <span className={cn(typography.bodySmall, 'text-gray-600 font-medium')}>
              {stepTitle}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#14B8A6] to-[#14B8A6] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for small spaces
export function CompactProgressIndicator({
  currentStep,
  totalSteps,
  className,
}: Omit<ProgressIndicatorProps, 'stepTitle' | 'showPercentage'>) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className={cn(typography.helper, 'text-gray-600 whitespace-nowrap')}>
        {currentStep}/{totalSteps}
      </span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#14B8A6] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

// Step dots indicator (alternative style)
export function StepDotsIndicator({
  currentStep,
  totalSteps,
  onStepClick,
  className,
}: ProgressIndicatorProps & { onStepClick?: (step: number) => void }) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <button
            key={stepNumber}
            onClick={() => onStepClick?.(stepNumber)}
            disabled={!onStepClick}
            className={cn(
              'transition-all duration-200',
              onStepClick && 'cursor-pointer hover:scale-110',
              !onStepClick && 'cursor-default'
            )}
            aria-label={`Step ${stepNumber}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <div
              className={cn(
                'rounded-full transition-all duration-300',
                isActive && 'w-3 h-3 bg-[#14B8A6]',
                isCompleted && 'w-2 h-2 bg-[#14B8A6]',
                !isActive && !isCompleted && 'w-2 h-2 bg-gray-300'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

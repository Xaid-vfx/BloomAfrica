'use client'

import { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { cn, mobile, zIndex, touchTargets, buttonVariants, spacing } from '@/styles/mobile-design-tokens'
import { MiniLoader } from '@/components/Recruiter/Loading'

interface FormBottomNavProps {
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  previousLabel?: string
  nextLabel?: string
  submitLabel?: string
  isFirstStep?: boolean
  isLastStep?: boolean
  isLoading?: boolean
  disabled?: boolean
  className?: string
  nextIcon?: ReactNode
}

export default function FormBottomNav({
  onPrevious,
  onNext,
  onSubmit,
  previousLabel = 'Previous',
  nextLabel = 'Continue',
  submitLabel = 'Complete',
  isFirstStep = false,
  isLastStep = false,
  isLoading = false,
  disabled = false,
  className,
  nextIcon,
}: FormBottomNavProps) {
  const handlePrimaryAction = () => {
    if (isLastStep && onSubmit) {
      onSubmit()
    } else if (onNext) {
      onNext()
    }
  }

  return (
    <div
      className={cn(
        'bg-white border-t border-gray-200 shadow-lg',
        'pb-safe',
        zIndex.sticky,
        // Fixed on mobile, static on desktop
        'fixed bottom-0 left-0 right-0 lg:static',
        className
      )}
    >
      <div className={cn('max-w-3xl mx-auto', spacing.pagePadding, 'py-4')}>
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          {!isFirstStep && onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              disabled={isLoading}
              className={cn(
                touchTargets.button,
                buttonVariants.secondary,
                'flex items-center gap-2 flex-1 lg:flex-initial lg:min-w-[140px]',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              aria-label={previousLabel}
            >
              <ArrowLeft size={18} />
              <span>{previousLabel}</span>
            </button>
          ) : (
            <div className="flex-1 lg:hidden" /> // Spacer on mobile
          )}

          {/* Next/Submit Button */}
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={disabled || isLoading}
            className={cn(
              touchTargets.button,
              isLastStep ? buttonVariants.accent : buttonVariants.primary,
              'flex items-center justify-center gap-2',
              'flex-1 lg:flex-initial lg:min-w-[180px]',
              'relative'
            )}
            aria-label={isLastStep ? submitLabel : nextLabel}
          >
            {isLoading ? (
              <>
                <MiniLoader className="text-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className="font-semibold">
                  {isLastStep ? submitLabel : nextLabel}
                </span>
                {isLastStep ? (
                  <Check size={18} />
                ) : nextIcon ? (
                  nextIcon
                ) : (
                  <ArrowRight size={18} />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Simple version with just one action button
export function SimpleFormBottomNav({
  onAction,
  label = 'Continue',
  isLoading = false,
  disabled = false,
  variant = 'primary',
  icon,
  className,
}: {
  onAction: () => void
  label?: string
  isLoading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'accent' | 'secondary'
  icon?: ReactNode
  className?: string
}) {
  const variantClass = {
    primary: buttonVariants.primary,
    accent: buttonVariants.accent,
    secondary: buttonVariants.secondary,
  }[variant]

  return (
    <div
      className={cn(
        'bg-white border-t border-gray-200 shadow-lg',
        'pb-safe',
        zIndex.sticky,
        'fixed bottom-0 left-0 right-0 lg:static',
        className
      )}
    >
      <div className={cn('max-w-3xl mx-auto', spacing.pagePadding, 'py-4')}>
        <button
          type="button"
          onClick={onAction}
          disabled={disabled || isLoading}
          className={cn(
            touchTargets.button,
            variantClass,
            'w-full flex items-center justify-center gap-2'
          )}
        >
          {isLoading ? (
            <>
              <MiniLoader className="text-white" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span className="font-semibold">{label}</span>
              {icon && icon}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

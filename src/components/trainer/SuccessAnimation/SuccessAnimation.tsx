'use client'

import { useEffect, useState } from 'react'
import { Check, CheckCircle2, Sparkles } from 'lucide-react'
import { cn, layout, typography, animations } from '@/styles/mobile-design-tokens'

interface SuccessAnimationProps {
  title?: string
  message?: string
  onComplete?: () => void
  autoClose?: boolean
  autoCloseDuration?: number
  size?: 'small' | 'medium' | 'large'
  variant?: 'checkmark' | 'celebration'
}

export default function SuccessAnimation({
  title = 'Success!',
  message,
  onComplete,
  autoClose = false,
  autoCloseDuration = 2000,
  size = 'medium',
  variant = 'checkmark',
}: SuccessAnimationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setShow(false)
        onComplete?.()
      }, autoCloseDuration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, autoCloseDuration, onComplete])

  if (!show) return null

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }[size]

  const textSizeClasses = {
    small: typography.h4,
    medium: typography.h3,
    large: typography.h2,
  }[size]

  if (variant === 'celebration') {
    return (
      <div className={cn(layout.flexColCenter, 'py-12 px-6 text-center', animations.fadeIn)}>
        {/* Celebration icon with confetti effect */}
        <div className="relative mb-6">
          <div className={cn(
            sizeClasses,
            'bg-gradient-to-br from-[#14B8A6] to-[#0D9488]',
            'rounded-full flex items-center justify-center',
            'shadow-xl',
            'animate-scale-in'
          )}>
            <CheckCircle2 className="text-white" size={size === 'small' ? 32 : size === 'medium' ? 48 : 64} />
          </div>

          {/* Confetti particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full animate-confetti"
              style={{
                background: ['#4640DE', '#14B8A6', '#F59E0B', '#EF4444'][i % 4],
                transform: `rotate(${i * 30}deg) translateY(-${sizeClasses.includes('16') ? 40 : sizeClasses.includes('24') ? 60 : 80}px)`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}

          {/* Sparkles */}
          <Sparkles
            className="absolute -top-2 -right-2 text-yellow-400 animate-pulse"
            size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
          />
          <Sparkles
            className="absolute -bottom-2 -left-2 text-yellow-400 animate-pulse"
            size={size === 'small' ? 12 : size === 'medium' ? 16 : 20}
            style={{ animationDelay: '0.3s' }}
          />
        </div>

        {/* Text content */}
        <h2 className={cn(textSizeClasses, 'text-[#0A1F44] mb-2')}>
          {title}
        </h2>
        {message && (
          <p className={cn(typography.body, 'text-gray-600 max-w-md')}>
            {message}
          </p>
        )}
      </div>
    )
  }

  // Default checkmark variant
  return (
    <div className={cn(layout.flexColCenter, 'py-12 px-6 text-center', animations.fadeIn)}>
      {/* Animated checkmark */}
      <div className="relative mb-6">
        <div className={cn(
          sizeClasses,
          'bg-green-100 rounded-full flex items-center justify-center',
          'animate-scale-in'
        )}>
          <div className="relative">
            {/* Circle animation */}
            <svg className="absolute inset-0" viewBox="0 0 52 52">
              <circle
                className="animate-draw-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
              />
            </svg>

            {/* Checkmark */}
            <Check
              className="text-green-600 relative z-10 animate-draw-check"
              size={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
            />
          </div>
        </div>
      </div>

      {/* Text content */}
      <h2 className={cn(textSizeClasses, 'text-[#0A1F44] mb-2')}>
        {title}
      </h2>
      {message && (
        <p className={cn(typography.body, 'text-gray-600 max-w-md')}>
          {message}
        </p>
      )}
    </div>
  )
}

// Full-screen success overlay
export function SuccessOverlay({
  show,
  onClose,
  ...props
}: SuccessAnimationProps & { show: boolean; onClose: () => void }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-in">
      <SuccessAnimation {...props} onComplete={onClose} />
    </div>
  )
}

// Inline success message (non-intrusive)
export function InlineSuccess({
  message,
  onDismiss,
  className,
}: {
  message: string
  onDismiss?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-lg p-4',
        'animate-slide-in-bottom',
        className
      )}
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <Check size={16} className="text-white" />
        </div>
      </div>
      <p className={cn(typography.body, 'text-green-900 flex-1')}>{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

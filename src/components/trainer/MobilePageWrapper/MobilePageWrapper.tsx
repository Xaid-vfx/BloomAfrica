'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn, spacing, typography, touchTargets, mobile, layout, borderRadius } from '@/styles/mobile-design-tokens'

interface MobilePageWrapperProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  backPath?: string
  onBack?: () => void
  headerRight?: ReactNode
  className?: string
  contentClassName?: string
  fullHeight?: boolean
}

export default function MobilePageWrapper({
  children,
  title,
  showBack = false,
  backPath,
  onBack,
  headerRight,
  className,
  contentClassName,
  fullHeight = true,
}: MobilePageWrapperProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backPath) {
      router.push(backPath)
    } else {
      router.back()
    }
  }

  return (
    <div className={cn('flex flex-col bg-white', fullHeight && 'h-screen', className)}>
      {/* Header - only show if title or back button needed */}
      {(title || showBack || headerRight) && (
        <div className={cn(mobile.stickyHeader, spacing.pagePadding, 'flex items-center justify-between min-h-[48px] py-2')}>
          {/* Left side - Back button */}
          <div className="flex items-center gap-3 flex-1">
            {showBack && (
              <button
                onClick={handleBack}
                className={cn(
                  touchTargets.iconButton,
                  'flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:ring-offset-2'
                )}
                aria-label="Go back"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
            )}

            {/* Title */}
            {title && (
              <h1 className={cn(typography.h4, 'truncate')}>
                {title}
              </h1>
            )}
          </div>

          {/* Right side - Custom content */}
          {headerRight && (
            <div className="flex items-center gap-2">
              {headerRight}
            </div>
          )}
        </div>
      )}

      {/* Content area - scrollable */}
      <div
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          mobile.scrollMomentum,
          contentClassName
        )}
        style={{
          // Proper height calculation that accounts for the header
          height: fullHeight ? (title || showBack || headerRight ? 'calc(100vh - 48px)' : '100vh') : 'auto'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Sub-components for common patterns

interface PageContentProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  padding?: boolean
}

export function PageContent({
  children,
  className,
  maxWidth = 'lg',
  padding = true,
}: PageContentProps) {
  const containerClass = {
    sm: layout.containerSm,
    md: layout.containerMd,
    lg: layout.containerLg,
    xl: layout.containerXl,
  }[maxWidth]

  return (
    <div className={cn(containerClass, padding && spacing.pagePadding, 'w-full', className)}>
      {children}
    </div>
  )
}

interface PageSectionProps {
  children: ReactNode
  title?: string
  description?: string
  className?: string
}

export function PageSection({
  children,
  title,
  description,
  className,
}: PageSectionProps) {
  return (
    <section className={cn(spacing.marginLg, className)}>
      {title && (
        <div className={spacing.marginMd}>
          <h2 className={typography.h3}>{title}</h2>
          {description && (
            <p className={cn(typography.bodySmall, 'mt-1')}>{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(layout.flexColCenter, 'py-12 px-6 text-center', className)}>
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}

      <h3 className={cn(typography.h3, 'mb-2')}>{title}</h3>

      {description && (
        <p className={cn(typography.bodySmall, 'max-w-md mb-6')}>
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            touchTargets.button,
            'bg-[#4640DE] hover:bg-[#3730A3] text-white font-medium rounded-lg',
            'shadow-md hover:shadow-lg active:scale-95 transition-all'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={cn('bg-white', spacing.cardPadding, borderRadius.lg, 'shadow-xl flex flex-col items-center gap-3')}>
        <div className="w-10 h-10 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
        <p className={typography.bodySmall}>{message}</p>
      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { HelpCircle, X } from 'lucide-react'
import { cn, typography, borderRadius, shadows, zIndex, touchTargets } from '@/styles/mobile-design-tokens'

interface HelpTooltipProps {
  content: string | ReactNode
  title?: string
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  className?: string
  iconClassName?: string
  maxWidth?: string
}

export default function HelpTooltip({
  content,
  title,
  position = 'auto',
  className,
  iconClassName,
  maxWidth = '280px',
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [calculatedPosition, setCalculatedPosition] = useState(position)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen || position !== 'auto') return

    const trigger = triggerRef.current
    const tooltip = tooltipRef.current
    if (!trigger || !tooltip) return

    const triggerRect = trigger.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    // Determine best position
    const spaceAbove = triggerRect.top
    const spaceBelow = viewportHeight - triggerRect.bottom
    const spaceLeft = triggerRect.left
    const spaceRight = viewportWidth - triggerRect.right

    if (spaceBelow >= tooltipRect.height + 10) {
      setCalculatedPosition('bottom')
    } else if (spaceAbove >= tooltipRect.height + 10) {
      setCalculatedPosition('top')
    } else if (spaceRight >= tooltipRect.width + 10) {
      setCalculatedPosition('right')
    } else if (spaceLeft >= tooltipRect.width + 10) {
      setCalculatedPosition('left')
    } else {
      setCalculatedPosition('bottom')
    }
  }, [isOpen, position])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside as any)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside as any)
    }
  }, [isOpen])

  const getPositionClasses = () => {
    const pos = position === 'auto' ? calculatedPosition : position

    switch (pos) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
    }
  }

  const getArrowClasses = () => {
    const pos = position === 'auto' ? calculatedPosition : position

    switch (pos) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-white'
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-white'
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-white'
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-white'
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-white'
    }
  }

  return (
    <div className={cn('relative inline-flex', className)}>
      {/* Help icon trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'text-gray-400 hover:text-[#4640DE] transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:ring-offset-2',
          'w-5 h-5',
          iconClassName
        )}
        aria-label="Help"
        aria-expanded={isOpen}
      >
        <HelpCircle size={18} />
      </button>

      {/* Tooltip content */}
      {isOpen && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute',
            getPositionClasses(),
            'bg-white',
            borderRadius.md,
            shadows.lg,
            'border border-gray-200',
            'p-4',
            zIndex.popover,
            'animate-scale-in'
          )}
          style={{ maxWidth }}
          role="tooltip"
        >
          {/* Arrow */}
          <div
            className={cn(
              'absolute w-0 h-0',
              'border-8 border-transparent',
              getArrowClasses()
            )}
          />

          {/* Header */}
          {title && (
            <div className="flex items-start justify-between mb-2">
              <h4 className={cn(typography.label, 'text-gray-900 pr-2')}>
                {title}
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Content */}
          <div className={cn(typography.bodySmall, 'text-gray-600')}>
            {typeof content === 'string' ? <p>{content}</p> : content}
          </div>
        </div>
      )}
    </div>
  )
}

// Inline help text (always visible, non-intrusive)
export function InlineHelp({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 bg-blue-50 border-l-4 border-blue-400 p-3 rounded',
        className
      )}
    >
      <HelpCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
      <div className={cn(typography.bodySmall, 'text-blue-900')}>
        {children}
      </div>
    </div>
  )
}

// Field label with integrated help tooltip
export function LabelWithHelp({
  label,
  helpContent,
  required,
  className,
}: {
  label: string
  helpContent: string | ReactNode
  required?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1.5 mb-2', className)}>
      <label className={cn(typography.label)}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <HelpTooltip content={helpContent} />
    </div>
  )
}

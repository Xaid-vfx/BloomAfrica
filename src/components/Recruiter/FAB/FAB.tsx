'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn, touchTargets, mobile, zIndex } from '@/styles/mobile-design-tokens'

interface FABProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  icon: ReactNode
  label?: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
  size?: 'default' | 'large'
  variant?: 'primary' | 'accent'
}

export default function FAB({
  icon,
  label,
  position = 'bottom-right',
  size = 'default',
  variant = 'accent',
  ...buttonProps
}: FABProps) {
  const getPositionClass = () => {
    const baseClass = 'fixed bottom-6 lg:hidden'
    switch (position) {
      case 'bottom-right':
        return `${baseClass} right-6`
      case 'bottom-left':
        return `${baseClass} left-6`
      case 'bottom-center':
        return `${baseClass} left-1/2 -translate-x-1/2`
      default:
        return `${baseClass} right-6`
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'large':
        return 'w-16 h-16 min-w-[64px] min-h-[64px]'
      case 'default':
      default:
        return 'w-14 h-14 min-w-[56px] min-h-[56px]'
    }
  }

  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-lg shadow-[#14B8A6]/40 hover:shadow-xl hover:shadow-[#14B8A6]/50'
      case 'accent':
      default:
        return 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-lg shadow-[#14B8A6]/40 hover:shadow-xl hover:shadow-[#14B8A6]/50'
    }
  }

  return (
    <button
      className={cn(
        getPositionClass(),
        getSizeClass(),
        getVariantClass(),
        'rounded-full flex items-center justify-center gap-2',
        'transition-all duration-200 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-offset-2',
        variant === 'primary' ? 'focus:ring-[#14B8A6]/50' : 'focus:ring-[#14B8A6]/50',
        zIndex.fixed,
        buttonProps.disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={label || 'Floating action button'}
      {...buttonProps}
    >
      <span className={cn(size === 'large' ? 'text-2xl' : 'text-xl')}>
        {icon}
      </span>
      {label && (
        <span className="font-semibold text-sm">{label}</span>
      )}
    </button>
  )
}

// Extended FAB with label that shows on hover
interface ExtendedFABProps extends FABProps {
  alwaysShowLabel?: boolean
}

export function ExtendedFAB({
  icon,
  label,
  alwaysShowLabel = false,
  ...fabProps
}: ExtendedFABProps) {
  return (
    <button
      className={cn(
        'fixed bottom-6 right-6 lg:hidden',
        'flex items-center gap-3 px-4 py-3 rounded-full',
        'bg-[#14B8A6] hover:bg-[#0D9488] text-white',
        'shadow-lg shadow-[#14B8A6]/40 hover:shadow-xl hover:shadow-[#14B8A6]/50',
        'transition-all duration-200 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-[#14B8A6]/50 focus:ring-offset-2',
        zIndex.fixed,
        fabProps.disabled && 'opacity-50 cursor-not-allowed'
      )}
      aria-label={label}
      {...fabProps}
    >
      <span className="text-xl">{icon}</span>
      {label && (
        <span
          className={cn(
            'font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-200',
            alwaysShowLabel ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100'
          )}
        >
          {label}
        </span>
      )}
    </button>
  )
}

'use client'

import { cn, layout, typography } from '@/styles/mobile-design-tokens'

interface PageLoaderProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export default function PageLoader({
  message = 'Loading...',
  fullScreen = true,
  className,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        layout.flexColCenter,
        'gap-4',
        fullScreen ? 'h-screen' : 'py-12',
        className
      )}
    >
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        <div className="absolute inset-0 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
      </div>

      {/* Message */}
      {message && (
        <p className={cn(typography.body, 'text-gray-600 animate-pulse')}>
          {message}
        </p>
      )}
    </div>
  )
}

// Mini loader for buttons and inline use
export function MiniLoader({ className }: { className?: string }) {
  return (
    <div className={cn('inline-block w-5 h-5', className)}>
      <div className="w-full h-full border-2 border-current border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Dots loader for subtle loading states
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-1.5', className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

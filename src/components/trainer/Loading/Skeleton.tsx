'use client'

import { cn } from '@/styles/mobile-design-tokens'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export default function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'rectangular':
        return 'rounded-lg'
      case 'text':
      default:
        return 'rounded'
    }
  }

  const getAnimationClass = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse'
      case 'wave':
        return 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]'
      case 'none':
      default:
        return ''
    }
  }

  return (
    <div
      className={cn(
        'bg-gray-200',
        getVariantClass(),
        getAnimationClass(),
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}

// Pre-built skeleton variants for common use cases

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          height={16}
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-4 border border-gray-200 rounded-lg bg-white', className)}>
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1">
          <Skeleton variant="text" height={20} width="60%" className="mb-2" />
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <Skeleton
      variant="rectangular"
      height={44}
      className={cn('w-full sm:w-auto sm:min-w-[120px]', className)}
    />
  )
}

export function SkeletonInput({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton variant="text" height={16} width="30%" />
      <Skeleton variant="rectangular" height={44} />
    </div>
  )
}

export function SkeletonAvatar({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  )
}

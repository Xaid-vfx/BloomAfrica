'use client'

import { ReactNode, useRef, useState, TouchEvent } from 'react'
import { Trash2, Archive } from 'lucide-react'
import { cn } from '@/styles/mobile-design-tokens'

interface SwipeAction {
  icon: ReactNode
  label: string
  color: 'red' | 'blue' | 'green' | 'yellow'
  onClick: () => void
}

interface SwipeableCardProps {
  children: ReactNode
  onSwipeLeft?: SwipeAction
  onSwipeRight?: SwipeAction
  className?: string
  disabled?: boolean
}

export default function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
  disabled = false,
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const swipeThreshold = 80

  const getActionColor = (color: 'red' | 'blue' | 'green' | 'yellow') => {
    switch (color) {
      case 'red':
        return 'bg-red-500'
      case 'blue':
        return 'bg-blue-500'
      case 'green':
        return 'bg-green-500'
      case 'yellow':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
    setIsSwiping(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current || disabled) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const deltaX = currentX - touchStartRef.current.x
    const deltaY = currentY - touchStartRef.current.y

    // Only allow horizontal swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()

      // Limit swipe distance
      const maxSwipe = 120
      const limitedDelta = Math.max(-maxSwipe, Math.min(maxSwipe, deltaX))

      // Only allow swipe in direction where action exists
      if ((limitedDelta < 0 && onSwipeLeft) || (limitedDelta > 0 && onSwipeRight)) {
        setTranslateX(limitedDelta)
      }
    }
  }

  const handleTouchEnd = () => {
    if (!touchStartRef.current || disabled) return

    // Execute action if swipe threshold is met
    if (translateX < -swipeThreshold && onSwipeLeft) {
      // Animate to fully revealed state
      setTranslateX(-120)
      setTimeout(() => {
        onSwipeLeft.onClick()
        resetCard()
      }, 200)
    } else if (translateX > swipeThreshold && onSwipeRight) {
      // Animate to fully revealed state
      setTranslateX(120)
      setTimeout(() => {
        onSwipeRight.onClick()
        resetCard()
      }, 200)
    } else {
      // Reset to original position
      resetCard()
    }

    touchStartRef.current = null
    setIsSwiping(false)
  }

  const resetCard = () => {
    setTranslateX(0)
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl', className)}>
      {/* Left action (revealed when swiping right) */}
      {onSwipeRight && (
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 flex items-center justify-start pl-6',
            getActionColor(onSwipeRight.color),
            'transition-opacity duration-200',
            translateX > 0 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width: '120px' }}
        >
          <div className="text-white flex flex-col items-center gap-1">
            {onSwipeRight.icon}
            <span className="text-xs font-medium">{onSwipeRight.label}</span>
          </div>
        </div>
      )}

      {/* Right action (revealed when swiping left) */}
      {onSwipeLeft && (
        <div
          className={cn(
            'absolute right-0 top-0 bottom-0 flex items-center justify-end pr-6',
            getActionColor(onSwipeLeft.color),
            'transition-opacity duration-200',
            translateX < 0 ? 'opacity-100' : 'opacity-0'
          )}
          style={{ width: '120px' }}
        >
          <div className="text-white flex flex-col items-center gap-1">
            {onSwipeLeft.icon}
            <span className="text-xs font-medium">{onSwipeLeft.label}</span>
          </div>
        </div>
      )}

      {/* Main card content */}
      <div
        className={cn(
          'relative bg-white',
          isSwiping ? 'transition-none' : 'transition-transform duration-300 ease-out'
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

// Pre-configured swipeable job card
interface SwipeableJobCardProps {
  children: ReactNode
  onDelete?: () => void
  onArchive?: () => void
  className?: string
}

export function SwipeableJobCard({
  children,
  onDelete,
  onArchive,
  className,
}: SwipeableJobCardProps) {
  const deleteAction: SwipeAction | undefined = onDelete ? {
    icon: <Trash2 size={20} />,
    label: 'Delete',
    color: 'red' as const,
    onClick: onDelete,
  } : undefined

  const archiveAction: SwipeAction | undefined = onArchive ? {
    icon: <Archive size={20} />,
    label: 'Archive',
    color: 'blue' as const,
    onClick: onArchive,
  } : undefined

  return (
    <SwipeableCard
      className={className}
      onSwipeLeft={deleteAction}
      onSwipeRight={archiveAction}
    >
      {children}
    </SwipeableCard>
  )
}

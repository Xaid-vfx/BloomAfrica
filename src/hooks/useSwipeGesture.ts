'use client'

import { useRef, useEffect, TouchEvent } from 'react'

export interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  minSwipeDistance?: number
  maxVerticalMovement?: number
}

interface TouchPosition {
  x: number
  y: number
  time: number
}

export default function useSwipeGesture(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
    maxVerticalMovement = 100,
  } = config

  const touchStartRef = useRef<TouchPosition | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    }

    const deltaX = touchEnd.x - touchStartRef.current.x
    const deltaY = touchEnd.y - touchStartRef.current.y
    const deltaTime = touchEnd.time - touchStartRef.current.time

    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // Reset touch start
    touchStartRef.current = null

    // Ignore if swipe was too slow (> 500ms)
    if (deltaTime > 500) return

    // Horizontal swipe
    if (absX > absY && absX > minSwipeDistance && absY < maxVerticalMovement) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    // Vertical swipe
    if (absY > absX && absY > minSwipeDistance) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown()
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp()
      }
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  }
}

// Hook for pull-to-refresh
export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)
  const pullDistanceRef = useRef<number>(0)
  const isRefreshingRef = useRef<boolean>(false)

  const threshold = 80 // Distance to trigger refresh

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let pullIndicator: HTMLDivElement | null = null

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0 && !isRefreshingRef.current) {
        startYRef.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startYRef.current === 0 || isRefreshingRef.current) return

      const currentY = e.touches[0].clientY
      const pullDistance = currentY - startYRef.current

      if (pullDistance > 0 && container.scrollTop === 0) {
        pullDistanceRef.current = pullDistance

        // Prevent default scroll
        e.preventDefault()

        // Create pull indicator if it doesn't exist
        if (!pullIndicator) {
          pullIndicator = document.createElement('div')
          pullIndicator.className = 'pull-to-refresh-indicator'
          pullIndicator.style.cssText = `
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            background: rgba(20, 184, 166, 0.1);
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 500;
            color: #14B8A6;
            transition: all 0.2s ease;
            pointer-events: none;
            z-index: 50;
          `
          container.style.position = 'relative'
          container.appendChild(pullIndicator)
        }

        // Update indicator
        const progress = Math.min(pullDistance / threshold, 1)
        pullIndicator.style.top = `${Math.min(pullDistance * 0.5, 40)}px`
        pullIndicator.style.opacity = `${progress}`
        pullIndicator.textContent = pullDistance > threshold ? '↓ Release to refresh' : '↓ Pull to refresh'
      }
    }

    const handleTouchEnd = async () => {
      if (pullDistanceRef.current > threshold && !isRefreshingRef.current) {
        isRefreshingRef.current = true

        if (pullIndicator) {
          pullIndicator.textContent = '↻ Refreshing...'
        }

        try {
          await onRefresh()
        } finally {
          isRefreshingRef.current = false
          if (pullIndicator) {
            pullIndicator.remove()
            pullIndicator = null
          }
        }
      } else if (pullIndicator) {
        pullIndicator.remove()
        pullIndicator = null
      }

      startYRef.current = 0
      pullDistanceRef.current = 0
    }

    container.addEventListener('touchstart', handleTouchStart as any)
    container.addEventListener('touchmove', handleTouchMove as any, { passive: false })
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart as any)
      container.removeEventListener('touchmove', handleTouchMove as any)
      container.removeEventListener('touchend', handleTouchEnd)
      if (pullIndicator) {
        pullIndicator.remove()
      }
    }
  }, [onRefresh, threshold])

  return containerRef
}

'use client'

import { useEffect, useRef } from 'react'

interface ScreenReaderAnnouncementProps {
  message: string
  politeness?: 'polite' | 'assertive'
  clearAfter?: number
}

/**
 * Component for announcing messages to screen readers
 */
export default function ScreenReaderAnnouncement({
  message,
  politeness = 'polite',
  clearAfter = 1000,
}: ScreenReaderAnnouncementProps) {
  const messageRef = useRef<string>('')

  useEffect(() => {
    if (message && message !== messageRef.current) {
      messageRef.current = message

      if (clearAfter) {
        const timer = setTimeout(() => {
          messageRef.current = ''
        }, clearAfter)

        return () => clearTimeout(timer)
      }
    }
  }, [message, clearAfter])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReaderAnnouncement() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', politeness)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return { announce }
}

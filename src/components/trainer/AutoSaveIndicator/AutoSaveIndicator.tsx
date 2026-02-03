'use client'

import { SaveStatus } from '@/hooks/useAutoSave'
import { Check, AlertCircle, Cloud, CloudOff } from 'lucide-react'
import { cn } from '@/styles/mobile-design-tokens'
import { DotsLoader } from '@/components/trainer/Loading'

interface AutoSaveIndicatorProps {
  status: SaveStatus
  lastSaved?: Date | null
  className?: string
  position?: 'fixed' | 'static'
}

export default function AutoSaveIndicator({
  status,
  lastSaved,
  className,
  position = 'fixed',
}: AutoSaveIndicatorProps) {
  const getStatusContent = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <DotsLoader className="text-blue-500 scale-75" />,
          text: 'Saving',
          color: 'text-blue-600 bg-blue-50/80 border-blue-100',
        }
      case 'saved':
        return {
          icon: <Check size={12} className="text-green-600" />,
          text: lastSaved ? formatTime(lastSaved) : 'Saved',
          color: 'text-green-600 bg-green-50/80 border-green-100',
        }
      case 'error':
        return {
          icon: <AlertCircle size={12} className="text-red-600" />,
          text: 'Failed',
          color: 'text-red-600 bg-red-50/80 border-red-100',
        }
      case 'idle':
      default:
        return lastSaved
          ? {
              icon: <Cloud size={12} className="text-gray-400" />,
              text: formatTime(lastSaved),
              color: 'text-gray-500 bg-gray-50/80 border-gray-100',
            }
          : {
              icon: <CloudOff size={12} className="text-gray-400" />,
              text: 'Draft',
              color: 'text-gray-400 bg-gray-50/80 border-gray-100',
            }
    }
  }

  const { icon, text, color } = getStatusContent()

  const positionClass = position === 'fixed'
    ? 'fixed top-4 right-4 lg:top-6 lg:right-6 z-40'
    : ''

  return (
    <div
      className={cn(
        positionClass,
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full border',
        'transition-all duration-200',
        color,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {icon}
      <span className="text-[10px] font-medium">{text}</span>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Compact version
export function CompactAutoSaveIndicator({
  status,
  className,
}: Pick<AutoSaveIndicatorProps, 'status' | 'className'>) {
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <DotsLoader className="text-blue-500" />
      case 'saved':
        return <Check size={14} className="text-green-600" />
      case 'error':
        return <AlertCircle size={14} className="text-red-600" />
      default:
        return <Cloud size={14} className="text-gray-500" />
    }
  }

  return (
    <div
      className={cn('inline-flex items-center', className)}
      role="status"
      aria-live="polite"
      aria-label={`Status: ${status}`}
    >
      {getIcon()}
    </div>
  )
}

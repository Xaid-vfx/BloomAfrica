'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  delay?: number
  enabled?: boolean
  key?: string
}

export default function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true,
  key,
}: UseAutoSaveOptions<T>) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const dataRef = useRef<T>(data)
  const isSavingRef = useRef(false)

  // Update data ref
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const saveNow = useCallback(async () => {
    if (isSavingRef.current || !enabled) return

    isSavingRef.current = true
    setStatus('saving')

    try {
      await onSave(dataRef.current)
      setStatus('saved')
      setLastSaved(new Date())

      // Reset to idle after showing "saved" for 1 second
      setTimeout(() => {
        setStatus('idle')
      }, 1000)
    } catch (error) {
      console.error('Auto-save error:', error)
      setStatus('error')

      // Reset error status after 3 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } finally {
      isSavingRef.current = false
    }
  }, [onSave, enabled])

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveNow()
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, enabled, saveNow])

  // Save on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Don't await here as component is unmounting
      if (enabled && !isSavingRef.current) {
        onSave(dataRef.current).catch(console.error)
      }
    }
  }, [enabled, onSave])

  return {
    status,
    lastSaved,
    saveNow,
    isSaving: status === 'saving',
  }
}

// Hook for localStorage auto-save
export function useLocalStorageAutoSave<T>(
  key: string,
  data: T,
  delay: number = 1000
) {
  const onSave = useCallback(
    async (dataToSave: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(dataToSave))
      } catch (error) {
        console.error('LocalStorage save error:', error)
        throw error
      }
    },
    [key]
  )

  return useAutoSave({
    data,
    onSave,
    delay,
    enabled: true,
    key,
  })
}

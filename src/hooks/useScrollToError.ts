'use client'

import { useEffect, useRef } from 'react'

interface UseScrollToErrorOptions {
  errors: Record<string, string | undefined>
  behavior?: ScrollBehavior
  block?: ScrollLogicalPosition
  offset?: number
}

export default function useScrollToError({
  errors,
  behavior = 'smooth',
  block = 'center',
  offset = 100,
}: UseScrollToErrorOptions) {
  const previousErrorsRef = useRef<Record<string, string | undefined>>({})

  useEffect(() => {
    const errorKeys = Object.keys(errors).filter(key => errors[key])
    const previousErrorKeys = Object.keys(previousErrorsRef.current).filter(
      key => previousErrorsRef.current[key]
    )

    // Only scroll if new errors appeared
    if (errorKeys.length > 0 && errorKeys.length > previousErrorKeys.length) {
      const firstErrorKey = errorKeys[0]
      scrollToError(firstErrorKey, { behavior, block, offset })
    }

    previousErrorsRef.current = errors
  }, [errors, behavior, block, offset])
}

// Utility function to scroll to a specific error field
export function scrollToError(
  fieldName: string,
  options: {
    behavior?: ScrollBehavior
    block?: ScrollLogicalPosition
    offset?: number
  } = {}
) {
  const { behavior = 'smooth', block = 'center', offset = 100 } = options

  // Try multiple selectors to find the field
  const selectors = [
    `[name="${fieldName}"]`,
    `#${fieldName}`,
    `[data-field="${fieldName}"]`,
    `[aria-label*="${fieldName}"]`,
  ]

  let element: HTMLElement | null = null

  for (const selector of selectors) {
    element = document.querySelector(selector)
    if (element) break
  }

  if (!element) {
    console.warn(`Could not find element for field: ${fieldName}`)
    return
  }

  // Calculate scroll position with offset
  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + window.pageYOffset
  const scrollToPosition = absoluteElementTop - offset

  // Scroll to element
  if (block === 'center' || block === 'nearest') {
    element.scrollIntoView({ behavior, block })
  } else {
    window.scrollTo({
      top: scrollToPosition,
      behavior,
    })
  }

  // Focus the element after scrolling (with a small delay)
  setTimeout(() => {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.focus()

      // Add shake animation to draw attention
      element.classList.add('animate-shake')
      setTimeout(() => {
        element?.classList.remove('animate-shake')
      }, 500)
    }
  }, 300)
}

// Utility to scroll to the first error in a form
export function scrollToFirstError(errors: Record<string, string | undefined>) {
  const firstErrorKey = Object.keys(errors).find(key => errors[key])
  if (firstErrorKey) {
    scrollToError(firstErrorKey)
  }
}

// Hook for form validation with auto-scroll
export function useFormValidation<T extends Record<string, any>>(
  validateFn: (values: T) => Record<string, string | undefined>
) {
  const validate = (values: T) => {
    const errors = validateFn(values)
    const hasErrors = Object.values(errors).some(error => error)

    if (hasErrors) {
      scrollToFirstError(errors)
    }

    return errors
  }

  return { validate }
}

/**
 * Accessibility Utilities
 *
 * Helper functions and utilities for improving accessibility
 * across the application.
 */

/**
 * Announces a message to screen readers
 */
export function announceToScreenReader(message: string, politeness: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', politeness)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Manages focus trap within a modal or dialog
 */
export class FocusTrap {
  private element: HTMLElement
  private previousFocus: HTMLElement | null = null
  private focusableElements: HTMLElement[] = []

  constructor(element: HTMLElement) {
    this.element = element
  }

  activate() {
    // Store currently focused element
    this.previousFocus = document.activeElement as HTMLElement

    // Get all focusable elements
    this.focusableElements = this.getFocusableElements()

    // Focus first element
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus()
    }

    // Add event listeners
    this.element.addEventListener('keydown', this.handleKeyDown)
  }

  deactivate() {
    // Remove event listeners
    this.element.removeEventListener('keydown', this.handleKeyDown)

    // Restore previous focus
    if (this.previousFocus) {
      this.previousFocus.focus()
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    return Array.from(this.element.querySelectorAll(selector))
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const firstElement = this.focusableElements[0]
    const lastElement = this.focusableElements[this.focusableElements.length - 1]

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }
}

/**
 * Generates a unique ID for accessibility attributes
 */
let idCounter = 0
export function generateId(prefix: string = 'id'): string {
  idCounter++
  return `${prefix}-${idCounter}-${Date.now()}`
}

/**
 * Checks if an element has sufficient color contrast
 */
export function hasGoodContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): boolean {
  // This is a simplified check. For production, use a proper contrast checker library
  const threshold = level === 'AAA' ? 7 : 4.5

  // Parse hex colors
  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)

  if (!fg || !bg) return false

  const fgLuminance = getLuminance(fg)
  const bgLuminance = getLuminance(bg)

  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)

  const contrast = (lighter + 0.05) / (darker + 0.05)

  return contrast >= threshold
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const normalized = val / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Keyboard navigation helper
 */
export function handleArrowKeyNavigation(
  e: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onChange: (newIndex: number) => void
) {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % items.length
      onChange(nextIndex)
      items[nextIndex]?.focus()
      break

    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      const prevIndex = (currentIndex - 1 + items.length) % items.length
      onChange(prevIndex)
      items[prevIndex]?.focus()
      break

    case 'Home':
      e.preventDefault()
      onChange(0)
      items[0]?.focus()
      break

    case 'End':
      e.preventDefault()
      const lastIndex = items.length - 1
      onChange(lastIndex)
      items[lastIndex]?.focus()
      break
  }
}

/**
 * Skip to main content functionality
 */
export function addSkipToMainContent() {
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#4640DE] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg'

  document.body.insertBefore(skipLink, document.body.firstChild)
}

/**
 * Ensures main content has proper landmark
 */
export function ensureMainLandmark() {
  let main = document.querySelector('main')

  if (!main) {
    main = document.createElement('main')
    main.id = 'main-content'

    const body = document.body
    while (body.firstChild) {
      main.appendChild(body.firstChild)
    }
    body.appendChild(main)
  } else if (!main.id) {
    main.id = 'main-content'
  }
}

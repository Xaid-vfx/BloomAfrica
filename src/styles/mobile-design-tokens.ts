/**
 * Mobile Design Tokens
 * Centralized design system for consistent mobile experience
 */

// Spacing Scale
export const spacing = {
  // Page padding - use these for consistent page layouts
  pagePadding: 'px-4 lg:px-8',
  sectionPadding: 'px-4 py-6 lg:px-6 lg:py-8',
  cardPadding: 'p-4 lg:p-6',

  // Gaps
  gapXs: 'gap-2',
  gapSm: 'gap-3',
  gapMd: 'gap-4',
  gapLg: 'gap-6',
  gapXl: 'gap-8',

  // Margins
  marginXs: 'mb-2',
  marginSm: 'mb-3',
  marginMd: 'mb-4',
  marginLg: 'mb-6',
  marginXl: 'mb-8',
}

// Typography Scale
export const typography = {
  // Headings
  h1: 'text-3xl lg:text-4xl font-bold text-gray-900',
  h2: 'text-2xl lg:text-3xl font-bold text-gray-900',
  h3: 'text-xl lg:text-2xl font-semibold text-gray-900',
  h4: 'text-lg lg:text-xl font-semibold text-gray-900',

  // Body text
  body: 'text-base text-gray-700',
  bodySmall: 'text-sm text-gray-600',
  bodyLarge: 'text-lg text-gray-700',

  // Labels and inputs - minimum 16px to prevent iOS zoom
  label: 'text-base font-medium text-gray-700',
  input: 'text-base text-gray-900',

  // Helper text
  helper: 'text-sm text-gray-500',
  error: 'text-sm text-red-600',
  success: 'text-sm text-green-600',

  // Misc
  caption: 'text-xs text-gray-500',
  link: 'text-base text-[#4640DE] hover:text-[#3730A3] underline',
}

// Touch Targets
export const touchTargets = {
  // Minimum touch target sizes (Apple HIG & Material Design: 44px)
  button: 'min-h-[44px] px-6 py-3',
  buttonSmall: 'min-h-[36px] px-4 py-2',
  buttonLarge: 'min-h-[52px] px-8 py-4',

  // Input fields
  input: 'min-h-[44px] px-4 py-3',
  textarea: 'min-h-[88px] px-4 py-3',

  // Icon buttons
  iconButton: 'w-11 h-11 min-w-[44px] min-h-[44px]',
  iconButtonSmall: 'w-9 h-9 min-w-[36px] min-h-[36px]',

  // Tab bar items
  tabItem: 'min-h-[56px] px-4',

  // List items
  listItem: 'min-h-[60px] px-4 py-3',
}

// Animations
export const animations = {
  // Durations
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',

  // Transitions
  transition: 'transition-all duration-200 ease-in-out',
  transitionFast: 'transition-all duration-150 ease-in-out',
  transitionSlow: 'transition-all duration-300 ease-in-out',

  // Specific transitions
  fadeIn: 'animate-in fade-in duration-200',
  fadeOut: 'animate-out fade-out duration-200',
  slideInBottom: 'animate-in slide-in-from-bottom duration-300',
  slideOutBottom: 'animate-out slide-out-to-bottom duration-300',

  // Custom animations - add to tailwind.config.ts
  shake: 'animate-shake',
  scaleIn: 'animate-scale-in',
  bounce: 'animate-bounce',
}

// Colors (using existing brand colors)
export const colors = {
  // Primary brand
  primary: '#4640DE',
  primaryHover: '#3730A3',
  primaryLight: '#E9EBFD',

  // Secondary/Accent
  accent: '#14B8A6',
  accentHover: '#0D9488',
  accentLight: '#14B8A6/10',

  // Status colors
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Neutrals
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',

  // Backgrounds
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F8F8FD',
  bgTertiary: '#F9FAFB',
}

// Border Radius
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full',
}

// Shadows
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  none: 'shadow-none',
}

// Z-index Scale
export const zIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  fixed: 'z-30',
  modalBackdrop: 'z-40',
  modal: 'z-50',
  popover: 'z-60',
  toast: 'z-70',
}

// Layout
export const layout = {
  // Container max widths
  containerSm: 'max-w-2xl mx-auto',
  containerMd: 'max-w-4xl mx-auto',
  containerLg: 'max-w-6xl mx-auto',
  containerXl: 'max-w-7xl mx-auto',

  // Common flex patterns
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',

  // Safe area padding (for notched phones)
  safeTop: 'pt-safe',
  safeBottom: 'pb-safe',
  safeX: 'px-safe',
  safeY: 'py-safe',
}

// Mobile-specific utilities
export const mobile = {
  // Hide on mobile
  hideOnMobile: 'hidden lg:block',

  // Show only on mobile
  showOnMobile: 'block lg:hidden',

  // Full width on mobile
  fullWidthOnMobile: 'w-full lg:w-auto',

  // Sticky mobile header
  stickyHeader: 'sticky top-0 z-20 bg-white border-b border-gray-200',

  // Bottom fixed (for FABs, bottom nav, etc.)
  bottomFixed: 'fixed bottom-0 left-0 right-0 z-30',

  // Overflow scroll with momentum (for iOS)
  scrollMomentum: 'overflow-y-auto -webkit-overflow-scrolling-touch',
}

// Form States
export const formStates = {
  default: 'border-gray-300 focus:border-[#4640DE] focus:ring-[#4640DE]',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed',
}

// Button Variants
export const buttonVariants = {
  primary: 'bg-[#4640DE] hover:bg-[#3730A3] text-white font-medium shadow-md hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none',

  accent: 'bg-[#14B8A6] hover:bg-[#0D9488] text-white font-medium shadow-md hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none',

  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 font-medium active:scale-95 disabled:bg-gray-100 disabled:cursor-not-allowed',

  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 font-medium active:scale-95 disabled:text-gray-400 disabled:cursor-not-allowed',

  danger: 'bg-red-600 hover:bg-red-700 text-white font-medium shadow-md hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none',
}

// Utility function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// Common component combinations
export const components = {
  // Card
  card: cn(borderRadius.lg, shadows.md, 'bg-white border border-gray-100'),

  // Input wrapper
  inputWrapper: cn(spacing.marginMd, 'w-full'),

  // Form section
  formSection: cn(spacing.sectionPadding, spacing.marginLg, 'bg-gray-50', borderRadius.lg),

  // Page container
  pageContainer: cn(spacing.pagePadding, 'min-h-screen bg-gray-50'),

  // Modal backdrop
  modalBackdrop: 'fixed inset-0 bg-black/50 backdrop-blur-sm',

  // Toast
  toast: cn(borderRadius.md, shadows.lg, 'px-4 py-3 bg-white border border-gray-200'),
}

export default {
  spacing,
  typography,
  touchTargets,
  animations,
  colors,
  borderRadius,
  shadows,
  zIndex,
  layout,
  mobile,
  formStates,
  buttonVariants,
  cn,
  components,
}

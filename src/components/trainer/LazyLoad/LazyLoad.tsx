'use client'

import { ReactNode, Suspense, lazy as reactLazy } from 'react'
import PageLoader from '@/components/trainer/Loading/PageLoader'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
  minHeight?: string
}

/**
 * Wrapper for lazy-loaded components
 */
export default function LazyLoad({
  children,
  fallback,
  minHeight = '200px',
}: LazyLoadProps) {
  const defaultFallback = (
    <div style={{ minHeight }} className="flex items-center justify-center">
      <PageLoader fullScreen={false} message="Loading component..." />
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

/**
 * Helper function to lazy load a component
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  const LazyComponent = reactLazy(importFn)

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <LazyLoad fallback={fallback}>
        <LazyComponent {...props} />
      </LazyLoad>
    )
  }
}

/**
 * Image lazy loading component
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholderSrc?: string
  className?: string
}

export function LazyImage({
  src,
  alt,
  placeholderSrc,
  className,
  ...props
}: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      {...props}
      onError={(e) => {
        if (placeholderSrc) {
          (e.target as HTMLImageElement).src = placeholderSrc
        }
      }}
    />
  )
}

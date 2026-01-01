'use client'

import Skeleton, { SkeletonInput, SkeletonButton } from './Skeleton'
import { spacing } from '@/styles/mobile-design-tokens'

export default function OnboardingSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Progress bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <Skeleton variant="text" height={16} width={120} className="mb-2" />
          <Skeleton variant="rectangular" height={8} />
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 overflow-y-auto">
        <div className={`max-w-3xl mx-auto ${spacing.pagePadding} py-8`}>
          {/* Section title */}
          <div className="mb-8">
            <Skeleton variant="text" height={28} width="60%" className="mb-2" />
            <Skeleton variant="text" height={16} width="80%" />
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            <SkeletonInput />
            <SkeletonInput />
            <SkeletonInput />

            {/* Two columns on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkeletonInput />
              <SkeletonInput />
            </div>

            <SkeletonInput />

            {/* File upload area */}
            <div>
              <Skeleton variant="text" height={16} width="30%" className="mb-2" />
              <Skeleton variant="rectangular" height={120} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between gap-4">
          <SkeletonButton className="w-32" />
          <SkeletonButton className="flex-1 max-w-xs" />
        </div>
      </div>
    </div>
  )
}

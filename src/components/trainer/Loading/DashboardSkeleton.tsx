'use client'

import Skeleton, { SkeletonCard, SkeletonText } from './Skeleton'
import { spacing } from '@/styles/mobile-design-tokens'

export default function DashboardSkeleton() {
  return (
    <div className={spacing.pagePadding}>
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
            <Skeleton variant="text" height={14} width="40%" className="mb-2" />
            <Skeleton variant="text" height={32} width="60%" className="mb-1" />
            <Skeleton variant="text" height={12} width="50%" />
          </div>
        ))}
      </div>

      {/* Section header */}
      <div className="mb-4">
        <Skeleton variant="text" height={24} width={200} className="mb-2" />
        <Skeleton variant="text" height={16} width={300} />
      </div>

      {/* Job cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

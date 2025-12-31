'use client'

import { ChevronLeft, ChevronRight, CheckCircle2, Send } from 'lucide-react'

interface SectionNavigationProps {
  currentSection: number
  totalSections: number
  completedSections: number[]
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  canGoNext: boolean
  isSubmitting: boolean
  sectionTitles: string[]
  showBreadcrumbs?: boolean
}

export default function SectionNavigation({
  currentSection,
  totalSections,
  completedSections,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  isSubmitting,
  sectionTitles,
  showBreadcrumbs = true
}: SectionNavigationProps) {
  const progress = (currentSection / totalSections) * 100
  const isLastSection = currentSection === totalSections
  const isFirstSection = currentSection === 1

  return (
    <div className="space-y-4">
      {/* Conditionally render progress bar and breadcrumbs */}
      {showBreadcrumbs && (
        <>
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">
                Section {currentSection} of {totalSections}
              </p>
              <p className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </p>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#14B8A6] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Section Breadcrumbs */}
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {sectionTitles.map((title, index) => {
              const sectionNum = index + 1
              const isCurrent = sectionNum === currentSection
              const isCompleted = completedSections.includes(sectionNum)
              const isPast = sectionNum < currentSection

              return (
                <div
                  key={sectionNum}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg
                    transition-all cursor-default
                    ${isCurrent
                      ? 'bg-[#14B8A6] text-white shadow-md'
                      : isCompleted || isPast
                        ? 'bg-[#14B8A6]/10 text-[#14B8A6]'
                        : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <span className={`
                      flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                      ${isCurrent ? 'bg-white/20' : ''}
                    `}>
                      {sectionNum}
                    </span>
                  )}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {title}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between ">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstSection}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium
            transition-all
            ${isFirstSection
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }
          `}
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        {/* Next or Submit Button */}
        {isLastSection ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`
              flex items-center gap-2 px-8 py-2.5 rounded-lg font-medium
              transition-all
              ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#14B8A6] hover:bg-[#0D9488] shadow-md hover:shadow-lg'
              }
              text-white
            `}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                Submit Profile
                <Send size={18} />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium
              transition-all
              ${!canGoNext
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-md hover:shadow-lg'
              }
            `}
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Helper Text */}
      {!canGoNext && !isLastSection && (
        <p className="text-sm text-gray-500 text-center">
          Please complete all required fields to continue
        </p>
      )}
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Building2, Wrench, ArrowRight, CheckCircle } from 'lucide-react'

interface ApprenticeshipTypeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ApprenticeshipTypeModal({ isOpen, onClose }: ApprenticeshipTypeModalProps) {
  const router = useRouter()

  const handleChoice = (type: 'artisan' | 'company') => {
    onClose()
    // For now, both redirect to /all-trainings
    // Future: route to different pages based on type
    router.push('/all-trainings')
  }

  const artisanBullets = [
    "You want to start your own business",
    "You're looking to be your own boss",
    "You want to master a skilled trade"
  ]

  const companyBullets = [
    "You want employment after training",
    "You want to work in an  company",
    "You're seeking a stable career path"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[700px] my-4 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-2xl p-3 sm:p-6">
        <DialogHeader className="pb-2 sm:pb-6">
          <DialogTitle className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-center">
            Choose Your Path
          </DialogTitle>
          <DialogDescription className="hidden sm:block text-base text-gray-600 text-center mt-3">
            Select the apprenticeship type that matches your career goals
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          {/* Artisan Apprenticeship Card */}
          <button
            onClick={() => handleChoice('artisan')}
            className="group flex flex-col items-center sm:items-start p-3 sm:p-6 bg-white hover:bg-gradient-to-br hover:from-[#14B8A6]/5 hover:to-[#14B8A6]/10 rounded-xl sm:rounded-2xl transition-all border-2 border-gray-200 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/10"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 border border-[#14B8A6]/20 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5 sm:w-8 sm:h-8 text-[#14B8A6]" strokeWidth={2.5} />
            </div>

            <h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900 text-center sm:text-left">Learn with an Artisan</h3>

            <div className="mb-2 sm:mb-4 flex-grow w-full">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-3 text-center sm:text-left">
                This is for you if:
              </h4>
              <ul className="space-y-1.5 sm:space-y-3 flex flex-col items-center sm:items-start">
                {artisanBullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-1.5 sm:gap-3">
                    <CheckCircle className="text-[#10B981] flex-shrink-0 mt-0.5 w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm text-gray-700 leading-snug sm:leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[#14B8A6] font-semibold text-xs sm:text-sm mt-auto group-hover:gap-3 transition-all">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </button>

          {/* Company Apprenticeship Card */}
          <button
            onClick={() => handleChoice('company')}
            className="group flex flex-col items-center sm:items-start p-3 sm:p-6 bg-white hover:bg-gradient-to-br hover:from-[#14B8A6]/5 hover:to-[#14B8A6]/10 rounded-xl sm:rounded-2xl transition-all border-2 border-gray-200 hover:border-[#14B8A6] hover:shadow-lg hover:shadow-[#14B8A6]/10"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#14B8A6]/10 to-[#14B8A6]/5 border border-[#14B8A6]/20 flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5 sm:w-8 sm:h-8 text-[#14B8A6]" strokeWidth={2.5} />
            </div>

            <h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900 text-center sm:text-left">Learn in a Company</h3>

            <div className="mb-2 sm:mb-4 flex-grow w-full">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-3 text-center sm:text-left">
                This is for you if:
              </h4>
              <ul className="space-y-1.5 sm:space-y-3 flex flex-col items-center sm:items-start">
                {companyBullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-1.5 sm:gap-3">
                    <CheckCircle className="text-[#10B981] flex-shrink-0 mt-0.5 w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
                    <span className="text-xs sm:text-sm text-gray-700 leading-snug sm:leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[#14B8A6] font-semibold text-xs sm:text-sm mt-auto group-hover:gap-3 transition-all">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

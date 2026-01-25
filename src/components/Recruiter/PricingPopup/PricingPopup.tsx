'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { CreditCard, Check, Sparkles, Clock, Shield } from 'lucide-react'
import { PricingBreakdown, formatNaira } from '@/lib/pricing/calculateSubscription'
import { toast } from 'sonner'

interface PricingPopupProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: () => void
  pricing: PricingBreakdown
  isProcessing?: boolean
}

export default function PricingPopup({
  isOpen,
  onClose,
  onPaymentSuccess,
  pricing,
  isProcessing = false
}: PricingPopupProps) {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)

  const handlePayNow = async () => {
    setIsPaymentProcessing(true)

    // Mock payment flow (Paystack has bugs - frontend only for now)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success('Payment successful! Welcome to Prentis.')
      onPaymentSuccess()
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  const handlePayLater = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[85vh] overflow-y-auto !bg-white dark:!bg-white rounded-2xl p-4 sm:p-6 dark:border-gray-200">
        <DialogHeader className="space-y-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] p-2.5 rounded-xl flex-shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-bold text-[#0A1F44] dark:text-[#0A1F44]">
                Your Subscription
              </DialogTitle>
              <DialogDescription className="!text-gray-500 dark:!text-gray-500 text-sm">
                Monthly plan based on your profile
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Pricing Breakdown Card */}
        <div className="!bg-gray-50 dark:!bg-gray-50 rounded-xl p-4 space-y-3 border !border-gray-200 dark:!border-gray-200">
          {/* Base Tier */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#14B8A6] flex-shrink-0" />
              <span className="!text-gray-800 dark:!text-gray-800 font-medium text-sm sm:text-base">
                {pricing.baseTier.name} Tier
              </span>
            </div>
            <span className="font-semibold !text-[#0A1F44] dark:!text-[#0A1F44] text-sm sm:text-base">
              {formatNaira(pricing.baseTier.amount)}
            </span>
          </div>

          {/* Add-ons */}
          {pricing.addOns.length > 0 && (
            <>
              <div className="border-t !border-gray-300 dark:!border-gray-300" />
              {pricing.addOns.map((addon, index) => (
                <div key={index} className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Check className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
                    <span className="!text-gray-700 dark:!text-gray-700 text-xs sm:text-sm truncate">{addon.name}</span>
                  </div>
                  <span className="font-medium !text-[#0A1F44] dark:!text-[#0A1F44] text-sm whitespace-nowrap">
                    +{formatNaira(addon.amount)}
                  </span>
                </div>
              ))}
            </>
          )}

          {/* Industry Multiplier (only show if not 1.0) */}
          {pricing.industryMultiplier.multiplier !== 1.0 && (
            <>
              <div className="border-t !border-gray-300 dark:!border-gray-300" />
              <div className="flex justify-between items-center">
                <span className="!text-gray-700 dark:!text-gray-700 text-xs sm:text-sm">
                  {pricing.industryMultiplier.industry} Industry
                </span>
                <span className="font-medium !text-amber-600 dark:!text-amber-600 text-sm">
                  x{pricing.industryMultiplier.multiplier.toFixed(2)}
                </span>
              </div>
            </>
          )}

          {/* Total */}
          <div className="border-t-2 !border-[#14B8A6] pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-bold !text-[#0A1F44] dark:!text-[#0A1F44]">Monthly Total</span>
              <span className="text-xl sm:text-2xl font-bold !text-[#14B8A6] dark:!text-[#14B8A6]">
                {formatNaira(pricing.total)}
              </span>
            </div>
            <p className="text-xs !text-gray-500 dark:!text-gray-500 mt-1">Billed monthly. Cancel anytime.</p>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2 py-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm !text-gray-700 dark:!text-gray-700">
            <Shield className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
            <span>Access to all platform features</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm !text-gray-700 dark:!text-gray-700">
            <CreditCard className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
            <span>Secure payment via Paystack</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePayNow}
            disabled={isPaymentProcessing || isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-semibold transition-colors shadow-lg shadow-[#14B8A6]/30 disabled:shadow-none text-sm sm:text-base"
          >
            {isPaymentProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay Now</span>
              </>
            )}
          </button>

          <button
            onClick={handlePayLater}
            disabled={isPaymentProcessing || isProcessing}
            className="w-full flex items-center justify-center gap-2 !text-gray-700 dark:!text-gray-700 hover:!text-gray-900 dark:hover:!text-gray-900 py-2.5 font-medium transition-colors disabled:opacity-50 text-sm"
          >
            <Clock className="w-4 h-4" />
            <span>Pay Later</span>
          </button>

          <p className="text-xs text-center !text-gray-500 dark:!text-gray-500">
            You can complete payment from your dashboard anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { CreditCard, AlertTriangle, X } from 'lucide-react'
import { formatNaira } from '@/lib/pricing/calculateSubscription'
import { useRecruiter } from '@/context/RecruiterContext'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function PendingPaymentBanner() {
  const { subscription, subscriptionStatus, user } = useRecruiter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Don't show if no pending subscription or already dismissed
  if (subscriptionStatus !== 'pending' || !subscription || isDismissed) {
    return null
  }

  const handlePayNow = async () => {
    setIsProcessing(true)

    try {
      // Mock payment flow (Paystack has bugs - frontend only for now)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update subscription status
      try {
        await supabase
          .from('TrainerSubscriptions')
          .update({
            status: 'active',
            paid_at: new Date().toISOString(),
            payment_reference: `mock_${Date.now()}`,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          })
          .eq('user_id', user.id)
      } catch (error) {
        // Update localStorage for local mode
        const subscriptionData = localStorage.getItem(`trainer_subscription_${user.id}`)
        if (subscriptionData) {
          const data = JSON.parse(subscriptionData)
          data.status = 'active'
          data.paid_at = new Date().toISOString()
          data.payment_reference = `mock_${Date.now()}`
          localStorage.setItem(`trainer_subscription_${user.id}`, JSON.stringify(data))
        }
      }

      toast.success('Payment successful! All features are now unlocked.')
      router.refresh()
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div data-payment-banner className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 md:p-6 mb-6">
      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 text-amber-600 hover:text-amber-800 transition-colors"
        aria-label="Dismiss"
      >
        <X size={18} />
      </button>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Icon and Message */}
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-shrink-0 bg-amber-100 p-2.5 rounded-xl">
            <CreditCard className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold text-amber-900">Complete Your Subscription</h3>
            </div>
            <p className="text-sm text-amber-700">
              Unlock all features by completing your subscription payment.
              Some features are restricted until payment is confirmed.
            </p>
          </div>
        </div>

        {/* Amount and CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          <div className="text-right">
            <p className="text-xs text-amber-600 font-medium">Amount Due</p>
            <p className="text-xl font-bold text-amber-900">
              {formatNaira(subscription.total_amount)}<span className="text-sm font-normal">/mo</span>
            </p>
          </div>

          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] disabled:bg-gray-300 text-white py-2.5 px-5 rounded-xl font-semibold transition-colors shadow-md shadow-[#14B8A6]/30 disabled:shadow-none whitespace-nowrap"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

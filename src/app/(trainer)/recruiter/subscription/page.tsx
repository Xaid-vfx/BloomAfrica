'use client'

import { useRecruiter } from "@/context/RecruiterContext"
import { useRouter } from "next/navigation"
import {
    Crown,
    Sparkles,
    Check,
    X,
    ArrowLeft,
    CreditCard,
    Calendar,
    Building2,
    GraduationCap,
    Users,
    Award,
    Briefcase,
    BookOpen,
    ExternalLink,
    Loader2
} from "lucide-react"
import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export default function SubscriptionPage() {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const { subscription, hasActiveSubscription, user, trainerProfile } = useRecruiter()
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)

    const handlePayNow = async () => {
        setIsProcessingPayment(true)
        try {
            // Mock payment flow
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
            } catch {
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

            toast.success('Payment successful! Your subscription is now active.')
            router.refresh()
        } catch {
            toast.error('Payment failed. Please try again.')
        } finally {
            setIsProcessingPayment(false)
        }
    }

    const tier = subscription?.base_tier || 'Artisan'
    const isCorporate = tier === 'Corporate'

    // Features based on tier
    const baseFeatures = isCorporate
        ? [
            { name: 'Unlimited active apprenticeship listings', included: true },
            { name: 'Priority support', included: true },
            { name: 'Featured listings in search results', included: true },
            { name: 'Advanced analytics dashboard', included: true },
            { name: 'Bulk apprentice management tools', included: true },
        ]
        : [
            { name: 'Up to 5 active apprenticeship listings', included: true },
            { name: 'Basic support', included: true },
            { name: 'Standard listing visibility', included: true },
            { name: 'Basic analytics', included: true },
        ]

    const addOns = [
        {
            name: 'Prentis Teaching Team',
            description: 'Access to certified instructors to support your training programs',
            included: (subscription?.teaching_team_amount || 0) > 0,
            icon: Users,
            amount: subscription?.teaching_team_amount || 0
        },
        {
            name: 'Prentis Accreditation',
            description: 'Official Prentis certification for your programs and graduates',
            included: (subscription?.accreditation_amount || 0) > 0,
            icon: Award,
            amount: subscription?.accreditation_amount || 0
        },
        {
            name: 'Direct Hire Pipeline',
            description: 'Connect apprentices directly with hiring partners after completion',
            included: (subscription?.direct_hire_amount || 0) > 0,
            icon: Briefcase,
            amount: subscription?.direct_hire_amount || 0
        },
    ]

    if (!subscription) {
        return (
            <div className="relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#14B8A6]" />
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-6 lg:p-8 border-b border-gray-100">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#0A1F44] mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44] mb-2">
                    My Subscription
                </h1>
                <p className="text-gray-600">
                    Manage your subscription plan and view your included features
                </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6 lg:p-8">
                {/* Current Plan Card */}
                <div className={`rounded-2xl p-6 mb-6 ${
                    isCorporate
                        ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200'
                        : 'bg-gradient-to-br from-[#14B8A6]/10 to-[#0D9488]/10 border-2 border-[#14B8A6]/20'
                }`}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                                isCorporate
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                                    : 'bg-gradient-to-br from-[#14B8A6] to-[#0D9488]'
                            }`}>
                                {isCorporate ? (
                                    <Crown className="h-8 w-8 text-white" />
                                ) : (
                                    <Sparkles className="h-8 w-8 text-white" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#0A1F44]">
                                    {tier} Plan
                                </h2>
                                <p className="text-gray-600">
                                    {isCorporate
                                        ? 'Full access to all platform features'
                                        : 'Essential features for growing trainers'}
                                </p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            hasActiveSubscription
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                        }`}>
                            {hasActiveSubscription ? 'Active' : 'Pending Payment'}
                        </div>
                    </div>

                    <div className="flex items-end gap-2 mb-4">
                        <span className="text-4xl font-bold text-[#0A1F44]">
                            ₦{(subscription.total_amount || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-500 mb-1">/month</span>
                    </div>

                    {!hasActiveSubscription && (
                        <button
                            onClick={handlePayNow}
                            disabled={isProcessingPayment}
                            className="w-full bg-[#14B8A6] hover:bg-[#0D9488] disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                            {isProcessingPayment ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Pay Now
                                </>
                            )}
                        </button>
                    )}

                    {hasActiveSubscription && subscription.expires_at && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>
                                Renews on {new Date(subscription.expires_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-[#0A1F44] mb-4">Cost Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-600">Base Plan ({tier})</span>
                            <span className="font-medium">₦{(subscription.base_amount || 0).toLocaleString()}</span>
                        </div>
                        {(subscription.teaching_team_amount || 0) > 0 && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Prentis Teaching Team</span>
                                <span className="font-medium">₦{subscription.teaching_team_amount.toLocaleString()}</span>
                            </div>
                        )}
                        {(subscription.accreditation_amount || 0) > 0 && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Prentis Accreditation</span>
                                <span className="font-medium">₦{subscription.accreditation_amount.toLocaleString()}</span>
                            </div>
                        )}
                        {(subscription.direct_hire_amount || 0) > 0 && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Direct Hire Pipeline</span>
                                <span className="font-medium">₦{subscription.direct_hire_amount.toLocaleString()}</span>
                            </div>
                        )}
                        {(subscription.industry_multiplier || 1) !== 1 && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">
                                    Industry Adjustment{trainerProfile?.primary_industry ? ` (${trainerProfile.primary_industry})` : ''}
                                </span>
                                <span className="font-medium">{subscription.industry_multiplier.toFixed(1)}x</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between pt-2 text-lg font-semibold">
                            <span className="text-[#0A1F44]">Total Monthly</span>
                            <span className="text-[#14B8A6]">₦{(subscription.total_amount || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Base Features */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg ${
                            isCorporate ? 'bg-amber-100' : 'bg-[#14B8A6]/10'
                        }`}>
                            <Building2 className={`h-5 w-5 ${
                                isCorporate ? 'text-amber-600' : 'text-[#14B8A6]'
                            }`} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#0A1F44]">
                            {tier} Plan Features
                        </h3>
                    </div>
                    <div className="space-y-3">
                        {baseFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check size={12} className="text-green-600" />
                                </div>
                                <span className="text-gray-700">{feature.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add-Ons */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-[#0A1F44] mb-4">Add-On Services</h3>
                    <div className="space-y-4">
                        {addOns.map((addon, index) => {
                            const Icon = addon.icon
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-4 p-4 rounded-xl ${
                                        addon.included
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${
                                        addon.included ? 'bg-green-100' : 'bg-gray-200'
                                    }`}>
                                        <Icon className={`h-5 w-5 ${
                                            addon.included ? 'text-green-600' : 'text-gray-400'
                                        }`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`font-medium ${
                                                addon.included ? 'text-[#0A1F44]' : 'text-gray-500'
                                            }`}>
                                                {addon.name}
                                            </h4>
                                            {addon.included ? (
                                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                    Included
                                                </span>
                                            ) : (
                                                <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                                    Not Included
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm mt-1 ${
                                            addon.included ? 'text-gray-600' : 'text-gray-400'
                                        }`}>
                                            {addon.description}
                                        </p>
                                        {addon.included && addon.amount > 0 && (
                                            <p className="text-sm text-green-600 font-medium mt-1">
                                                ₦{addon.amount.toLocaleString()}/month
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-[#0A1F44] mb-2">
                        Need to Change Your Plan?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Contact our support team to upgrade your plan, add new features, or make changes to your subscription.
                    </p>
                    <button className="inline-flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0D9488] font-medium">
                        Contact Support
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

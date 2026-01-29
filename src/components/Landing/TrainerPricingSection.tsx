'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'

type PricingTier = {
    name: string
    price: string
    period: string
    description: string
    features: string[]
    highlighted?: boolean
    ctaText: string
    ctaLink: string
}

const pricingTiers: PricingTier[] = [
    {
        name: 'Artisan',
        price: 'From ₦10,000',
        period: '/month',
        description: 'For individual artisans and small businesses',
        features: [
            'List your training programs',
            'Manage apprentice applications',
            'In-app messaging with apprentices',
            'Payment processing & tracking',
            'Basic analytics dashboard',
            'Optional: Prentis teaching support',
            'Optional: Prentis accreditation',
        ],
        ctaText: 'Get Started',
        ctaLink: '/signup?type=recruiter',
    },
    {
        name: 'Corporate',
        price: 'From ₦50,000',
        period: '/month',
        description: 'For companies and training institutions',
        features: [
            'Everything in Artisan, plus:',
            'Priority listing placement',
            'Advanced analytics & reporting',
            'Bulk apprentice management',
            'Dedicated account support',
            'Custom branding options',
            'HND/ND certification pathway support',
        ],
        highlighted: true,
        ctaText: 'Get Started',
        ctaLink: '/signup?type=recruiter',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large institutions and government programs',
        features: [
            'Everything in Corporate, plus:',
            'Unlimited trainer accounts',
            'White-label platform options',
            'API access & integrations',
            'Dedicated account manager',
            'Custom reporting & analytics',
            'On-site onboarding & training',
        ],
        ctaText: 'Contact Sales',
        ctaLink: '/contact?type=enterprise',
    },
]

export default function TrainerPricingSection() {
    return (
        <section className="bg-white py-6 px-4 md:py-8 md:px-6">
            <div className="py-16 lg:py-24 px-6 lg:px-12 relative overflow-hidden bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] rounded-3xl">
                <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-white/70 text-base lg:text-lg max-w-2xl mx-auto">
                            Choose the plan that fits your training business. Customize with add-ons during onboarding.
                        </p>
                    </div>

                {/* Pricing Cards */}
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {pricingTiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`relative rounded-2xl p-6 lg:p-8 ${
                                    tier.highlighted
                                        ? 'bg-[#14B8A6]/10 border-2 border-[#14B8A6]'
                                        : 'bg-white/5 border border-white/10'
                                } backdrop-blur-sm`}
                            >
                                {tier.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-[#14B8A6] text-white text-xs font-semibold px-4 py-1 rounded-full">
                                            Popular
                                        </span>
                                    </div>
                                )}

                                {/* Tier Name */}
                                <h3 className="text-lg font-semibold mb-2 text-white">
                                    {tier.name}
                                </h3>

                                {/* Price */}
                                <div className="mb-4">
                                    <span className="text-2xl lg:text-3xl font-bold text-white">
                                        {tier.price}
                                    </span>
                                    <span className="text-sm text-white/70">
                                        {tier.period}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm mb-6 text-white/70">
                                    {tier.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <Check
                                                size={18}
                                                className="flex-shrink-0 mt-0.5 text-[#14B8A6]"
                                            />
                                            <span className="text-sm text-white/80">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Link
                                    href={tier.ctaLink}
                                    className={`block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all ${
                                        tier.highlighted
                                            ? 'bg-[#14B8A6] text-white hover:bg-[#0D9488]'
                                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                                    }`}
                                >
                                    {tier.ctaText}
                                </Link>
                            </div>
                        ))}
                    </div>

                {/* Bottom Note */}
                    <div className="text-center mt-10 lg:mt-14 space-y-2">
                        <p className="text-white/70 text-sm">
                            Final pricing depends on your industry and selected add-ons.
                        </p>
                        <p className="text-white/50 text-sm">
                            Add-ons include: Prentis teaching team, accreditation support, curriculum packages, and direct hire access.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

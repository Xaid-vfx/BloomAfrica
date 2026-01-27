'use client'

import { useState } from 'react'
import { Hammer, Building2, Wallet, Clock, Award, ShieldCheck } from 'lucide-react'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import PathDeepDive from '@/components/ExplorePaths/PathDeepDive'
import Link from 'next/link'

export default function HowItWorksPage() {
    const [activeTab, setActiveTab] = useState<'artisan' | 'company'>('artisan')

    const artisanData = {
        variant: 'artisan' as const,
        title: 'Artisan Path',
        subtitle: 'Master a Trade, Build Your Future',
        icon: <Hammer size={40} />,
        whatYouExperience: [
            "Work directly alongside a master craftsperson in their workshop",
            "Learn traditional techniques passed down through generations",
            "Gain hands-on experience with real projects and clients",
            "Develop business skills to eventually run your own practice",
            "Build a portfolio of completed work to showcase your abilities",
            "Join a community of skilled artisans and tradespeople"
        ],
        typicalDay: [
            "Morning briefing with your mentor about the day's projects",
            "Hands-on practice of techniques under direct supervision",
            "Working on client projects with increasing responsibility",
            "Learning about materials, tools, and quality standards",
            "End-of-day review and feedback on your progress"
        ],
        steps: [
            {
                number: 1,
                title: "Apply & Match",
                description: "Browse artisan programs, submit your application, and get matched with a master craftsperson in your chosen trade."
            },
            {
                number: 2,
                title: "Learn the Fundamentals",
                description: "Start with basic techniques and safety practices. Build a strong foundation under your mentor's guidance."
            },
            {
                number: 3,
                title: "Develop Mastery",
                description: "Take on increasingly complex projects. Refine your skills and develop your unique style and approach."
            },
            {
                number: 4,
                title: "Launch Your Business",
                description: "Graduate with the skills, confidence, and network to start your own practice or join an established workshop."
            }
        ]
    }

    const companyData = {
        variant: 'company' as const,
        title: 'Company Path',
        subtitle: 'Build Skills, Launch Your Career',
        icon: <Building2 size={40} />,
        whatYouExperience: [
            "Train inside real companies with professional standards",
            "Work with experienced teams on actual business projects",
            "Learn modern tools, systems, and industry best practices",
            "Develop soft skills like communication and teamwork",
            "Get exposure to different departments and roles",
            "Build professional references and network connections"
        ],
        typicalDay: [
            "Team standup meeting to align on priorities",
            "Structured training modules and skill-building sessions",
            "Collaborative work on team projects with guidance",
            "One-on-one mentorship sessions with your supervisor",
            "End-of-day reflection and planning for tomorrow"
        ],
        steps: [
            {
                number: 1,
                title: "Apply & Get Accepted",
                description: "Browse company programs, complete assessments, and interview with companies looking for trainees like you."
            },
            {
                number: 2,
                title: "Onboard & Orient",
                description: "Learn about the company, meet your team, and understand your role. Get set up with all the tools you need."
            },
            {
                number: 3,
                title: "Train & Contribute",
                description: "Follow a structured curriculum while contributing to real projects. Receive regular feedback and coaching."
            },
            {
                number: 4,
                title: "Get Hired",
                description: "Complete your training with skills and experience employers value. Many trainees receive full-time offers from their host company."
            }
        ]
    }

    return (
        <main className="flex flex-col w-full">
            <Navbar color="light" />

            {/* Hero + Tab Section - Unified background */}
            <section className="bg-gradient-to-br from-[#0A1F44] to-[#0F2B54]">
                {/* Hero Title */}
                <div className="pt-14 lg:pt-20 pb-8 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Which Path is Right for You
                        </h1>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="grid grid-cols-2 px-3 pt-2 gap-6 md:px-5 md:gap-10">
                        {/* Artisan Tab - Left Half */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('artisan')}
                            className={`relative rounded-t-2xl md:rounded-t-3xl flex items-center justify-center gap-2 md:gap-3 py-3 md:py-5 font-semibold text-sm md:text-lg transition-all cursor-pointer ${
                                activeTab === 'artisan'
                                    ? 'bg-[#e8faf8] text-[#14B8A6]'
                                    : 'bg-white/20 text-white/70 hover:text-white hover:bg-white/30'
                            }`}
                        >
                            {activeTab === 'artisan' && (
                                <>
                                    {/* Left flare */}
                                    <span className="absolute -left-6 bottom-0 w-6 h-6 bg-[#e8faf8] pointer-events-none">
                                        <span className="absolute inset-0 bg-[#0F2B54] rounded-br-full" />
                                    </span>
                                    {/* Right flare */}
                                    <span className="absolute -right-6 bottom-0 w-6 h-6 bg-[#e8faf8] pointer-events-none">
                                        <span className="absolute inset-0 bg-[#0F2B54] rounded-bl-full" />
                                    </span>
                                </>
                            )}
                            <Hammer className="w-5 h-5 md:w-6 md:h-6" />
                            Artisan Path
                        </button>

                        {/* Company Tab - Right Half */}
                        <button
                            type="button"
                            onClick={() => setActiveTab('company')}
                            className={`relative rounded-t-2xl md:rounded-t-3xl flex items-center justify-center gap-2 md:gap-3 py-3 md:py-5 font-semibold text-sm md:text-lg transition-all cursor-pointer ${
                                activeTab === 'company'
                                    ? 'bg-[#e8eaef] text-[#0A1F44]'
                                    : 'bg-white/20 text-white/70 hover:text-white hover:bg-white/30'
                            }`}
                        >
                            {activeTab === 'company' && (
                                <>
                                    {/* Left flare */}
                                    <span className="absolute -left-6 bottom-0 w-6 h-6 bg-[#e8eaef] pointer-events-none">
                                        <span className="absolute inset-0 bg-[#0F2B54] rounded-br-full" />
                                    </span>
                                    {/* Right flare */}
                                    <span className="absolute -right-6 bottom-0 w-6 h-6 bg-[#e8eaef] pointer-events-none">
                                        <span className="absolute inset-0 bg-[#0F2B54] rounded-bl-full" />
                                    </span>
                                </>
                            )}
                            <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                            Company Path
                        </button>
                    </div>
            </section>

            {/* Content - show based on active tab */}
            <section className="bg-white">
                {activeTab === 'artisan' ? (
                    <PathDeepDive {...artisanData} />
                ) : (
                    <PathDeepDive {...companyData} />
                )}
            </section>

            {/* Pricing Section */}
            <section className="py-16 px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1F44] mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Each trainer sets their own program fee based on duration, skill level, and what&apos;s included.
                            You only pay for the program you choose.
                        </p>
                    </div>

                    {/* Pricing Card */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl border border-gray-200 p-10 lg:p-12 text-center shadow-sm">
                            <div className="w-16 h-16 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Wallet className="w-8 h-8 text-[#14B8A6]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0A1F44] mb-2">Pay Per Program</h3>
                            <p className="text-gray-600 mb-8">
                                Browse programs and pay the fee set by your chosen trainer.
                                Prices vary based on program length and expertise level.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6 text-left">
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                                    <Clock className="w-6 h-6 text-[#14B8A6] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-[#0A1F44] text-base">Flexible Duration</p>
                                        <p className="text-sm text-gray-600 mt-1">Programs range from weeks to months</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                                    <Award className="w-6 h-6 text-[#14B8A6] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-[#0A1F44] text-base">Verified Trainers</p>
                                        <p className="text-sm text-gray-600 mt-1">All trainers are vetted professionals</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl">
                                    <ShieldCheck className="w-6 h-6 text-[#14B8A6] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-[#0A1F44] text-base">Secure Payments</p>
                                        <p className="text-sm text-gray-600 mt-1">Safe and protected transactions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1F44] mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                        Browse available programs and take the first step toward your new career
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/all-trainings"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#14B8A6] text-white font-semibold rounded-xl hover:bg-[#14B8A6]/90 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Hammer size={20} />
                            Browse Artisan Programs
                        </Link>
                        <Link
                            href="/all-trainings"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0A1F44] text-white font-semibold rounded-xl hover:bg-[#0A1F44]/90 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Building2 size={20} />
                            Browse Company Programs
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

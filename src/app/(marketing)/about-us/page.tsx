'use client'

import { Target, Users, Sparkles, Hammer, Building2 } from 'lucide-react'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <main className="flex flex-col w-full">
            <Navbar color="light" />

            {/* Mission Section */}
            <section className="py-10 lg:py-16 px-4 lg:px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl lg:text-4xl font-bold text-[#0A1F44] mb-4 lg:mb-6">
                        About Prentis
                    </h1>
                    <p className="text-base lg:text-2xl text-gray-600 lg:text-[#0A1F44] font-light leading-relaxed">
                        We believe everyone deserves access to quality training and mentorship.
                        Prentis bridges the gap between aspiring professionals and experienced mentors.
                    </p>
                </div>
            </section>

            {/* Impact Stats Section */}
            <section className="py-10 lg:py-16 px-4 lg:px-6 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54]">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 text-center">
                        <div className="bg-white/5 rounded-xl p-4 lg:p-0 lg:bg-transparent">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">500+</div>
                            <div className="text-xs lg:text-sm text-white/70 mt-1">Active Trainers</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 lg:p-0 lg:bg-transparent">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">10K+</div>
                            <div className="text-xs lg:text-sm text-white/70 mt-1">Apprentices Trained</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 lg:p-0 lg:bg-transparent">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">95%</div>
                            <div className="text-xs lg:text-sm text-white/70 mt-1">Hiring Success</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 lg:p-0 lg:bg-transparent">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">12</div>
                            <div className="text-xs lg:text-sm text-white/70 mt-1">Industries</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section - Compact on mobile */}
            <section className="py-8 lg:py-16 px-4 lg:px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-xl lg:text-4xl font-bold text-[#0A1F44] text-center mb-6 lg:mb-12">
                        Our Values
                    </h2>

                    {/* Mobile: Horizontal scrollable cards, Desktop: Grid */}
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
                        <div className="flex-shrink-0 w-[280px] md:w-auto snap-center bg-white rounded-xl border border-gray-100 p-4 lg:p-6 text-center shadow-sm">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                <Target className="w-5 h-5 lg:w-6 lg:h-6 text-[#14B8A6]" />
                            </div>
                            <h3 className="font-semibold text-[#0A1F44] text-base lg:text-lg mb-1 lg:mb-2">Skills-First</h3>
                            <p className="text-gray-600 text-sm">Hands-on learning over theory. Practical experience over credentials.</p>
                        </div>
                        <div className="flex-shrink-0 w-[280px] md:w-auto snap-center bg-white rounded-xl border border-gray-100 p-4 lg:p-6 text-center shadow-sm">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-[#14B8A6]" />
                            </div>
                            <h3 className="font-semibold text-[#0A1F44] text-base lg:text-lg mb-1 lg:mb-2">Community Driven</h3>
                            <p className="text-gray-600 text-sm">A network of mentors and apprentices supporting each other.</p>
                        </div>
                        <div className="flex-shrink-0 w-[280px] md:w-auto snap-center bg-white rounded-xl border border-gray-100 p-4 lg:p-6 text-center shadow-sm">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-[#14B8A6]" />
                            </div>
                            <h3 className="font-semibold text-[#0A1F44] text-base lg:text-lg mb-1 lg:mb-2">Career Outcomes</h3>
                            <p className="text-gray-600 text-sm">Training that leads to real jobs and business opportunities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-10 lg:py-20 px-4 lg:px-6 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54]">
                <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">
                            Ready to Start?
                        </h2>
                        <p className="text-sm lg:text-lg text-white/70 mb-6 lg:mb-10">
                            Browse programs and take the first step toward your new career
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/all-trainings"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-[#14B8A6] text-white font-semibold rounded-xl hover:bg-[#14B8A6]/90 transition-all text-sm lg:text-base"
                            >
                                <Hammer size={18} />
                                Artisan Programs
                            </Link>
                            <Link
                                href="/all-trainings"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-white text-[#0A1F44] font-semibold rounded-xl hover:bg-white/90 transition-all text-sm lg:text-base"
                            >
                                <Building2 size={18} />
                                Company Programs
                            </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

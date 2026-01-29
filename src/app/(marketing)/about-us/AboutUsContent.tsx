'use client'

import { Target, Users, Sparkles, Hammer, Building2, BookOpen } from 'lucide-react'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'

export default function AboutUsContent() {
    return (
        <main className="flex flex-col w-full">
            <Navbar color="light" />

            {/* Mission Section */}
            <section className="py-10 lg:py-16 px-4 lg:px-6 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54]">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl lg:text-4xl font-bold text-white mb-4 lg:mb-6">
                        About Prentis
                    </h1>
                    <p className="text-base lg:text-2xl text-white/70 font-light leading-relaxed">
                        Nigeria has millions of talented young people and experienced master artisans—but a broken bridge between them.
                        Prentis connects aspiring professionals with vetted trainers to earn recognized HND, ND, and NABTEB qualifications
                        through hands-on apprenticeships across Lagos, Abuja, and all 36 states.
                    </p>
                </div>
            </section>

            {/* Nigeria's Apprenticeship Ecosystem Stats */}
            <section className="py-10 lg:py-16 px-4 lg:px-6 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-xl lg:text-3xl font-bold text-[#0A1F44] text-center mb-3 lg:mb-4">
                        Nigeria's Apprenticeship Ecosystem
                    </h2>
                    <p className="text-gray-600 text-center mb-8 lg:mb-12 max-w-2xl mx-auto">
                        The informal apprenticeship system is one of Nigeria's most powerful engines for skills development and economic mobility.
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 text-center">
                        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">10M+</div>
                            <div className="text-xs lg:text-sm text-[#0A1F44] mt-1">Nigerians Trained Through Apprenticeships</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">80%</div>
                            <div className="text-xs lg:text-sm text-[#0A1F44] mt-1">Of Workforce Skilled Outside Formal Education</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">36</div>
                            <div className="text-xs lg:text-sm text-[#0A1F44] mt-1">States With Active Apprenticeship Systems</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                            <div className="text-2xl lg:text-5xl font-bold text-[#14B8A6]">50+</div>
                            <div className="text-xs lg:text-sm text-[#0A1F44] mt-1">Trade Categories Across Nigeria</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-10 lg:py-16 px-4 lg:px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-[#14B8A6]" />
                        </div>
                        <h2 className="text-xl lg:text-3xl font-bold text-[#0A1F44]">
                            Our Story
                        </h2>
                    </div>
                    <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                        <p>
                            Prentis was born from a simple observation: Nigeria's traditional apprenticeship system—where young people
                            learn trades under master artisans—has quietly powered the nation's economy for generations. From the famous
                            Igbo apprenticeship model to workshop training across every state, millions of Nigerians have built successful
                            careers through hands-on mentorship.
                        </p>
                        <p>
                            Yet these skilled graduates often lack the formal qualifications that open doors to larger opportunities.
                            A master tailor with 20 years of experience can train exceptional apprentices, but those apprentices graduate
                            without HND, ND, or NABTEB credentials—limiting their access to formal employment, loans, and business opportunities.
                        </p>
                        <p>
                            We're building the bridge between time-tested hands-on training and nationally recognized credentials.
                            Prentis partners with master artisans, companies, and accredited institutions to ensure that practical skills
                            translate into official qualifications—giving Nigeria's workforce the recognition they deserve.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-8 lg:py-16 px-4 lg:px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-xl lg:text-4xl font-bold text-[#0A1F44] text-center mb-6 lg:mb-12">
                        Our Values
                    </h2>

                    {/* Mobile: Horizontal scrollable cards, Desktop: Grid */}
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
                        <div className="flex-shrink-0 w-[280px] md:w-auto snap-center bg-gray-50 rounded-xl border border-gray-100 p-4 lg:p-6 text-center shadow-sm">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                <Target className="w-5 h-5 lg:w-6 lg:h-6 text-[#14B8A6]" />
                            </div>
                            <h3 className="font-semibold text-[#0A1F44] text-base lg:text-lg mb-1 lg:mb-2">Skills-First</h3>
                            <p className="text-gray-600 text-sm">Hands-on learning over theory. Practical experience that prepares you for real work in Nigeria's industries.</p>
                        </div>
                        <div className="flex-shrink-0 w-[280px] md:w-auto snap-center bg-gray-50 rounded-xl border border-gray-100 p-4 lg:p-6 text-center shadow-sm">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-[#14B8A6]" />
                            </div>
                            <h3 className="font-semibold text-[#0A1F44] text-base lg:text-lg mb-1 lg:mb-2">Community Driven</h3>
                            <p className="text-gray-600 text-sm">A network of master artisans, companies, and apprentices supporting each other across Nigeria.</p>
                        </div>
                        <div className="flex-shrink-0 w-[280px] md:w-auto snap-center bg-gray-50 rounded-xl border border-gray-100 p-4 lg:p-6 text-center shadow-sm">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-[#14B8A6]" />
                            </div>
                            <h3 className="font-semibold text-[#0A1F44] text-base lg:text-lg mb-1 lg:mb-2">Career Outcomes</h3>
                            <p className="text-gray-600 text-sm">Training that leads to HND, ND, and NABTEB qualifications—and real jobs or business opportunities.</p>
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
                            Browse programs and take the first step toward your new career in Nigeria
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

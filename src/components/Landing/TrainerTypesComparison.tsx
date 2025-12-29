import { Hammer, Building2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TrainerTypesComparison() {
    return (
        <div className="py-20 px-6 lg:py-28 lg:px-12 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] relative overflow-hidden">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] opacity-10 pointer-events-none" style={{ transform: 'translate(30%, -30%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-8 pointer-events-none" style={{ transform: 'translate(-25%, 25%)' }}>
                <path fill="#2DD4BF" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            <div className="max-w-[1500px] mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
                        Who Can Train on Prentis?
                    </h2>
                    <p className="text-lg text-white/70 lg:max-w-2xl mx-auto">
                        Two types of trainers use Prentis to manage apprenticeships and build talent
                    </p>
                </div>

                {/* Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Master Artisans Card */}
                    <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm hover:border-[#14B8A6] transition-all hover:bg-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20">
                                <Hammer className="text-[#14B8A6]" size={32} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white">
                                Master Artisans (Ogas)
                            </h3>
                        </div>

                        <p className="text-white/70 mb-6">
                            Independent workshop owners and craft masters
                        </p>

                        <div className="mb-6">
                            <p className="text-xl font-medium text-[#14B8A6] mb-4">
                                What You Get
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Command higher fees with accredited programs</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Build professional reputation as verified trainer</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Certify apprentices and track their progress</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Expand reach beyond your local area</p>
                            </div>
                        </div>

                        <Link
                            href="/signup?type=recruiter"
                            className="block w-full text-center bg-[#14B8A6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488] transition-all"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Companies Card */}
                    <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm hover:border-[#14B8A6] transition-all hover:bg-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20">
                                <Building2 className="text-[#14B8A6]" size={32} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white">
                                Companies & Businesses
                            </h3>
                        </div>

                        <p className="text-white/70 mb-6">
                            Startups to corporations building talent pipelines
                        </p>

                        <div className="mb-6">
                            <p className="text-xl font-medium text-[#14B8A6] mb-4">
                                What You Get
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Reduce recruitment costs with trained-to-hire talent</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Build custom-trained teams that fit your culture</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Trial-run potential hires before making offers</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
                                <p className="text-white/80">Access pre-vetted, ambitious talent eager to work</p>
                            </div>
                        </div>

                        <Link
                            href="/signup?type=recruiter"
                            className="block w-full text-center bg-[#14B8A6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488] transition-all"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

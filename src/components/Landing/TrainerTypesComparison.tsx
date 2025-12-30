import { Hammer, Building2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function TrainerTypesComparison() {
    return (
        <div className="pb-20 px-6 lg:pb-28 lg:px-12 relative overflow-hidden">
            <div className="max-w-[1500px] mx-auto relative z-10">
                {/* Comparison Cards */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Master Artisans Card */}
                    <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm hover:border-[#14B8A6] transition-all hover:bg-white/10 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20">
                                <Hammer className="text-[#14B8A6]" size={32} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white">
                                Master Artisans (Ogas)
                            </h3>
                        </div>

                        <p className="text-white/70 mb-6">
                            Skilled craftspeople and independent workshop owners with years of hands-on experience in trades like tailoring, welding, automotive repair, carpentry, plumbing, electrical work, and other specialized crafts. Transform your expertise into an accredited training program.
                        </p>

                        <div className="mb-6">
                            <p className="text-xl font-medium text-[#14B8A6] mb-4">
                                What You Get
                            </p>
                        </div>

                        <div className="space-y-4 mb-8 flex-grow">
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
                            className="block w-full text-center bg-[#14B8A6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488] transition-all mt-auto"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Companies Card */}
                    <div className="border border-white/10 rounded-xl p-8 bg-white/5 backdrop-blur-sm hover:border-[#14B8A6] transition-all hover:bg-white/10 flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-[#14B8A6]/10 border border-[#14B8A6]/20">
                                <Building2 className="text-[#14B8A6]" size={32} />
                            </div>
                            <h3 className="text-2xl font-semibold text-white">
                                Companies & Businesses
                            </h3>
                        </div>

                        <p className="text-white/70 mb-6">
                            Organizations of all sizes across technology, manufacturing, logistics, marketing, engineering, hospitality, and professional services. Build custom talent pipelines and train apprentices to fit your exact needs and company culture.
                        </p>

                        <div className="mb-6">
                            <p className="text-xl font-medium text-[#14B8A6] mb-4">
                                What You Get
                            </p>
                        </div>

                        <div className="space-y-4 mb-8 flex-grow">
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
                            className="block w-full text-center bg-[#14B8A6] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0D9488] transition-all mt-auto"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

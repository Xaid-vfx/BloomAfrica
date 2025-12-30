import { Award, ShieldCheck, GraduationCap } from 'lucide-react'

export default function AccreditationSection() {
    return (
        <div className="py-20 px-6 lg:py-28 lg:px-12 relative overflow-hidden">
            <div className="max-w-[1500px] mx-auto relative z-10">
                {/* Main Content */}
                <div className="text-center mb-12">
                    {/* Badge Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="p-4 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20">
                            <Award className="text-[#14B8A6]" size={48} />
                        </div>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl lg:text-5xl font-semibold text-white mb-6 lg:max-w-4xl mx-auto">
                        Become an <span className="text-[#14B8A6]">Accredited Technical Institution</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg lg:text-xl text-white/80 lg:max-w-3xl mx-auto mb-12">
                        When you sign up as a trainer on Prentis, you're not just joining a platform—you're becoming a certified training institution. We handle all certification and accreditation, so you can focus on what you do best: training.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {/* Benefit 1 */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                <ShieldCheck className="text-[#14B8A6]" size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Official Accreditation
                        </h3>
                        <p className="text-white/70">
                            We handle all certification processes, making your training programs officially recognized and valued.
                        </p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                <GraduationCap className="text-[#14B8A6]" size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Issue Certificates
                        </h3>
                        <p className="text-white/70">
                            Your apprentices receive official certificates upon completion, boosting their careers and your reputation.
                        </p>
                    </div>

                    {/* Benefit 3 */}
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                                <Award className="text-[#14B8A6]" size={32} />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">
                            Institutional Status
                        </h3>
                        <p className="text-white/70">
                            Gain the credibility and prestige of a recognized technical training institution without the overhead.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

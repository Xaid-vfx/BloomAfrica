import { Award, CheckCircle } from 'lucide-react'

export default function CertificationSection() {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Certificate Container */}
                <div className="relative bg-[#F0FDFA] rounded-lg shadow-2xl border-8 border-double border-[#14B8A6] p-12 md:p-16">
                    {/* Decorative Corner Elements */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-[#14B8A6]"></div>
                    <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-[#14B8A6]"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-[#14B8A6]"></div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-[#14B8A6]"></div>

                    {/* Content Container */}
                    <div className="max-w-3xl mx-auto">
                        {/* Award Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-[#14B8A6] rounded-full p-4">
                                <Award size={48} className="text-white" strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-grey-900 mb-8">
                            Recognized Qualification & Certification
                        </h2>

                        {/* Certificate Content */}
                        <div className="space-y-6">
                            <p className="text-center text-lg text-grey-700 leading-relaxed">
                                Every apprenticeship with Prentis leads to a nationally recognized qualification.
                                We partner with accredited institutions to ensure your training meets industry standards
                                and is valued by employers across the country.
                            </p>

                            {/* Key Points */}
                            <div className="grid md:grid-cols-2 gap-4 mt-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-semibold text-grey-900 mb-1">Official Certification</h3>
                                        <p className="text-sm text-grey-600">
                                            Receive certificates recognized by industry bodies and employers
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-semibold text-grey-900 mb-1">Skills Assessment</h3>
                                        <p className="text-sm text-grey-600">
                                            Regular evaluations to track your progress and skill development
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-semibold text-grey-900 mb-1">Accredited Partners</h3>
                                        <p className="text-sm text-grey-600">
                                            Training delivered in collaboration with certified institutions
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="text-[#10B981] flex-shrink-0 mt-1" size={24} />
                                    <div>
                                        <h3 className="font-semibold text-grey-900 mb-1">Career Credentials</h3>
                                        <p className="text-sm text-grey-600">
                                            Build a portfolio of qualifications that advance your career
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Line */}
                            <div className="mt-8 pt-6 border-t-2 border-[#14B8A6]/20">
                                <p className="text-center text-sm text-grey-500 italic">
                                    Your journey to mastery is officially recognized and valued
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

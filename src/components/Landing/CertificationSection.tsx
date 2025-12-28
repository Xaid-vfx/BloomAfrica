import { Award, CheckCircle } from 'lucide-react'

export default function CertificationSection() {
    return (
        <div className="relative bg-white py-20 px-6 overflow-hidden">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-1/2 left-1/2 w-[500px] h-[500px] md:w-[600px] md:h-[600px] opacity-[0.06] pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                <path fill="#0A1F44" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 250 250" className="absolute bottom-10 left-10 w-[150px] h-[150px] md:w-[200px] md:h-[200px] opacity-[0.08] pointer-events-none">
                <path fill="#1A3A64" d="M213.3,109.7c-7.7,29.9-30.6,52.8-60.5,60.5c-29.9,7.7-60.9-2.8-82.1-27.6c-21.1-24.9-28.3-58.9-18.9-89.6c9.4-30.8,32-52.8,58.9-53.9c26.9-1.1,57.4,17.8,72.4,46.9C197.6,75.6,221,79.8,213.3,109.7z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute top-20 right-10 w-[180px] h-[180px] md:w-[250px] md:h-[250px] opacity-[0.07] pointer-events-none" style={{ transform: 'translate(20%, 0)' }}>
                <path fill="#2DD4BF" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>
            <svg viewBox="0 0 300 300" className="absolute bottom-1/4 right-0 w-[120px] h-[120px] md:w-[180px] md:h-[180px] opacity-[0.06] pointer-events-none" style={{ transform: 'translate(40%, 0)' }}>
                <path fill="#0A1F44" d="M246.4,123.3c-8.8,34.2-35,60.4-69.2,69.2c-34.2,8.8-69.6-3.2-94-31.6c-24.4-28.4-32.4-67.4-21.6-102.5c10.8-35.2,36.6-60.4,67.3-61.6c30.7-1.3,65.6,20.3,82.8,53.6C227,84.4,255.2,89.1,246.4,123.3z"/>
            </svg>
            <svg viewBox="0 0 350 350" className="absolute top-1/4 left-0 w-[150px] h-[150px] md:w-[200px] md:h-[200px] opacity-[0.05] pointer-events-none" style={{ transform: 'translate(-35%, 0)' }}>
                <path fill="#1A3A64" d="M283.9,142.8c-10.2,39.6-40.6,70-80.2,80.2c-39.6,10.2-80.6-3.7-108.9-36.6c-28.3-32.9-37.5-78.1-25.1-118.8c12.4-40.8,42.4-70,78-71.4c35.6-1.5,76,23.5,96,62.1C265.5,98.7,294.1,103.2,283.9,142.8z"/>
            </svg>

            <div className="max-w-5xl mx-auto relative z-10">
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

import type { Metadata } from "next";
import Link from "next/link";
import SeekerNavbar from "./browse/seekerNavbar";
import getUser from "@/lib/getUser/getUser";
import { FaUsers, FaBuilding, FaArrowRight } from "react-icons/fa";

export const metadata: Metadata = {
    title: 'Explore Apprenticeships | Prentis'
}

export default async function ApprenticeshipPaths() {
    const user = await getUser()

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <SeekerNavbar user={user || null} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Explore Apprenticeship Programs
                    </h1>
                    <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose your path to kickstart your career. Browse hands-on training with artisans or apply to structured corporate programs.
                    </p>
                </div>

                {/* Two-path cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-16">
                    {/* Individual/Artisan Card */}
                    <Link href="/all-trainings/browse" className="group">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-teal-500 h-full">
                            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                    <FaUsers className="text-3xl text-white" />
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                                    Browse Individual & Artisan Programs
                                </h2>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed">
                                    Explore hands-on training opportunities with master craftspeople and small businesses.
                                    Learn traditional skills and modern techniques directly from experienced practitioners.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-teal-500 mr-2">✓</span>
                                        <span>Direct mentorship from skilled artisans</span>
                                    </li>
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-teal-500 mr-2">✓</span>
                                        <span>Hands-on, practical learning experience</span>
                                    </li>
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-teal-500 mr-2">✓</span>
                                        <span>Browse and apply to specific programs</span>
                                    </li>
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-teal-500 mr-2">✓</span>
                                        <span>Flexible scheduling and locations</span>
                                    </li>
                                </ul>
                                <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700">
                                    <span className="text-lg">Browse Programs</span>
                                    <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Company Card */}
                    <Link href="/all-trainings/apply-to-companies" className="group">
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-blue-500 h-full">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                    <FaBuilding className="text-3xl text-white" />
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                                    Apply to Company Programs
                                </h2>
                            </div>
                            <div className="p-8">
                                <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed">
                                    Submit your profile to be considered for structured corporate apprenticeships.
                                    Companies will review your application and reach out if you're a good match.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Structured training programs</span>
                                    </li>
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Career development opportunities</span>
                                    </li>
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Competitive compensation packages</span>
                                    </li>
                                    <li className="flex items-start text-gray-700">
                                        <span className="text-blue-500 mr-2">✓</span>
                                        <span>Companies reach out to you</span>
                                    </li>
                                </ul>
                                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                                    <span className="text-lg">Apply Now</span>
                                    <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Info section */}
                <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-3xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Not sure which path is right for you?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                        Individual/Artisan programs are great for learning specific crafts and trades directly from practitioners.
                        Company programs offer structured career paths with established organizations. You can explore both!
                    </p>
                </div>
            </div>
        </div>
    );
}

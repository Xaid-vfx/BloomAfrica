import { Metadata } from "next";
import SeekerNavbar from "@/app/(seeker)/all-trainings/_components/SeekerNavbar";
import getUser from "@/lib/api/getUser";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
    title: 'How to Use Prentis | Prentis'
}

export default async function WelcomePage() {
    const user = await getUser();

    return (
        <div>
            <SeekerNavbar user={user || null} />
            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#0A1F44]">How to Use Prentis</h1>
                            <span className="text-sm text-[#14B8A6] bg-[#14B8A6]/15 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
                                    <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Welcome Guide
                            </span>
                        </div>
                        <p className="text-lg md:text-xl text-[#515B6F]">Get a guaranteed certificate and hands-on support to launch your own business after training.</p>
                    </div>

                    <div className="space-y-10">
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-green-800 font-bold text-lg">1</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-[#0A1F44]">Getting Started</h2>
                            </div>
                            <div className="ml-12 space-y-4 text-[#515B6F]">
                                <p className="text-lg">Welcome to Prentis! Here's how to begin your journey:</p>
                                <ul className="list-disc pl-6 space-y-3 text-base">
                                    <li>Browse through available apprenticeships in various fields</li>
                                    <li>Click on any training to view detailed information</li>
                                    <li>Review the requirements, duration, and certification details</li>
                                    <li>Apply directly to apprenticeships that match your interests</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                                    <span className="text-[#14B8A6] font-bold text-lg">2</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-[#0A1F44]">Quick Tips</h2>
                            </div>
                            <div className="ml-12 space-y-4 text-[#515B6F]">
                                <ul className="list-disc pl-6 space-y-3 text-base">
                                    <li>Use the filter options at the top to narrow down apprenticeships by category and type</li>
                                    <li>Look for verified apprenticeships marked with a checkmark</li>
                                    <li>Pay attention to the training mode (on-site, remote, or hybrid)</li>
                                    <li>Check if the apprenticeship provides a certificate upon completion</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                                    <span className="text-[#14B8A6] font-bold text-lg">3</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-[#0A1F44]">Certificates</h2>
                            </div>
                            <div className="ml-12 space-y-4 text-[#515B6F]">
                                <p className="text-lg">Upon successful completion of your apprenticeship:</p>
                                <ul className="list-disc pl-6 space-y-3 text-base">
                                    <li>Receive a recognized certificate to validate your skills</li>
                                    <li>Boost your resume with industry-relevant credentials</li>
                                    <li>Demonstrate your practical experience to potential employers</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                                    <span className="text-[#14B8A6] font-bold text-lg">4</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-[#0A1F44]">Apprentice Guide</h2>
                            </div>
                            <div className="ml-12 space-y-4 text-[#515B6F]">
                                <p className="text-lg">As an apprentice, you'll benefit from:</p>
                                <ul className="list-disc pl-6 space-y-3 text-base">
                                    <li>Hands-on training in real-world environments</li>
                                    <li>Mentorship from experienced professionals</li>
                                    <li>Support to launch your own business after training</li>
                                    <li>Networking opportunities with industry experts</li>
                                </ul>
                            </div>
                        </section>

                        <div className="mt-10 p-8 bg-gradient-to-br from-[#14B8A6]/5 to-white border-2 border-[#14B8A6]/30 rounded-2xl">
                            <h3 className="text-2xl font-semibold text-[#0A1F44] mb-3">Ready to start?</h3>
                            <p className="text-[#515B6F] text-lg mb-6">Explore the apprenticeships below and take the first step towards your future career!</p>
                            <a
                                href="/all-trainings"
                                className="inline-block text-white bg-[#14B8A6] hover:bg-[#0D9488] px-8 py-3 rounded-xl font-semibold transition-colors"
                            >
                                Browse Apprenticeships
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

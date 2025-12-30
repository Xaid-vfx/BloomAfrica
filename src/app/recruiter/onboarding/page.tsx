'use client'

import { useRecruiter } from "@/context/RecruiterContext";
import { CheckCircle, Rocket, Users, FileText, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const { user, recruiter, company } = useRecruiter();
    const router = useRouter();

    const steps = [
        {
            title: "Complete Company Profile",
            description: "Add your company information and details",
            icon: Building2,
            completed: !!company?.name && !!company?.description,
            action: () => router.push('/recruiter/company'),
            actionText: "Complete Profile"
        },
        {
            title: "Post Your First Apprenticeship",
            description: "Create your first apprenticeship opportunity",
            icon: FileText,
            completed: false, // You can add logic to check if they have posted jobs
            action: () => router.push('/recruiter/post-a-job'),
            actionText: "Post Apprenticeship"
        },
        {
            title: "Set Up Bank Details",
            description: "Add your bank information for receiving payments",
            icon: Users,
            completed: false, // You can add logic to check if bank details exist
            action: () => router.push('/recruiter/bank-details'),
            actionText: "Add Bank Details"
        },
        {
            title: "Review Applications",
            description: "Check and manage apprenticeship applications",
            icon: CheckCircle,
            completed: false,
            action: () => router.push('/recruiter/listings'),
            actionText: "View Listings"
        }
    ];

    const completedSteps = steps.filter(step => step.completed).length;
    const progress = (completedSteps / steps.length) * 100;

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 lg:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Rocket className="text-[#14B8A6]" size={28} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Welcome, {recruiter?.name || company?.name}!</h1>
                        <p className="text-gray-600 mt-1">Let's get you set up to find great apprentices</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-gray-700">Setup Progress</p>
                        <p className="text-sm font-semibold text-[#14B8A6]">{completedSteps} of {steps.length} completed</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto p-6 lg:p-8'>
                <div className="grid gap-4 md:grid-cols-2">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className={`relative bg-white border-2 rounded-2xl p-6 transition-all ${
                                    step.completed
                                        ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                                        : 'border-gray-200 hover:border-[#14B8A6] hover:shadow-lg'
                                }`}
                            >
                                {step.completed && (
                                    <div className="absolute top-4 right-4">
                                        <CheckCircle className="text-[#14B8A6]" size={24} />
                                    </div>
                                )}

                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`rounded-full p-3 ${
                                        step.completed ? 'bg-[#14B8A6]/20' : 'bg-gray-100'
                                    }`}>
                                        <Icon className={step.completed ? 'text-[#14B8A6]' : 'text-gray-500'} size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-[#0A1F44] mb-1">{step.title}</h3>
                                        <p className="text-sm text-gray-600">{step.description}</p>
                                    </div>
                                </div>

                                {!step.completed && (
                                    <button
                                        onClick={step.action}
                                        className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors shadow-md shadow-[#14B8A6]/20"
                                    >
                                        {step.actionText}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Help Section */}
                <div className="mt-8 bg-gradient-to-br from-[#0A1F44]/5 to-[#14B8A6]/5 border-2 border-gray-100 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-[#0A1F44] mb-2">Need Help?</h3>
                    <p className="text-gray-600 mb-4">
                        If you have any questions or need assistance getting started, we're here to help.
                    </p>
                    <button className="text-[#14B8A6] hover:text-[#0D9488] font-medium text-sm transition-colors">
                        Contact Support →
                    </button>
                </div>
            </div>
        </div>
    );
}

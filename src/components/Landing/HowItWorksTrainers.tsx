import { UserPlus, CheckCircle2, ClipboardList, Rocket } from 'lucide-react'

export default function HowItWorksTrainers() {
    const steps = [
        {
            number: 1,
            icon: <UserPlus size={32} />,
            title: "Create Your Trainer Account",
            description: "Sign up with Google or email. Complete your profile with your workshop details or company information."
        },
        {
            number: 2,
            icon: <CheckCircle2 size={32} />,
            title: "Get Verified",
            description: "Submit your credentials and business documentation. Our team reviews and approves qualified trainers to maintain platform quality."
        },
        {
            number: 3,
            icon: <ClipboardList size={32} />,
            title: "Create Your Program",
            description: "Build your apprenticeship program, define your curriculum, set duration, and establish your enrollment fees."
        },
        {
            number: 4,
            icon: <Rocket size={32} />,
            title: "Start Training",
            description: "Your program goes live on the Prentis marketplace. Learners apply, you select the best fits, and start training while earning."
        }
    ]

    return (
        <div className="py-20 px-6 lg:py-28 lg:px-12 bg-white relative overflow-hidden">
            {/* Decorative Blob */}
            <svg viewBox="0 0 400 400" className="absolute top-0 left-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-[0.03] pointer-events-none" style={{ transform: 'translate(-20%, -20%)' }}>
                <path fill="#14B8A6" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            <div className="max-w-[1500px] mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-semibold text-[#1F2937] mb-4">
                        Get Started in 4 Simple Steps
                    </h2>
                    <p className="text-lg text-[#6B7280] lg:max-w-2xl mx-auto">
                        Joining Prentis as a trainer is straightforward. Follow these steps to start building your legacy.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {steps.map((step) => (
                        <div key={step.number} className="flex gap-6">
                            {/* Number Badge */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-[#14B8A6]/10 border-2 border-[#14B8A6] flex items-center justify-center">
                                    <span className="text-xl font-bold text-[#14B8A6]">{step.number}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="text-[#14B8A6] mb-3">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-[#1F2937] mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-[#6B7280] leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

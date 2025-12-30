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
        <div className="py-20 px-6 lg:py-28 lg:px-12 relative overflow-hidden">
            <div className="max-w-[1500px] mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
                        Get Started in 4 Simple Steps
                    </h2>
                    <p className="text-lg text-white/70 lg:max-w-2xl mx-auto">
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
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-white/70 leading-relaxed">
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

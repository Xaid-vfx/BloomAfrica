import { CheckCircle } from 'lucide-react'

type Props = {
    userType: 'seeker' | 'recruiter'
}

export default function LeftColomn({ userType }: Props) {
    const benefits = {
        seeker: [
            { text: "Find quality training programs" },
            { text: "Track your progress" },
            { text: "Get certified" },
            { text: "Connect with trainers" }
        ],
        recruiter: [
            { text: "Reach more apprentices" },
            { text: "Manage your programs" },
            { text: "Track student progress" },
            { text: "Grow your training business" }
        ]
    }

    return (
        <div className="hidden lg:flex overflow-hidden py-8 px-10 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] w-[45%] flex-col justify-center relative">
            {/* Decorative SVG Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 left-0 w-[400px] h-[400px] opacity-8 pointer-events-none" style={{ transform: 'translate(-20%, -20%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            <div className="w-full max-w-[500px] mx-auto relative z-10 space-y-12">
                {/* Branding */}
                <div className="flex items-center justify-center">
                    <p className="text-4xl text-white font-bold tracking-tight">Prentis</p>
                </div>

                {/* Benefits Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-3">
                            {userType === 'seeker' ? 'Your Learning Journey' : 'Grow Your Impact'}
                        </h2>
                        <p className="text-white/60 text-sm">
                            {userType === 'seeker'
                                ? 'Join thousands of apprentices building their careers'
                                : 'Empower the next generation of skilled professionals'}
                        </p>
                    </div>

                    <div className="space-y-5">
                        {benefits[userType].map((benefit, index) => (
                            <div key={index} className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-[#14B8A6]/30">
                                <CheckCircle
                                    className="text-[#14B8A6] flex-shrink-0"
                                    size={24}
                                    aria-hidden="true"
                                />
                                <p className="text-white text-base font-medium pt-0.5">{benefit.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
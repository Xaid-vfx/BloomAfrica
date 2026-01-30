import BenefitCard from './BenefitCard'
import { Award, Target, Users, Lightbulb } from 'lucide-react'

export default function WhyChoosePrentis() {
    const benefits = [
        {
            icon: <Award size={48} strokeWidth={1.5} />,
            title: "HND, ND, B.Tech & NABTEB Qualifications",
            description: "Every program ends with official Nigerian qualifications. Earn Higher National Diploma (HND), National Diploma (ND), B.Tech, or NABTEB certifications—credentials recognized by employers across Nigeria and West Africa."
        },
        {
            icon: <Target size={48} strokeWidth={1.5} />,
            title: "Employment or Entrepreneurship in Nigeria",
            description: "Our programs are designed with the finish line in mind. Whether you're seeking placement with top companies in Lagos, Abuja, or Port Harcourt, or building the mastery to start your own business, Prentis provides the roadmap."
        },
        {
            icon: <Users size={48} strokeWidth={1.5} />,
            title: "Vetted Nigerian Trainers",
            description: "We are selective about who we let onto our platform. Every master artisan and company is vetted against TVET standards to ensure high-quality training and a safe, professional environment across all Nigerian states."
        },
        {
            icon: <Lightbulb size={48} strokeWidth={1.5} />,
            title: "Real Experience, Not Just Theory",
            description: "We don't do simulations. You learn inside active Nigerian businesses—from Lagos startups to established workshops. You gain the \"proof of work\" that only comes from solving real-world problems in real companies."
        }
    ]

    return (
        <div className="bg-white py-6 px-4 md:py-8 md:px-6">
            <div className="relative bg-[#0A1F44] py-20 px-6 overflow-hidden rounded-3xl">
                {/* Decorative Blobs */}
                <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[450px] h-[450px] md:w-[550px] md:h-[550px] opacity-12 pointer-events-none" style={{ transform: 'translate(35%, -35%)' }}>
                    <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
                </svg>
                <svg viewBox="0 0 400 400" className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[380px] md:h-[380px] opacity-10 pointer-events-none" style={{ transform: 'translate(-30%, 30%)' }}>
                    <path fill="#2DD4BF" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
                </svg>
                <svg viewBox="0 0 250 250" className="absolute top-1/2 left-1/2 w-[180px] h-[180px] md:w-[220px] md:h-[220px] opacity-[0.08] pointer-events-none" style={{ transform: 'translate(-50%, -50%)' }}>
                    <path fill="#14B8A6" d="M213.3,109.7c-7.7,29.9-30.6,52.8-60.5,60.5c-29.9,7.7-60.9-2.8-82.1-27.6c-21.1-24.9-28.3-58.9-18.9-89.6c9.4-30.8,32-52.8,58.9-53.9c26.9-1.1,57.4,17.8,72.4,46.9C197.6,75.6,221,79.8,213.3,109.7z"/>
                </svg>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-semibold lg:text-4xl text-white">
                            Why Train With Prentis
                        </h2>
                        <p className="text-white/70 mt-4 text-lg max-w-2xl mx-auto">
                            Build your career with the right support and credentials
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <BenefitCard
                                key={index}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

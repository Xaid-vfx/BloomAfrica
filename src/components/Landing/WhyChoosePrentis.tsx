import BenefitCard from './BenefitCard'
import { Award, Target, Users, Lightbulb } from 'lucide-react'

export default function WhyChoosePrentis() {
    const benefits = [
        {
            icon: <Award size={48} strokeWidth={1.5} />,
            title: "Accredited Qualifications You Can Use",
            description: "Every program ends with an official qualification. You won't just walk away with \"skills\"; you'll walk away with an accredited certificate that is recognized by employers and institutions across the country."
        },
        {
            icon: <Target size={48} strokeWidth={1.5} />,
            title: "Land Your Dream Job or Launch Your Business",
            description: "Our programs are designed with the finish line in mind. Whether you are looking for a guaranteed job track with return offers or the mastery needed to open your own business, Prentis provides the official roadmap to get you there."
        },
        {
            icon: <Users size={48} strokeWidth={1.5} />,
            title: "Vetted Mentors You Can Trust",
            description: "We are selective about who we let onto our platform. Every Oga, Startup Founder, and Company is vetted to ensure they provide a high standard of training and a safe, professional environment for every learner."
        },
        {
            icon: <Lightbulb size={48} strokeWidth={1.5} />,
            title: "Real Experience, Not a Classroom",
            description: "We don't do simulations. You learn inside an active business—whether it's a high-growth startup, a master workshop, or an established company. You gain the \"proof of work\" that only comes from solving real-world problems."
        }
    ]

    return (
        <div className="bg-[#0A1F44] py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold lg:text-4xl text-white">
                        Why Choose Prentis
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
    )
}

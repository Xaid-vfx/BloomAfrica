'use client'

import TrackCard from './TrackCard'
import { Hammer, Building2 } from 'lucide-react'

export default function ChooseCareerPath() {

    const tracks = [
        {
            id: "artisan",
            title: "Learn with an Artisan",
            icon: <Hammer size={48} strokeWidth={1.5} />,
            description: "Learn specialized crafts and trades by working alongside master craftspeople in their workshops—from tailoring and welding to furniture-making and engine repair.",
            result: [
                "You want to start your own business",
                "You're looking to be your own boss",
                "You want to master a skilled trade"
            ],
            ctaText: "Enroll in Artisan Programs",
            ctaLink: "/all-trainings?track=artisan"
        },
        {
            id: "corporate",
            title: "Learn Inside a Company",
            icon: <Building2 size={48} strokeWidth={1.5} />,
            description: "Train inside established companies with clear career paths and professional standards. Learn from experienced teams using real systems.",
            result: [
                "You want employment after training",
                "You want to work in an  company",
                "You're seeking a stable career path"
            ],
            ctaText: "Apply to Company Programs",
            ctaLink: "/all-trainings?track=company"
        }
    ]

    return (
        <div className="relative bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] py-20 px-6 overflow-hidden">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 left-0 w-[350px] h-[350px] md:w-[450px] md:h-[450px] opacity-10 pointer-events-none" style={{ transform: 'translate(-35%, -35%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-0 right-0 w-[280px] h-[280px] md:w-[350px] md:h-[350px] opacity-12 pointer-events-none" style={{ transform: 'translate(30%, 30%)' }}>
                <path fill="#2DD4BF" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold lg:text-4xl text-white">
                        Choose Where to Build Your Career
                    </h2>
                    <p className="text-white/90 mt-4 text-lg max-w-2xl mx-auto">
                        Find the path that matches your goals and aspirations
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {tracks.map((track, index) => (
                        <div key={track.id}>
                            <TrackCard
                                icon={track.icon}
                                title={track.title}
                                description={track.description}
                                result={track.result}
                                ctaLink={track.ctaLink}
                                ctaText={track.ctaText}
                                color='#14B8A6'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

'use client'

import TrackCard from './TrackCard'
import { Hammer, Building2 } from 'lucide-react'

export default function ChooseCareerPath() {

    const tracks = [
        {
            id: "artisan",
            title: "Learn From an Artisan",
            icon: <Hammer size={48} strokeWidth={1.5} />,
            description: "Learn specialized crafts and trades by working alongside master craftspeople in their workshops—from tailoring and welding to furniture-making and engine repair.",
            result: ["On Completion: You will become an expert and master in the craft or trade you choose."],
            ctaText: "Explore Artisan Programs"
        },
        {
            id: "corporate",
            title: "Learn Inside a Company",
            icon: <Building2 size={48} strokeWidth={1.5} />,
            description: "Train inside established companies with clear career paths and professional standards. Learn from experienced teams using real systems.",
            result: ["On Completion: You will receive employment offers from the companies that train you."],
            ctaText: "Explore Company Programs"
        }
    ]

    return (
        <div className="bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] py-20 px-6">
            <div className="max-w-6xl mx-auto">
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
                                ctaLink="/all-trainings"
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

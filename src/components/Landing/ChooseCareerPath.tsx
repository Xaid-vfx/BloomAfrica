'use client'

import { useEffect } from 'react'
import TrackCard from './TrackCard'
import { Hammer, Building2 } from 'lucide-react'

export default function ChooseCareerPath() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ShowAnimation')
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.3 })

        const hiddenElements = document.querySelectorAll('.HiddenAnimation')
        hiddenElements.forEach((el) => observer.observe(el))
    }, [])

    const tracks = [
        {
            id: "artisan",
            title: "The Artisan Track",
            icon: <Hammer size={48} strokeWidth={1.5} />,
            description: "Learn specialized crafts and trades by working alongside master craftspeople in their workshops—from tailoring and welding to furniture-making and engine repair.",
            result: ["On Completion: You will become an expert and master in the craft or trade you choose."]
        },
        {
            id: "corporate",
            title: "The Corporate Track",
            icon: <Building2 size={48} strokeWidth={1.5} />,
            description: "Train inside established companies with clear career paths and professional standards. Learn from experienced teams using real systems.",
            result: ["On Completion: You will receive employment offers from the companies that train you."]
        }
    ]

    return (
        <div className="bg-grey-50 py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12 HiddenAnimation">
                    <h2 className="text-3xl font-semibold lg:text-4xl text-grey-900">
                        Choose Where to Build Your Career
                    </h2>
                    <p className="text-grey-600 mt-4 text-lg max-w-2xl mx-auto">
                        Find the path that matches your goals and aspirations
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {tracks.map((track) => (
                        <div key={track.id} className="HiddenAnimation">
                            <TrackCard
                                icon={track.icon}
                                title={track.title}
                                description={track.description}
                                result={track.result}
                                ctaLink="/all-trainings"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

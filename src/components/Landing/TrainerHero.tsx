'use client'

import Link from "next/link"
import { useEffect } from "react"

export default function TrainerHero() {

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ShowAnimation')
                    observer.unobserve(entry.target)
                }
            }
            )
        }, { threshold: 0.5 })

        const hiddenanimation = document.querySelectorAll('.HiddenAnimation')
        if (hiddenanimation)
            hiddenanimation.forEach((element) => { observer.observe(element) })
    }, [])

    return (
        <div className='relative overflow-hidden w-full'>
            {/* Content */}
            <div className='lg:px-12 lg:pt-12 py-12 px-6 ms-auto me-auto max-w-[1500px] relative z-10'>
                <div className="flex flex-col justify-center items-center">
                    {/* Badge */}
                    <div className="flex items-center w-full justify-center">
                        <div className="px-4 py-2 text-xs lg:text-sm rounded-full text-white bg-white/10 font-medium border border-white/20 backdrop-blur-sm">
                            For Master Artisans & Companies
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-[2.2rem] leading-[2.5rem] sm:text-4xl lg:text-5xl sm:leading-tight my-4 lg:my-5 text-center font-semibold lg:leading-tight HiddenAnimation lg:max-w-4xl text-white">
                        Train and Manage Your Apprenticeships <span className="text-[#14B8A6]">All in One Place</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base text-white/90 leading-relaxed text-center px-2 lg:px-0 lg:text-lg HiddenAnimation lg:max-w-2xl">
                        Whether you're a master artisan or a company, use Prentis to create programs, manage learners, and build talent pipelines.
                    </p>
                </div>
            </div>
        </div>
    )
}

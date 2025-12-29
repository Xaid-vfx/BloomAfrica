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
        <div className='relative overflow-hidden w-full bg-gradient-to-br from-[#0A1F44] to-[#0F2B54]'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] lg:w-[350px] lg:h-[350px] 2xl:w-[500px] 2xl:h-[500px] opacity-12 pointer-events-none" style={{ transform: 'translate(25%, -25%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-20 left-0 w-[250px] h-[250px] md:w-[300px] md:h-[300px] opacity-10 pointer-events-none" style={{ transform: 'translate(-30%, 0)' }}>
                <path fill="#2DD4BF" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            {/* Content */}
            <div className='lg:px-12 lg:pt-16 lg:pb-24 py-20 px-6 ms-auto me-auto max-w-[1500px] relative z-10'>
                <div className="flex flex-col justify-center items-center">
                    {/* Badge */}
                    <div className="flex items-center w-full justify-center">
                        <div className="px-5 py-3 text-sm rounded-full text-white bg-white/10 font-medium border border-white/20 backdrop-blur-sm">
                            For Master Artisans & Companies
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-[2.5rem] leading-[2.8rem] sm:text-4xl lg:text-6xl sm:leading-tight my-6 text-center font-semibold lg:leading-tight lg:my-6 HiddenAnimation lg:max-w-5xl text-white">
                        Transform Lives, Build Your <span className="text-[#14B8A6]">Legacy</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-white/90 leading-relaxed text-center px-2 lg:px-0 lg:text-xl HiddenAnimation lg:max-w-3xl">
                        Join Nigeria's premier apprenticeship platform as a trainer. Shape the next generation while growing your revenue and prestige.
                    </p>

                    {/* CTA Button */}
                    <div className="mt-8 lg:mt-10 flex justify-center">
                        <Link href="/signup?type=recruiter" className="bg-[#14B8A6] text-white px-8 py-4 rounded-lg text-center min-w-[220px] font-semibold hover:bg-[#0D9488] transition-all shadow-lg hover:shadow-xl">
                            Become a Trainer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

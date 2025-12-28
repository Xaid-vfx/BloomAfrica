'use client'

import Link from "next/link"
import { useEffect } from "react"

export default function Hero() {

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
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="/prentis-hero-vid.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/60"></div>

            {/* Content */}
            <div className='lg:px-12 lg:pt-16 lg:pb-24 pb-10 ms-auto me-auto max-w-[1500px] relative z-10'>
                <div className="px-4 mt-[3.2rem] flex flex-col justify-center items-center lg:mt-0">
                    <div className="flex items-center w-full justify-center">
                        <div className="px-5 py-3 text-sm rounded-full text-white bg-white/10 font-medium border border-white/20 backdrop-blur-sm">Africa's Premier Apprenticeship Platform</div>
                    </div>
                    <h1 className="text-[2.5rem] leading-[2.8rem] sm:text-4xl lg:text-6xl sm:leading-tight my-6 text-center font-semibold lg:leading-tight lg:my-6 HiddenAnimation lg:max-w-5xl text-white">
                        The Home of <span className="text-[#14B8A6]">Real Apprenticeships.</span>
                    </h1>

                    <p className="text-lg text-white/90 leading-relaxed text-center px-2 lg:px-0 lg:text-xl HiddenAnimation lg:max-w-2xl">
                        Get the expert training and qualifications you need to find your career path—whether you're landing a job or launching a company.
                    </p>

                    <div className="mt-8 lg:mt-10 flex justify-center">
                        <Link href="/all-trainings" className="bg-[#14B8A6] text-white px-8 py-3 rounded-lg text-center min-w-[200px] font-semibold hover:bg-[#0D9488] transition-all shadow-sm">
                            Find an Apprenticeship
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

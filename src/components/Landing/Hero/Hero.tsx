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
        <div className='lg:px-12 lg:pt-16 lg:pb-36 pb-10 ms-auto me-auto max-w-[1500px]'>
            <div className="px-4 mt-[3.2rem] flex flex-col justify-center items-center lg:mt-0">
                <div className="flex items-center w-full justify-center">
                    <div className="px-5 py-3 text-sm rounded-full text-white bg-white/20 font-medium border border-white/30">Africa's Premier Apprenticeship Platform</div>
                </div>
                <h1 className="text-[1.875rem] leading-[2.5rem] sm:text-4xl lg:text-6xl sm:leading-tight my-6 text-center font-semibold lg:leading-tight lg:my-6 HiddenAnimation lg:max-w-5xl text-white">
                    The Home of <span className="text-[#D4BBFF]">Real Apprenticeships.</span>
                </h1>

                <p className="text-lg text-white font-medium leading-relaxed text-center px-2 lg:px-0 lg:text-xl HiddenAnimation lg:max-w-2xl mb-3">
                    Find the perfect program for any career path.
                </p>
                <p className="text-base text-white/75 leading-relaxed text-center px-2 lg:px-0 lg:text-lg HiddenAnimation max-w-lg lg:max-w-2xl">
                    Master a craft or a trade, gain real experience, and earn accredited qualifications to land your dream job or start your own company.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-10 items-center justify-center">
                    <Link href="/all-trainings" className="bg-white text-[#1a0d35] px-8 py-3 rounded-lg text-center min-w-[200px] font-semibold hover:bg-white/90 transition-all">
                        Find an Apprenticeship
                    </Link>
                    <Link href="/all-trainings" className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-lg text-center min-w-[200px] font-semibold hover:bg-white/10 transition-all">
                        Explore Career Paths
                    </Link>
                </div>
            </div>
        </div>
    )
}

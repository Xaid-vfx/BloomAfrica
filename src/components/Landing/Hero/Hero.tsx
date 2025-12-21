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
        <div className='lg:px-12 lg:py-16 pb-10 ms-auto me-auto max-w-[1500px]'>
            <div className="px-4 mt-[3.2rem] flex flex-col justify-center items-center lg:mt-0">
                <div className="flex items-center w-full justify-center">
                    <div className="px-5 py-3 text-sm rounded-full text-[#4A2C84] bg-grey-100 font-medium">Africa's Premier Technical Fellowship</div>
                </div>
                <h1 className="text-[1.875rem] leading-[2.5rem] sm:text-3xl lg:text-5xl sm:leading-tight my-6 text-center font-semibold lg:leading-tight lg:my-6 HiddenAnimation lg:max-w-3xl">
                    Build Real Products. <span className="text-[#4A2C84]">Gain Verified Experience.</span>
                </h1>

                <p className="text-base text-grey-700 leading-relaxed text-center px-2 lg:px-0 lg:text-lg HiddenAnimation lg:max-w-2xl">
                    Get embedded in active startups, build live products, and earn a portfolio that proves your expertise—all with structured training and guided curriculum.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-10 items-center justify-center">
                    <Link href="/all-trainings" className="btn-primary px-8 py-3 rounded-lg text-center min-w-[200px]">
                        Apply to Fellowship
                    </Link>
                    <Link href="/all-trainings" className="btn-secondary px-8 py-3 rounded-lg text-center min-w-[200px]">
                        Explore Programs
                    </Link>
                </div>
            </div>
        </div>
    )
}

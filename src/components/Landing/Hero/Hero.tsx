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
        <div className='lg:flex lg:items-center lg:px-12 lg:py-16 pb-10 justify-center ms-auto me-auto max-w-[1500px]'>
            <div className="lg:w-[60%]">
                <div className="px-4 mt-[3.2rem] flex flex-col justify-center items-center lg:items-start lg:mt-0">
                    <div className="lg:flex lg:items-center lg:w-full lg:justify-start">
                        <div className="px-5 py-3 text-sm rounded-full text-[#4A2C84] bg-grey-100 font-medium">Africa's Premier Technical Fellowship</div>
                    </div>
                    <h1 className="text-[1.875rem] leading-[2.5rem] sm:text-3xl lg:text-5xl sm:leading-tight my-6 text-center font-semibold lg:text-left lg:leading-tight lg:my-6 HiddenAnimation lg:max-w-3xl">
                        Build Real Products. <span className="text-[#4A2C84]">Gain Verified Experience.</span>
                    </h1>

                    <p className="text-base text-grey-700 leading-relaxed text-center px-2 lg:px-0 lg:text-left lg:text-lg lg:w-11/12 HiddenAnimation lg:max-w-2xl">
                        Get embedded in active startups, build live products, and earn a portfolio that proves your expertise—all with structured training and guided curriculum.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-10 items-center">
                        <Link href="/all-trainings" className="btn-primary px-8 py-3 rounded-lg text-center min-w-[200px]">
                            Apply to Fellowship
                        </Link>
                        <Link href="/all-trainings" className="btn-secondary px-8 py-3 rounded-lg text-center min-w-[200px]">
                            Explore Programs
                        </Link>
                    </div>
                </div>
            </div>

            <div className="lg:my-10 lg:block hidden mt-4 mx-4 lg:w-[40%] relative">
                <div className="p-8 flex justify-center">
                    <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                        <div className="text-center p-6 bg-white rounded-xl border border-grey-200 HiddenAnimation">
                            <div className="text-5xl font-semibold text-grey-900">500+</div>
                            <div className="text-sm text-grey-600 mt-3 font-medium">Fellows Placed</div>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl border border-grey-200 HiddenAnimation">
                            <div className="text-5xl font-semibold text-grey-900">100+</div>
                            <div className="text-sm text-grey-600 mt-3 font-medium">Partner Startups</div>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl border border-grey-200 HiddenAnimation">
                            <div className="text-5xl font-semibold text-grey-900">95%</div>
                            <div className="text-sm text-grey-600 mt-3 font-medium">Employment Rate</div>
                        </div>
                        <div className="text-center p-6 bg-white rounded-xl border border-grey-200 HiddenAnimation">
                            <div className="text-5xl font-semibold text-grey-900">6 mo</div>
                            <div className="text-sm text-grey-600 mt-3 font-medium">Program Length</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

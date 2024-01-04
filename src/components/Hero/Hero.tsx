'use client'

import Link from "next/link"
import { useEffect } from "react"

export default function Hero() {

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log(entry);

                if (entry.isIntersecting) {
                    entry.target.classList.add('ShowAnimation')
                    observer.unobserve(entry.target)
                }
            }
            )
        }, { threshold: 0.5 })

        const hidden = document.querySelectorAll('.HiddenAnimation')
        if (hidden)
            hidden.forEach((element) => { observer.observe(element) })
    }, [])

    return (
        <div className='flex h-5/6 w-5/6 justify-center items-center h-screen flex-col'>
            <h1 className='HiddenAnimation text-4xl font-bold text-center my-6 xl:text-7xl'>Apprenticeships
                <br /> re-imagined.</h1>
            <p className='HiddenAnimation text-[#4b4b4b] my-2 tracking-wide font-normal text-center text-base xl:text-xl xl:w-4/6'>Turn regular jobs into apprenticeships, gaining qualifications for accelerated career growth and becoming a skilled professional.</p>
            <div className='HiddenAnimation flex gap-2 my-6'>
                <button className='border rounded-xl px-4 py-2 bg-black text-white xl:py-4 xl:px-8'>Find Jobs</button>
                <button className='border rounded-xl px-4 py-2'><Link href="/about">Learn more</Link></button>
            </div>

        </div>
    )
}
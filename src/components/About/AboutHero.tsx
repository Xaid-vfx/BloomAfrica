'use client'
import Image from 'next/image';
import Scribble from '../../assets/images/AboutScribble.png'
import Scribble2 from '../../assets/images/AboutScribble2.png'
import { useEffect } from "react";

export default function AboutHero() {

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

        const hidden = document.querySelectorAll('.HiddenAnimationStats')
        if (hidden)
            hidden.forEach((element) => { observer.observe(element) })
    }, [])



    return (
        <div className="lg:px-20 py-24 lg:bg-[#F8F8FD] relative">
            <Image src={Scribble} alt="scribble" width={100} className="hidden lg:block absolute top-0 left-0" />
            <Image src={Scribble2} alt="scribble" width={100} className="hidden lg:block absolute bottom-0 right-0" />

            <h1 className="mt-14 font-semibold text-center text-xl lg:text-5xl HiddenAnimationStats lg:leading-[1.5] lg:mt-0">
                Discover Exciting <span className="text-[#4A2C84]">Apprenticeship</span> Opportunities with Bloom
            </h1>
            <p className="hidden leading-9 lg:block text-center my-4 font-light text-sm HiddenAnimationStats">
                Bloom is an online platform that allows workers to turn ordinary job opportunities into valuable, exciting apprenticeships that leads to recognized qualifications, accelerating career growth and fostering skilled professionals.Our vision is to become the global leader in providing innovative education solutions that empower informal workers and MSME owners in emerging economies to unlock their full potential. Our platform will serve as the catalyst for change, enabling users to upskill themselves, grow their businesses, and connect with a world of employment opportunities.
            </p>
            <p className="lg:hidden my-4 font-light leading-7 text-sm">
                Explore job opportunities on the platform that align with your current job and chosen qualification. Explore job opportunities on the platform that align with your current job and chosen qualification. Explore job opportunities on the platform that align with your current job and chosen qualification.
            </p>

        </div>
    )
}
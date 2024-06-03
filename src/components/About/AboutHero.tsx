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
        <div className="lg:px-20 px-4 lg:py-24 py-20 lg:bg-[#F8F8FD] relative">
            <h1 className="mt-14 font-semibold text-center text-xl lg:text-5xl HiddenAnimationStats lg:leading-[1.5] lg:mt-0">
                Discover Exciting <span className="text-[#4A2C84]">Apprenticeship</span> Opportunities with Bloom
            </h1>
            <p className="leading-9 hidden lg:block text-center my-6 lg:my-4 text-sm HiddenAnimationStats">
                Bloom is an online platform that allows workers to turn ordinary job opportunities into valuable, exciting apprenticeships that leads to recognized qualifications, accelerating career growth and fostering skilled professionals.Our vision is to become the global leader in providing innovative education solutions that empower informal workers and MSME owners in emerging economies to unlock their full potential.Our platform will serve as the catalyst for change, enabling users to upskill themselves, grow their businesses, and connect with a world of employment opportunities.
            </p>
            <p className="leading-9 lg:hidden text-justify my-6 lg:my-4 text-sm HiddenAnimationStats">
                Bloom is an online platform that allows workers to turn ordinary job opportunities into valuable, exciting apprenticeships that leads to recognized qualifications, accelerating career growth and fostering skilled professionals.Our vision is to become the global leader in providing innovative education solutions that empower informal workers and MSME owners in emerging economies to unlock their full potential.
            </p>
            <Image src={Scribble} alt="scribble" width={100} className="hidden lg:block absolute top-0 left-0" />
            <Image src={Scribble2} alt="scribble" width={100} className="hidden lg:block absolute bottom-0 right-0" />
            <Image src={Scribble} alt="scribble" width={70} className=" lg:hidden absolute top-0 left-0" />
            <Image src={Scribble2} alt="scribble" width={70} className=" lg:hidden absolute bottom-0 right-0" />
        </div>
    )
}
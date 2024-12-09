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
            <h1 className="mt-14 font-semibold text-center text-3xl lg:text-5xl HiddenAnimationStats lg:leading-[1.5] lg:mt-0 ms-auto me-auto max-w-[1300px]">
                Discover Exciting <span className="text-[#4A2C84]">Apprenticeship</span> Opportunities with Bloom
            </h1>
            <p className="leading-9 hidden lg:block text-center my-6 lg:my-4 text-xl HiddenAnimationStats ms-auto me-auto max-w-[1300px]">
            We are empowering Africans by creating accessible local opportunities for personal and economic growth. We envision an Africa where the informal economy, alternative education, and non-traditional career paths are democratized, becoming vibrant and sustainable engines of growth. 
            </p>
            <p className="leading-9 lg:hidden text-justify my-6 lg:my-4 text-[1rem] HiddenAnimationStats ps-12 pe-12 ">
            We are empowering Africans by creating accessible local opportunities for personal and economic growth. We envision an Africa where the informal economy, alternative education, and non-traditional career paths are democratized, becoming vibrant and sustainable engines of growth. 
            </p>
            <Image src={Scribble} alt="scribble" width={100} className="hidden lg:block absolute top-0 left-0 " />
            <Image src={Scribble2} alt="scribble" width={100} className="hidden lg:block absolute bottom-0 right-0 " />
            <Image src={Scribble} alt="scribble" width={70} className=" lg:hidden absolute top-0 left-0 " />
            <Image src={Scribble2} alt="scribble" width={70} className=" lg:hidden absolute bottom-0 right-0" />
        </div>
    )
}
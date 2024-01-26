'use client'

import Image from "next/image";
import Hero from "../../assets/images/AboutHero.png"
import DHero from "../../assets/images/Man.png"
import StatsBox from "./StatsBox/StatsBox";
import { useEffect } from "react";
import SearchIcon from "../../assets/images/searchicon.png";
import CoursesIcon from "../../assets/images/coursesicon.png";
import CertificationIcon from "../../assets/images/certifcationicon.png";


export default function AboutHero() {

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

        const hidden = document.querySelectorAll('.HiddenAnimationStats')
        if (hidden)
            hidden.forEach((element) => { observer.observe(element) })
    }, [])



    return (
        <div className="lg:flex lg:px-20 lg:h-screen lg:items-center lg:justify-between lg:bg-[#f0f0fb]">
            <div className="lg:w-6/12 px-6">
                <h1 className="mt-14 font-semibold text-xl lg:text-5xl HiddenAnimationStats lg:mt-0">
                    Bloom Africa’s New Frontier
                    of Education
                </h1>
                <p className="hidden lg:block my-4 font-light leading-7 text-sm HiddenAnimationStats">
                    Bloom is an online platform that allows workers to turn ordinary job opportunities into valuable, exciting apprenticeships that leads to recognized qualifications, accelerating career growth and fostering skilled professionals.Our vision is to become the global leader in providing innovative education solutions that empower informal workers and MSME owners in emerging economies to unlock their full potential. Our platform will serve as the catalyst for change, enabling users to upskill themselves, grow their businesses, and connect with a world of employment opportunities.
                </p>
                <p className="lg:hidden my-4 font-light leading-7 text-sm">
                    Explore job opportunities on the platform that align with your current job and chosen qualification. Explore job opportunities on the platform that align with your current job and chosen qualification. Explore job opportunities on the platform that align with your current job and chosen qualification.
                </p>
            </div>
            <div className="my-10 mx-4 lg:w-5/12 relative">
                <div className="p-8 lg:p-4">
                    <Image src={DHero} alt="hero" className="" />
                </div>
                <div className="absolute top-[42%] HiddenAnimationStats">
                    <StatsBox image="" content="6k+ Candidates got jobs" />
                </div>
                <div className="absolute top-[10%] left-0 HiddenAnimationStats">
                    <StatsBox image={SearchIcon} content="Customized Job Board" />
                </div>
                <div className="absolute top-[36%] right-0 HiddenAnimationStats">
                    <StatsBox image={CoursesIcon} content="Unlimited online courses" />
                </div>
                <div className="absolute bottom-[5%] right-12 HiddenAnimationStats">
                    <StatsBox image={CertificationIcon} content="Free Certification" />
                </div>
            </div>
        </div>
    )
}
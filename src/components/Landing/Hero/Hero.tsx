'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import StatsBox from "../../About/StatsBox/StatsBox"
import SearchIcon from "../../../assets/images/searchicon2.png";
import CoursesIcon from "../../../assets/images/coursesicon.png";
import CertificationIcon from "../../../assets/images/certifcationicon.png";
import DHero from "../../../assets/images/Man.png"
import Star from "../../../assets/images/Star.png"
import { error, log } from "console"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/app/firebase.config"
import Search from "@/app/all-jobs/Search"
import { FiAward } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa6";

export default function Hero() {

    const [email, setemail] = useState('')

    function validateEmail(value: string) {
        var input = document.createElement('input');

        input.type = 'email';
        input.required = true;
        input.value = value;

        return typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);
    }

    async function inputWaitlist() {
        if (!validateEmail(email))
            alert('Please enter a valid email')
        else {
            try {
                const docref = await addDoc(collection(db, "waitlist"), {
                    Email: email
                });
                alert("Email added")
                console.log(docref.id);
            }
            catch (err) {
                alert("Some issue")
                console.log(err);
            }
        }
    }

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

        const hiddenanimation = document.querySelectorAll('.HiddenAnimation')
        if (hiddenanimation)
            hiddenanimation.forEach((element) => { observer.observe(element) })
    }, [])

    return (
        
        <div className='lg:flex lg:items-center lg:px-12 lg:py-8 pb-10 justify-center ms-auto me-auto max-w-[1500px] relative'>
            <div className="lg:w-[60%]">
                <div className="px-4 mt-[3.2rem] flex flex-col justify-center items-center lg:items-start lg:mt-0">
                    <div className="lg:flex lg:items-center lg:w-full lg:justify-between lg:pr-12">
                        <div className="px-5 py-3 text-sm rounded-full text-[#F38968] bg-white">Empower Your Career Journey</div>
                        <Image src={Star} alt="" width={40} className="hidden lg:block" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl leading-loose my-4 text-center font-semibold xl:text-[2.5em] lg:text-left lg:leading-[4rem] lg:my-2 HiddenAnimation lg:max-w-5xl md:max-w-2xl lg:min-w-[689px] ">
                        Discover Exciting <span className="Apprentice pb-4 lg:pb-3 text-[#4A2C84]">Apprenticeship </span>
                        Opportunities With Bloom
                    </h1>
                    <p className=" text-sm text-[#1A202C] leading-7 mt-2 text-center px-2 lg:px-0 lg:text-left lg:mt-4 lg:text-base lg:w-4/5 HiddenAnimation lg:max-w-2xl md:max-w-xl ">
                        Bloom connects aspiring professionals with a wide range of apprenticeship opportunities across various industries and sectors.
                    </p>

                </div>
                <div className="px-6 flex flex-col justify-center items-center lg:items-start lg:px-0">
                    <div className="w-full relative mt-8 flex rounded-2xl lg:justify-normal justify-center items-center  lg:rounded-full">
                        <Search />
                    </div>
                    <p className="text-xs text-center font-light my-2 lg:pl-4">Popular: Engineer, Tailoring</p>
                </div>
            </div>
            
            <div className="lg:my-10 lg:block hidden mt-4 mx-4 lg:w-[100%] xl:w-[40%] relative lg:top-[0px] lg:left-[70px] xl:left-[40px]">
                <div className="lg:p-8 p-4 lg:py-10 flex justify-center relative">
                    <Image src={DHero} alt="hero" className="w-[80%]" />
                    
                    <div className="absolute inset-0 ">
                        <div className="absolute top-[52%] left-[10%] w-fit HiddenAnimationStats">
                            <StatsBox id={1} image="" content="Learn a Skill" />
                        </div>
                        <div className="absolute top-[10%] left-[5%] w-fit HiddenAnimationStats">
                            <StatsBox id={2} image={SearchIcon} content="Apprentice" />
                        </div>
                            
                        <div className="absolute top-[0%] left-[45%] w-fit HiddenAnimationStats">
                            <StatsBox id={2} image={SearchIcon} content="Learn a Trade" />
                        </div>

                        <div className="absolute top-[36%] right-[5%] w-fit HiddenAnimationStats">
                            <StatsBox id={3} com={<FaBookOpen className="lg:text-2xl text-xl text-[#F38968]" />} content="Start your Business" />
                        </div>
                        <div className="absolute bottom-[5%] right-[15%] w-fit HiddenAnimationStats">
                            <StatsBox id={4} com={<FiAward className="lg:text-2xl text-xl text-[#F38968]" />} content="Get Certified" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import StatsBox from "../../About/StatsBox/StatsBox"
import SearchIcon from "../../../assets/images/searchicon.png";
import CoursesIcon from "../../../assets/images/coursesicon.png";
import CertificationIcon from "../../../assets/images/certifcationicon.png";
import DHero from "../../../assets/images/Man.png"
import Star from "../../../assets/images/Star.png"
import { error, log } from "console"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/app/firebase.config"

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
        <div className='lg:flex lg:items-center lg:h-screen lg:px-12 gradient'>
            <div className="lg:w-7/12">
                <div className="px-4 mt-20 flex flex-col justify-center items-center lg:items-start lg:mt-0">
                    <div className="lg:flex lg:items-center lg:w-full lg:justify-between lg:pr-12">
                        <div className="px-3 py-2 text-xs rounded-2xl text-[#F38968] bg-white">Upgrade Your Skills</div>
                        <Image src={Star} alt="" width={40} className="hidden lg:block" />
                    </div>
                    <h1 className="text-2xl leading-10 my-4 text-center font-semibold lg:text-5xl lg:text-left lg:leading-[4rem] lg:my-2 HiddenAnimation">
                        <span className="text-[#4A2C84]">Become</span> an <span className="Apprentice pb-3 lg:pb-3">Apprentice </span>
                        and <br className="hidden lg:block" />Own your
                        <span className="text-[#4A2C84]"> Career</span>
                    </h1>
                    <p className="text-xs text-[#8A8A8A] leading-6 mt-2 text-center lg:text-left lg:mt-4 lg:text-base lg:w-4/5 HiddenAnimation">
                        Unleash your potential with our digital apprenticeship platform that seamlessly blends hands-on work experience with personalized learning.
                    </p>

                </div>
                <div className=" px-10 flex flex-col justify-center items-center lg:items-start lg:px-0">
                    <div className="w-full relative mt-12 flex rounded-2xl items-center bg-white lg:w-2/3 lg:rounded-full">
                        <input type="string" className="w-2/3 rounded-2xl  px-4 py-2 placeholder:text-xs focus:outline-none lg:w-3/4 lg:rounded-full" placeholder="Enter email" onChange={(e) => { setemail(e.target.value) }} />

                        <button className=" m-1 w-1/3 right-2 top-2 text-xs px-2 py-2 rounded-2xl bg-purple-900 text-white lg:w-1/4 lg:py-4 lg:rounded-full" onClick={() => { inputWaitlist() }}>Join waitlist</button>
                    </div>
                    <p className="text-xs text-center font-light my-2 lg:pl-4">Reserve your spot on the waitlist*</p>
                </div>
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
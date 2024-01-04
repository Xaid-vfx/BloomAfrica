'use client'
import { useEffect } from "react";

export default function Demo() {

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log(entry);

                if (entry.isIntersecting) {
                    entry.target.classList.add('SlideUpAnimation')
                    observer.unobserve(entry.target)
                }

            }
            )
        }, { threshold: 0 })

        const hidden = document.querySelectorAll('.SlideUp')
        if (hidden)
            hidden.forEach((element) => { observer.observe(element) })
    }, [])

    return (
        <div className="w-full py-20 lg:py-0">
            <div className="First flex flex-col h-[100vh] px-10 lg:flex-row lg:h-screen lg:px-0">
                <div className="Left h-full w-full bg-[#725998] text-white flex justify-center items-center">Some image</div>
                <div className="Right h-full w-full bg-white flex flex-col lg:justify-center">
                    <div className="lg:px-20 lg:pr-40">
                        <div className="overflow-hidden text-2xl text-[#725998] mt-10 font-medium lg:mt-0 lg:text-2xl "><div className="SlideUp">Job Search</div> </div>
                        <h2 className="overflow-hidden my-5 text-xl font-medium lg:text-3xl"><div className="SlideUp">Search by Job or Qualifications</div></h2>
                        <p className="text-[#727272] font-light">Navigate our platform like a job board or find courses that align with your learning goals.</p>
                    </div>
                </div>
            </div>
            <div className="First flex flex-col h-[100vh] px-10 lg:flex-row-reverse lg:h-screen lg:px-0">
                <div className="Left h-full w-full bg-[#a98eba] text-white flex justify-center items-center">Some image</div>
                <div className="Right h-full w-full bg-white flex flex-col lg:justify-center">
                    <div className="lg:px-20 lg:pl-40">
                        <h1 className="overflow-hidden text-2xl text-[#a98eba] mt-10 font-medium lg:mt-0 lg:text-2xl"><div className="SlideUp">Job Listings</div></h1>
                        <h2 className="overflow-hidden my-5 text-xl font-medium lg:text-3xl"><div className="SlideUp">Different courses Available</div></h2>
                        <p className="text-[#727272] font-light">Unlike conventional job boards, our platform offers a dedicated section for courses and qualifications. Dive into our job board to uncover exclusive programs that align with your career aspirations.</p>
                    </div>
                </div>
            </div>
            <div className="First flex flex-col h-[100vh] px-10 lg:flex-row lg:h-screen lg:px-0">
                <div className="Left h-full w-full bg-[#5baaa7] text-white flex justify-center items-center">Some image</div>
                <div className="Right h-full w-full bg-white flex flex-col lg:justify-center">
                    <div className="lg:px-20 lg:pr-40">
                        <h1 className="overflow-hidden text-2xl text-[#5baaa7] mt-10 font-medium lg:mt-0 lg:text-2xl"><div className="SlideUp">Found a fit?</div></h1>
                        <h2 className="overflow-hidden my-5 text-xl font-medium lg:text-3xl"><div className="SlideUp">Apply!</div></h2>
                        <p className="text-[#727272] font-light">Once you've found a listing that piques your interest, delve into the job description and the course description to assess whether it aligns with your aspirations.
                            <br /><br />
                            Our application process is very easy. We have an acceptance rate of 100% all you need is your basic job application details. get hired, get educated, become a guru.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
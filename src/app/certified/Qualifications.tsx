'use client'
import Image from "next/image"
import Logo from '../../assets/images/LogoNew.png'
import { useState } from "react";

export default function Qualifications() {
    const [show, setshow] = useState(false);
    const courses = [
        "Diploma in Mechanical Engineering (Level 7)",
        "Diploma in Electrical Engineering (Level 7)",
        "Diploma in Construction & Civil Engineering (Level 7)",
        "Diploma in Cosmetology (Level 7)",
        "Diploma in Hospitality (Level 7)",
        "Diploma in Fashion Design, Textiles, and Apparel (Level 7)",
        "Diploma in Food & Culinary (Level 7)",
        "Diploma in Technology & Computer Science (Level 7)",
        "Diploma in Business & Entrepreneurship (Level 7)",
        "Certificate in Green Economy, Innovations and Practical Applications (Level 5)",
        "Certificate in Industry 4.0, Innovations and Practical Applications (Level 5)"
    ];
    return (
        <div className="pb-1 mt-16 lg:mt-12 ms-auto me-auto max-w-[1500px]">
            <h1 className="text-center text-2xl font-semibold">Available Qualifications</h1>
            <div className="hidden lg:grid lg:grid-cols-4 lg:px-16 px-4 gap-x-4 gap-y-4 lg:gap-y-6 mt-10">
                {
                    (courses).map((item) => {
                        return (
                            <div className="bg-white rounded-lg p-5 flex flex-col justify-between">
                                <Image src={Logo} alt="" width={50} className="bg-[#E9EBFD] rounded" />
                                <p className="text-[#4A2C84] font-medium my-2 w-[70%]">{item}</p>
                                <p className="text-[#7C8493] text-xs">Offered by Bloom</p>
                                <hr className="opacity-80 my-4" />
                                <p className="text-[#4A2C84] text-xs hover:underline cursor-pointer">Go to course</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className="lg:hidden grid lg:grid-cols-4 lg:px-16 px-4 gap-x-4 gap-y-4 lg:gap-y-6 mt-10">
                {
                    (show ? courses : courses.slice(0, 4)).map((item) => {
                        return (
                            <div className="bg-white rounded-lg p-5 flex flex-col justify-between">
                                <Image src={Logo} alt="" width={50} className="bg-[#E9EBFD] rounded" />
                                <p className="text-[#4A2C84] font-medium my-2 w-[70%]">{item}</p>
                                <p className="text-[#7C8493] text-xs">Offered by Bloom</p>
                                <hr className="opacity-80 my-4" />
                                <p className="text-[#4A2C84] text-xs hover:underline cursor-pointer">Go to course</p>
                            </div>
                        )
                    })
                }
                {!show ? <div onClick={() => { setshow(true) }} className="text-center text-white rounded-xl py-3 mx-6 bg-[#4A2C84] text-xs font-medium cursor-pointer">Show 7 more</div> : ""}
            </div>

        </div>
    )
}
'use client'
import Image from "next/image";
import Logo from '../../assets/images/Jobs/Company Logo.png';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { RiGraduationCapLine } from "react-icons/ri";

type Props = {
    id: string;
    title: string;
    type: string;
    location: string;
    salary: string;
    description: string;
    responsibilities: string;
    who_you_are: string;
    extras: string;
    company: string;
    diploma: string;
}

export default function FeaturedCard(props: Props) {
    return (
        <div className="py-6 px-6 my-4 mx-2 box_shadow bg-white rounded-xl">
            <div className="flex items-center">
                <Image src={Logo} alt=" " width={50} className="bg-[#E9EBFD] rounded-lg" />
                <div className="rounded-3xl font-semibold px-3 py-2 text-[#4A2C84]">{props.title}</div>
            </div>
            <hr className="mt-4 mb-3 opacity-50" />

            <h1 className="text-base font-medium">{props.company}</h1>
            <div className="flex flex-col h-[170px]">
                <div className=" h-[60px]">
                    <div className="flex mt-2 text-xs text-[#515B6F] gap-3 items-baseline">
                        <p className="flex items-center gap-1"> <HiOutlineLocationMarker className="text-[#4A2C84] text-lg font-semibold" /> {props.location}</p>
                        <p className="flex items-center gap-1"> <FaRegCalendarAlt className="text-[#4A2C84] text-base font-semibold" /> {props.type}</p>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#515B6F]"> <RiGraduationCapLine className="text-[#4A2C84] text-lg font-semibold" /> {props.diploma}
                    </p>
                </div>
                <p className="w-full text-xs mt-3 leading-6 text-[#515B6F] ">
                    {props.description}
                </p>
            </div>

            {/* tags */}
            <div className="">
                <hr className="mt-4 mb-3 opacity-50" />
                <div className="flex flex-wrap gap-2 my-4">

                    <div className="rounded-md text-xs px-3 py-1 bg-[#fc7c1320] text-[#E09100]">Education</div>
                    <div className="rounded-md text-xs border px-3 py-1 bg-[#56cdad27] text-[#56CDAD]">Finance</div>
                    <div className="rounded-md text-xs border px-3 py-1 bg-[#E9EBFD] text-[#8989FF]">Technology</div>
                </div>
            </div>

        </div>
    )
}
'use client'
import Image from "next/image";
import JobTag from "../JobTag/JobTag";
import Logo from '../../../assets/images/Jobs/Company Logo.png';

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
}

export default function MobileCard(props: Props) {
    return (
        <div className="py-8 px-6 box_shadow rounded-lg">
            <Image src={Logo} alt=" " width={50} />
            <h1 className="text-lg font-medium mt-4">{props.title}</h1>
            <div className="flex mt-2 text-sm text-[#515B6F] gap-2 items-baseline">
                <p>TechMe</p>
                <p>. {props.location}</p>
            </div>
            {/* tags */}
            <div className="flex gap-2 my-4">
                <div className="rounded-3xl text-xs px-2 py-1 bg-[#ebfffa] text-[#56CDAD]">{props.type}</div>
                <div
                    className=" w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-40"></div>
                <div className="rounded-3xl text-xs px-2 py-1 border border-[#FFB836] text-[#FFB836]">Marketing</div>
                <div className="rounded-3xl text-xs border px-2 py-1 border-[#4A2C84] text-[#4A2C84]">Design</div>
            </div>
            <button onClick={() => { props.handleClick() }} className=" text-white py-3 text-center bg-[#4A2C84] w-full rounded-3xl font-semibold text-xs" >Apply</button>

            <div className="w-full bg-gray-200 h-1.5 mt-4 mb-2">
                <div className=" bg-green-500 h-1.5 rounded-full w-1/2"></div>
            </div>
            <p className="text-xs text-[#7C8493]"><span className="text-black font-semibold">5 Applied</span> of 10 capacity</p>
        </div>
    )
}
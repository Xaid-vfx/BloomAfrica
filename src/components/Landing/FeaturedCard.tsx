'use client'
import Image from "next/image";
import Logo from '../../assets/images/Jobs/Company Logo.png';

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

export default function FeaturedCard(props: Props) {
    return (
        <div className="py-8 px-6 my-4 mx-2 box_shadow bg-white rounded-lg">
            <div className="flex justify-between items-center">
                <Image src={Logo} alt=" " width={50} />
                <div className="rounded-3xl text-xs px-3 py-2 border border-[#4A2C84] text-[#4A2C84]">{props.type}</div>
            </div>
            <h1 className="text-lg font-medium mt-4">{props.title}</h1>
            <div className="flex mt-2 text-sm text-[#515B6F] gap-2 items-baseline">
                <p>TechMe</p>
                <p>. {props.location}</p>
            </div>
            <p className="w-full text-xs my-3 leading-6 text-[#515B6F]">
                Browse our extensive collection of apprenticeship opportunities across me.
                I need a job now but a good designer...
            </p>
            {/* tags */}
            <div className="flex gap-2 my-4">

                <div className="rounded-3xl text-xs px-3 py-1 border border-[#FFB836] text-[#FFB836]">Marketing</div>
                <div className="rounded-3xl text-xs border px-3 py-1 border-[#4A2C84] text-[#4A2C84]">Design</div>
            </div>

        </div>
    )
}
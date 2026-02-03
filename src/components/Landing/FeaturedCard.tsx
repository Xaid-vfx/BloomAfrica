'use client'
import Image from "next/image";
import Logo from '../../assets/images/Jobs/Company Logo.png';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Clock } from "lucide-react";

type Props = {
    id: string;
    title: string;
    type: string;
    location: string;
    salary?: string;
    description: string;
    responsibilities?: string;
    who_you_are?: string;
    extras?: string;
    company: string;
    diploma: string; // Duration for fellowships
    technologies?: string[];
}

export default function FeaturedCard(props: Props) {
    return (
        <div className="py-6 px-6 my-4 mx-2 bg-white rounded-xl border border-grey-200 hover:border-[#14B8A6] transition-colors">
            <div className="flex items-center gap-3">
                <Image src={Logo} alt=" " width={50} className="bg-grey-100 rounded-lg p-2" />
                <div className="font-semibold text-sm text-grey-900">{props.title}</div>
            </div>
            <hr className="mt-4 mb-3 border-grey-200" />

            <h1 className="text-sm font-medium text-grey-700">{props.company}</h1>
            <div className="flex flex-col min-h-[170px]">
                <div className="mt-2">
                    <div className="flex flex-wrap text-xs text-grey-600 gap-3 items-center mb-2">
                        <p className="flex items-center gap-1">
                            <HiOutlineLocationMarker className="text-[#14B8A6] text-base" />
                            {props.location}
                        </p>
                        <p className="flex items-center gap-1">
                            <FaRegCalendarAlt className="text-[#14B8A6] text-sm" />
                            {props.type}
                        </p>
                    </div>
                    <p className="flex items-center gap-1 text-xs text-grey-600">
                        <Clock className="text-[#14B8A6]" size={16} />
                        {props.diploma}
                    </p>
                </div>
                <p className="w-full text-xs mt-4 leading-6 text-grey-600">
                    {props.description}
                </p>
            </div>

            {/* Technologies */}
            <div>
                <hr className="mt-4 mb-3 border-grey-200" />
                <div className="flex flex-wrap gap-2 my-4">
                    {props.technologies?.slice(0, 3).map((tech, index) => (
                        <div key={index} className="rounded-md text-xs px-3 py-1 bg-grey-100 text-grey-700 font-medium">
                            {tech}
                        </div>
                    ))}
                    {props.technologies && props.technologies.length > 3 && (
                        <div className="rounded-md text-xs px-3 py-1 bg-grey-100 text-grey-600">
                            +{props.technologies.length - 3} more
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

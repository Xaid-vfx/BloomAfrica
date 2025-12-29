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
    logo: string;
    companyName: string;
    category: string;
    certificate?: boolean;
    training_mode?: string;
    isVerified?: boolean;
}

export default function MobileCard(props: Props) {
    console.log("logo" + props.logo);
    console.log(props);

    return (
        <a href={`/all-trainings/job?id=${props.id}`} className=" flex  justify-center min-w- " >
            <div className="flex flex-col p-5 gap-2 border border-gray-200 rounded-xl mx-auto w-full  bg-white shadow-sm hover:shadow-md transition-shadow ">
                {props.isVerified && (
                    <span className="text-xs text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
                            <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Verified by Prentis
                    </span>
                )}

                <h1 className="text-lg text-left font-medium ">{props.title}</h1>

                <div className="flex flex-col sm:flex-row text-sm text-[#515B6F] gap-2 items-baseline">
                    <p >{props.companyName}</p>
                    <p className='hidden font-semibold sm:flex'>| </p>
                    <p>{props.location}</p>
                </div>
                {/* tags */}
                <div className="grid grid-cols-2 gap-1.5">
                    <div className="rounded-md text-[11px] px-2 py-1 bg-green-100 text-green-800 text-center truncate">{props.type}</div>
                    <div className="rounded-md text-[11px] px-2 py-1 border bg-gray-100 text-[#14B8A6] text-center truncate">{props.category}</div>
                    {props.certificate && <div className="rounded-md text-[11px] px-2 py-1 border bg-gray-100 text-[#14B8A6] text-center truncate">Certificate</div>}
                    {props.training_mode && <div className="rounded-md text-[11px] px-2 py-1 border bg-gray-100 text-[#14B8A6] text-center truncate">{props.training_mode}</div>}
                </div>

                {/*<a href={`/all-trainings/job?id=${props.id}`} className="mt-3 text-center " >
                    <p className="text-white py-3 bg-[#4A2C84]  rounded-2xl font-semibold text-xs">Enroll</p>
                </a>*/}

                {/* <div className="w-full bg-gray-200 h-1.5 mt-4 mb-2">
                    <div className=" bg-green-500 h-1.5 rounded-full w-1/2"></div>
                </div>
                <p className="text-xs text-[#7C8493]"><span className="text-black font-semibold">5 Applied</span> of 10 capacity</p> */}
            </div>
        </a>


    )
}
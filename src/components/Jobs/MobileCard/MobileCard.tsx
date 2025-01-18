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
}

export default function MobileCard(props: Props) {
    console.log("logo" + props.logo);

    return (
        <a href={`/all-jobs/job?id=${props.id}`} className=" flex  justify-center min-w- " >
            <div  className="flex flex-col p-5 gap-2 border rounded-2xl mx-auto w-full  bg-white hover:drop-shadow-lg ">
                 
                <h1 className="text-lg text-left font-medium ">{props.title}</h1>

                <div className="flex text-sm text-[#515B6F] gap-2 items-baseline">
                    <p >{props.companyName}</p>
                    <p>. {props.location}</p>
                </div>
                {/* tags */}
                <div className="flex gap-2 flex-wrap">
                    <div className="rounded-2xl min-w-max text-xs px-2 py-1 bg-[#ebfffa] text-[#56CDAD]">{props.type}</div>
                    <div
                        className=" w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-40"></div>
                    <div className="rounded-2xl min-w-max  text-xs px-2 py-1 border border-[#FFB836] text-[#FFB836]">{props.category}</div>
                    {/* <div className="rounded-3xl text-xs border px-2 py-1 border-[#4A2C84] text-[#4A2C84]">Design</div> */}
                </div>
                
                <a href={`/all-jobs/job?id=${props.id}`} className="mt-3 text-center " >
                    <p className="text-white py-3 bg-[#4A2C84]  rounded-2xl font-semibold text-xs">Apply</p>
                </a>

                {/* <div className="w-full bg-gray-200 h-1.5 mt-4 mb-2">
                    <div className=" bg-green-500 h-1.5 rounded-full w-1/2"></div>
                </div>
                <p className="text-xs text-[#7C8493]"><span className="text-black font-semibold">5 Applied</span> of 10 capacity</p> */}
            </div>
        </a>
        
        
    )
}
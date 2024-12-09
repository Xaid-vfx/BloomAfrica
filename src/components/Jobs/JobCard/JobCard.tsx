'use client'
import Image from "next/image";
import Logo from '../../../assets/images/Jobs/Company Logo.png'
import { type } from "os";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import SaveButton from "@/components/Button/SaveButton";


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
    category: string;
}

export default function JobCard(props: Props) {

    const router = useRouter()
    const handleJobCardClick = (id: string) => {
        router.push("all-jobs/job?id=" + id)
    }

    return (
        <div className="flex items-center justify-between border-2 rounded-2xl px-6 py-4 my-6 bg-white hover:drop-shadow-lg">
            <div className="flex flex-col">
                <div className="flex items-center gap-6">
                    <Image src={props.logo ? props.logo : Logo} alt="logo" width={70} height={50} />
                    <div className="">
                        <h1 className="text-xl font-medium mt-2">{props.title}</h1>
                        <div className="flex mt-2 text-base text-[#515B6F] gap-2 items-baseline">
                            <p>TechMe</p>
                            <p>. {props.location}</p>
                        </div>
                    </div>
                </div>
                <div className="ml-24 flex gap-2 my-4 items-center">
                    <div className="rounded-3xl text-sm min-w-max px-3 py-2 bg-[#ebfffa] text-[#56CDAD]">{props.type}</div>
                    <div
                        className=" w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-40"></div>
                    {/* <div className="rounded-3xl px-3 py-2 border border-[#FFB836] text-sm text-[#FFB836]">Marketing</div> */}
                    {props.category && <div className="rounded-3xl border px-3 py-2 border-[#4A2C84] text-sm text-[#4A2C84] min-w-max">{props.category}</div>}
                </div>
            </div>
            <div className="">
                <div className="flex flex-col gap-2">
                <button  className=" text-black border border-black py-3 text-center font-medium rounded-3xl px-14 hover:bg-gray-100 " >Save</button><a href={`all-jobs/job?id=${props.id}`} className=" text-white py-3 text-center bg-[#4A2C84]  rounded-3xl font-medium px-14 hover:bg-[#2f185e]" >Apply</a>
                </div>

                {/* <div className="w-full bg-gray-200 h-1.5 mt-4 mb-2">
                    <div className=" bg-green-500 h-1.5 rounded-full w-1/2"></div>
                </div>
                <p className="text-sm text-[#7C8493]"><span className="text-black font-semibold">5 Applied</span> of 10 capacity</p> */}
            </div>

        </div>
    )
}
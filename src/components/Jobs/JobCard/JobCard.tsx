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
    companyName: String;
    type: string;
    location: string;
    salary: string;
    description: string;
    responsibilities: string;
    who_you_are: string;
    extras: string;
    category: string;
    isVerified?: boolean;
    certificate?: boolean;
    training_mode?: string;
    user?: any;
}

export default function JobCard(props: Props) {

    const router = useRouter()
    const handleJobCardClick = (id: string) => {
        router.push("all-trainings/job?id=" + id)
    }

    return (
        <div className="flex items-center justify-between border-2 rounded-2xl px-6 py-4 my-6 bg-white hover:drop-shadow-md">
            <div className="flex flex-row">
                <div className='flex flex-col'>
                    <div className="flex items-center gap-6">
                        <div className="">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-medium mt-2">{props.title}</h1>
                                {props.isVerified && (
                                    <span className="text-sm text-[#4A2C84] bg-[#4A2C84]/10 px-2 py-1 rounded-full flex items-center gap-1">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#4A2C84"/>
                                            <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Verified by Bloom
                                    </span>
                                )}
                            </div>
                            <div className="flex mt-2 text-base text-[#515B6F] gap-2 items-baseline">
                                <p>{props.companyName}</p>
                                <p>| {props.location}</p>
                            </div>
                        </div>
                    </div>
                    <div className=" flex gap-2 my-4 items-center">
                        <div className="rounded-xl text-xs min-w-max px-3 py-2  font-semibold bg-green-100 text-green-800">{props.type}</div>
                        <div
                            className=" w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-40"></div>
                        {/* <div className="rounded-3xl px-3 py-2 border border-[#FFB836] text-sm text-[#FFB836]">Marketing</div> */}
                        {props.category && <div className="rounded-xl  border px-3 py-2 font-semibold text-xs bg-gray-100  text-[#4A2C84] min-w-max">{props.category}</div>}
                        {props.certificate && <div className="rounded-xl  border px-3 py-2 font-semibold bg-gray-100  text-xs text-[#4A2C84] min-w-max">Certificate Available</div>}
                        {props.training_mode && <div className="rounded-xl  border px-3 py-2 font-semibold bg-gray-100  text-xs text-[#4A2C84] min-w-max">{props.training_mode}</div>}
                    </div>
                </div>
            </div>
            <div className="">
                <div className="flex flex-col gap-2">
                    <SaveButton id={props.id} user={props.user?.id || null} />
                    <a href={`all-trainings/job?id=${props.id}`} className=" text-white py-3 text-center bg-[#4A2C84]  rounded-2xl font-medium px-14 hover:bg-[#2f185e]" >Enroll</a>
                </div>

                {/* <div className="w-full bg-gray-200 h-1.5 mt-4 mb-2">
                    <div className=" bg-green-500 h-1.5 rounded-full w-1/2"></div>
                </div>
                <p className="text-sm text-[#7C8493]"><span className="text-black font-semibold">5 Applied</span> of 10 capacity</p> */}
            </div>
        </div>
    )
}
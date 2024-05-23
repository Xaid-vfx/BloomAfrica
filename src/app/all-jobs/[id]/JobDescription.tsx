'use client'
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Logo from '../../../assets/images/Jobs/Company Logo.png'
import getAJob from "@/lib/getAJob/getAJob";
import Button from "@/components/Button/Button";
import getUser from "@/lib/getUser/getUser";
import SaveButton from "@/components/Button/SaveButton";
import SeekerNavbar from "../seekerNavbar";
import TestComp from "./TestComp";
import { Suspense, useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

async function getJob(userid: string) {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
        .from('Jobs')
        .select()
        .eq('uid', userid)

    if (error) {
        console.log(error);
    }

    return data;
}

export default function JobDescription(props) {
    const search = useSearchParams()
    const id = search.get('id')
    const [job, setjob] = useState()
    console.log(job);
    console.log(id);

    useEffect(() => {
        async function fetchJob() {
            const data = await getJob(id)
            setjob(data)
        }
        fetchJob()
    }, [])
    return (
        <div>
            <div className=" items-center justify-between border-2 px-6 py-4 my-6 mt-20 mx-20 hidden lg:flex">
                <div className="flex flex-col">
                    <div className="flex items-center gap-6">
                        <Image src={Logo} alt="logo" width={70} />
                        <div className="flex flex-col justify-center ">
                            <h1 className="text-xl font-semibold">{job != null ? job[0]?.title : <Skeleton width={200} height={30} className="mb-2" />}</h1>
                            <div className="flex text-sm text-[#515B6F] gap-2 items-baseline">
                                <p>Bloom</p>
                                <p>. {job != null ? job[0]?.location : <Skeleton width={100} />}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="flex gap-6">
                        <SaveButton user={props.user?.id} id={id}></SaveButton>
                        <Button user={props.user?.id} id={id}></Button>
                    </div>
                </div>
            </div>
            <div className="py-10 lg:hidden flex flex-col justify-center items-center bg-[#F8F8FD]">
                <Image src={Logo} alt="logo" width={100} />
                <h1 className="text-xl font-semibold">{job != null ? job[0]?.title : <Skeleton width={200} />}</h1>
                <div className="flex text-sm text-[#515B6F] gap-1 items-baseline">
                    <p>Bloom</p>
                    <p>. {job != null ? job[0]?.location : <Skeleton width={100} />}</p>
                </div>
                <div className="flex gap-2 mt-6">
                    <SaveButton user={props.user?.id} id={id}></SaveButton>
                    <Button user={props.user?.id} id={id}></Button>
                </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-row lg:flex justify-between px-6 lg:px-20 pb-20">
                <div className="lg:w-[60%]">
                    <div className="mt-10">
                        <h1 className="text-2xl font-semibold">Description</h1>
                        <p className="mb-7 mt-2 text-[#7C8493] text-sm">{job != null ? job[0]?.description : <Skeleton count={4} />}</p>
                    </div>
                    <div className="">
                        <h1 className="text-2xl font-semibold">Responsibilities</h1>
                        <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null ? job[0]?.responsibilities.replace("\n", "<br/>") : <Skeleton count={4} />}</p>
                    </div>
                    <div className="">
                        <h1 className="text-2xl font-semibold">Who We Are</h1>
                        <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null ? job[0]?.who_we_are : <Skeleton count={4} />}</p>
                    </div>
                    {/* <div className="">
                        <h1 className="text-2xl font-semibold">Nice-To-Haves</h1>
                        <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null ? job[0]?.extras : <Skeleton count={4} />}</p>
                    </div> */}
                </div>
                <div className="lg:w-[30%] mt-10">
                    <div>
                        <h1 className="text-2xl font-semibold mb-6 text-[#25324B]">About this Role</h1>


                        <div className="bg-[#F8F8FD] py-2 px-2 my-2">
                            <div className="w-full bg-gray-200 h-1.5 mt-4 mb-2">
                                <div className=" bg-green-500 h-1.5 rounded-full w-1/2"></div>
                            </div>
                            <p className="text-sm text-[#7C8493]"><span className="text-black font-semibold">5 Applied</span> of 10 capacity</p>
                        </div>

                        <div className="flex justify-between mt-8">
                            <p className="text-sm text-[#515B6F]">Compensation</p>
                            <p className="text-sm font-semibold">{job != null ? job[0]?.minsalary + "-" + job[0]?.maxsalary : <Skeleton width={150} />}</p>
                        </div>
                        <div className="flex justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Job Type</p>
                            <p className="text-sm font-semibold">{job != null ? job[0]?.type : <Skeleton width={100} />}</p>
                        </div>
                        <div className="flex justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Duration</p>
                            <p className="text-sm font-semibold">{job != null ? job[0]?.duration : <Skeleton width={150} />}</p>
                        </div>
                        <div className="flex justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Application Deadline</p>
                            <p className="text-sm font-semibold">{job != null ? job[0]?.deadline : <Skeleton width={150} />}</p>
                        </div>
                    </div>
                    <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                    <div>
                        <h1 className="text-2xl font-semibold mb-4 text-[#25324B]">Categories</h1>
                        <p className="rounded-3xl border px-3 py-2 border-[#4A2C84] text-sm text-[#4A2C84] w-fit">{job != null ? job[0]?.category : <Skeleton width={150} />}</p>
                    </div>
                    <div className="mt-8">
                        <h1 className="text-2xl font-semibold mb-4 text-[#25324B]">Skills Required</h1>
                        <p className="flex gap-2">{job != null ? job[0]?.skills.split(',').map((word, index) => (
                            <span className="rounded-3xl border px-3 py-2 border-[#4A2C84] text-sm text-[#4A2C84] w-fit" key={index}>{word.trim()}</span>
                        )) : <Skeleton width={150} />}</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
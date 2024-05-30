'use client'
import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Listing from "../Listing/Listing";
import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../Dashboard/Dashboard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import EditRecruiter from "./EditRecruiter";
import Post from "@/app/recruiter/post-a-job/page";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { BiHomeAlt2 } from "react-icons/bi";
import { PiBuildings } from "react-icons/pi";
import Bloom from '../../../assets/images/BloomLogo.png'
import { LuClipboardList } from "react-icons/lu";

type Props = {
    user: any
    company: any
    recruiter: any
}

export default function RecruiterContent(props: Props) {
    console.log(props.user);

    const supabase = createClientComponentClient()
    const [jobs, setjobs]: any = useState([])
    const [jobid, setjobid]: any = useState("")

    const [currTabIndex, setcurrTabIndex] = useState(0);
    const [showNav, setshowNav] = useState(false)

    function handleChangeTabIndex(index: any) {
        if (index != 3) setjobid("")
        setcurrTabIndex(index)
        setshowNav(false)
    }
    useEffect(() => {
        async function fetchJobs() {
            const { data, error } = await supabase
                .from('Jobs')
                .select()
                .eq('recruiter', props.user.id)

            return data;
        }
        fetchJobs().then(data => {
            setjobs(data)
        })
    }, [])

    // if (showNav) {
    //     return (
    //         <div className="h-[110vh] bg-[#F8F8FD] w-full overflow-hidden fixed top-0 z-10 duration-1000">
    //             <div className="w-full px-6 duration-1000">
    //                 <div className="my-6 relative w-full">
    //                     <AiOutlineClose className="text-2xl absolute top-2 cursor-pointer " onClick={() => { setshowNav(false) }} />
    //                     <div className="flex justify-center w-full"><Image src={Bloom} width={120} height={100} /></div>
    //                 </div>

    //                 <div className="flex flex-col justify-center my-3">
    //                     <div onClick={() => { handleChangeTabIndex(0) }} className={`  py-3 cursor-pointer px-4 flex gap-4 items-center  ${currTabIndex == 0 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
    //                         <BiHomeAlt2 className="text-xl" />
    //                         <p className=" ">Dashboard</p>
    //                     </div>
    //                     <div onClick={() => { handleChangeTabIndex(2) }} className={`my-1 py-3 cursor-pointer px-4 flex gap-4 items-center  ${currTabIndex == 2 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
    //                         <PiBuildings className="text-xl" />
    //                         <p className="">Company Profile</p>
    //                     </div>
    //                     <div onClick={() => { handleChangeTabIndex(3) }} className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${currTabIndex == 3 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
    //                         <LuClipboardList className="text-xl" />
    //                         <p className="">Job Listing</p>
    //                     </div>
    //                 </div>
    //             </div>
    //             <hr className="h-px bg-gray-200 border-0 mt-6 mb-4"></hr>
    //             <div className="text-base font-medium flex justify-center w-full">
    //                 <p className="text-white bg-[#4A2C84] w-full mx-4 text-center py-3 px-6 rounded-full">+ Post a Job</p>
    //             </div>
    //         </div>
    //     )
    // }
    return (
        <div className="flex">
            <Sidebar handleChangeTabIndex={(e: any) => {
                handleChangeTabIndex(e)
            }} currTabIndex={currTabIndex} />

            <div className="w-full flex flex-col h-screen">
                <Header showNav={() => { setshowNav(true) }} currTabIndex={currTabIndex} handleChangeTabIndex={(e: any) => {
                    handleChangeTabIndex(e)
                }} name={props.company ? props.company?.name : ""} />

                {currTabIndex == 0 ?
                    <Dashboard handleChangeTabIndex={(e: any) => {
                        handleChangeTabIndex(e)
                    }} getJobId={(e: any) => {
                        console.log(e);

                        setjobid(e)
                    }} user={props.user} company={props.company} jobs={jobs} recruiter={props.recruiter} /> : ""}
                {currTabIndex == 1 ?
                    <div className="border h-screen p-20">Messages</div>
                    : ""}
                {currTabIndex == 2 ?
                    <EditRecruiter user={props.user} recruiter={props.recruiter} company={props.company} />
                    : ""}
                {currTabIndex == 3 ?
                    <Listing job_id={jobid} user={props.user} jobs={jobs} />
                    : ""}
                {currTabIndex == 4 ? <Post user={props.user} handleChangeTabIndex={(e: any) => {
                    handleChangeTabIndex(e)
                }} /> : ""}
            </div>
        </div>
    )
}
'use client'
import AppliedTable from "@/components/General/AppliedTable";
import { useState } from "react";
import { SlOptions } from "react-icons/sl";

export default function Applied(props) {
    function startPayment(row) {
        console.log(row);
    }
    return (
        <div className="lg:pt-8 lg:px-8 lg:bg-[#F5F5F5] h-[95%] w-full">
            <div className="hidden lg:block bg-white rounded-xl">
                <h1 className="font-semibold text-2xl px-10 pt-6 pb-3">Recent Applications</h1>
                <AppliedTable startPayment={startPayment} jobs={props.appliedjobs} />
            </div>
            <div className="lg:hidden px-4 my-6">
                <p className="text-xl font-semibold">Jobs applied</p>
                <div className="">
                    {props.appliedjobs.map((job) => {
                        const [showOption, setshowOption] = useState(false)
                        return (
                            <div className="border p-4 my-4 relative">
                                {
                                    showOption && <a href={`/all-jobs/job?id=${job?.uid}`} className="bg-[#e0e0e0] p-4 absolute text-sm rounded-xl font-semibold right-1 top-10">
                                        View Job
                                    </a>
                                }
                                <div className="flex justify-between">
                                    <p className="font-semibold mb-3 text-lg">{job?.title}</p>
                                    <SlOptions onClick={() => {
                                        if (showOption) setshowOption(false)
                                        else setshowOption(true)
                                    }} className="text-xl" />
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-[#7C8493] mb-1 min-w-max">{job?.location}</p>
                                        <p className="min-w-max">{job?.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#7C8493] mb-1">Date applied</p>
                                        <p>{job?.created_at.substring(0, job.created_at.indexOf('T'))}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import JobListingCard from "../JobListingCard/JobListingCard";
import { useEffect, useState } from "react";
import getJobs from "@/lib/getJobs/getJobs";
import JobsTable from "@/components/General/JobsTable";


type Props = {
    user: any
    jobs: any
}

export default function Listing(props: Props) {

    return (
        <div className="px-8 pt-8 w-full h-full bg-[#F5F5F5]">
            <div className="jobs flex flex-col gap-6">
                <div>
                    <h1 className="font-semibold text-lg pb-2 pl-4">Manage Jobs</h1>
                    <div className="bg-white rounded-xl py-6 px-6">
                        <h1 className="font-semibold text-lg flex items-center gap-2"><p>Total jobs:</p> <span className="text-xs text-white bg-[#4A2C84] rounded-full py-1 px-2 font-normal">{props.jobs.length}</span></h1>
                    </div>
                </div>
                <div className="bg-white rounded-xl pt-8">
                    <h1 className="font-semibold text-2xl pb-4 pl-8">All Jobs</h1>

                    {
                        props.jobs.length > 0 ? <JobsTable jobs={props.jobs} /> : <div className="flex justify-center items-center h-[200px]">
                            No Jobs found!
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
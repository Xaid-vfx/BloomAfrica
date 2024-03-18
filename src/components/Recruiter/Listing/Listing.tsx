import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import JobListingCard from "../JobListingCard/JobListingCard";
import { useEffect, useState } from "react";
import getJobs from "@/lib/getJobs/getJobs";


type Props = {
    user: any
    jobs: any
}

export default function Listing(props: Props) {

    return (
        <div className="px-20 py-20 w-full">
            <div className="jobs flex flex-col gap-4">
                {props.jobs?.map((job: any) => {
                    return <JobListingCard title={job.title} location={job.location} salary={job.salary} />
                })}
            </div>
        </div>
    )
}
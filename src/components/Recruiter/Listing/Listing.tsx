import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import JobListingCard from "../JobListingCard/JobListingCard";
import { useEffect, useState } from "react";
import getJobs from "@/lib/getJobs/getJobs";
import JobsTable from "@/components/General/JobsTable";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import StickyHeadTable from "@/components/General/Table";
import { MoonLoader } from "react-spinners";
import { IoMdArrowRoundBack } from "react-icons/io";
import ApplicantDisplay from "./ApplicantDisplay";


type Props = {
    user: any
    jobs: any
}

export default function Listing(props: Props) {


    const [showJobApplications, setshowJobApplications] = useState(false)
    const [showApplicantDetails, setshowApplicantDetails] = useState(false)
    const [loading, setloading] = useState(false)
    const [applications, setapplications] = useState([])
    const [applicant, setapplicant] = useState()
    const [experience, setexperience] = useState()
    const router = useRouter()

    async function deleteJob(id: string) {
        console.log(id);
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('Jobs')
            .delete()
            .eq('id', id)


        console.log(data);
        if (error) {
            console.log(error);
        }
        else {
            alert("Job Deleted Successfully! Refresh")
        }
        router.refresh()
    }
    async function ApplicationsForSelectedJob(id: string) {
        console.log(id);
        setloading(true)
        setshowJobApplications(true)
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('Applicants')
            .select()
            .eq('job_id', id)
        console.log(data);
        setapplications(data)
        setloading(false)
        if (error) {
            console.log(error);
        }
    }
    async function fetchApplicantDetails(id: string) {
        console.log(id);
        setloading(true)
        setshowApplicantDetails(true)
        const supabase = createClientComponentClient()
        const { data: data1, error: error1 } = await supabase
            .from('Seekers')
            .select()
            .eq('unique_id', id)
            .single()
        const { data: data2, error: error2 } = await supabase
            .from('Experience')
            .select()
            .eq('unique_id', id)
            .single()

        console.log(data2);
        setexperience(data2)
        setapplicant(data1)
        setloading(false)
        if (error1) {
            console.log(error1);
        }
    }

    return (
        <div className="px-8 py-8 w-full h-full bg-[#F5F5F5] overflow-scroll">
            <div className="">

                {showJobApplications ?
                    <div>
                        {
                            showApplicantDetails ?
                                <div>
                                    <p onClick={() => { setshowApplicantDetails(false) }} className="mb-4 hover:underline cursor-pointer text-sm flex items-center gap-1"><IoMdArrowRoundBack className="text-xl" />Back to Applications</p>
                                    <div>
                                        <ApplicantDisplay experience={experience} applicant={applicant} />
                                    </div>
                                </div> :
                                <div>
                                    <p onClick={() => { setshowJobApplications(false) }} className="mb-4 hover:underline cursor-pointer text-sm flex items-center gap-1"><IoMdArrowRoundBack className="text-xl" />Back to Job listings</p>
                                    <div className="bg-white rounded-xl pt-8">
                                        <h1 className="font-semibold text-2xl pb-4 pl-8">Applications</h1>

                                        {
                                            loading ? <div className="flex justify-center items-center h-[300px]">
                                                <MoonLoader color="#4A2C84" /> </div> : applications?.length > 0 ? <StickyHeadTable fetchApplicantDetails={fetchApplicantDetails} applications={applications} /> : <div className="flex justify-center items-center h-[200px]">
                                                    No applications found!
                                                </div>
                                        }

                                    </div>
                                </div>
                        }
                    </div> :
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
                                props.jobs.length > 0 ? <JobsTable ApplicationsForSelectedJob={ApplicationsForSelectedJob} delete={deleteJob} jobs={props.jobs} /> : <div className="flex justify-center items-center h-[200px]">
                                    No Jobs found!
                                </div>
                            }
                        </div></div>}
            </div>
        </div>
    )
}
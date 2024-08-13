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
import { FaArrowRightLong } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogDemo } from "@/components/Modal/Modal";
import Applications from "../Applications/Applications";
import { toast } from "sonner";


type Props = {
    user: any
    jobs: any
    job_id: string
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
            toast.success("Job Deleted Successfully! Refresh")
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

    useEffect(() => {
        console.log(props.job_id);
        if (props.job_id != "")
            ApplicationsForSelectedJob(props.job_id)

    }, [])
    return (
        <div className="lg:px-8 lg:py-8 w-full h-full lg:bg-[#F5F5F5] overflow-scroll">
            <div className="">
                {showJobApplications ?
                    <div>
                        {
                            showApplicantDetails ?
                                <div className="">
                                    <p onClick={() => { setshowApplicantDetails(false) }} className="hidden lg:flex mb-4 hover:underline cursor-pointer text-sm  items-center gap-1"><IoMdArrowRoundBack className="text-xl" />Back to Applications</p>

                                    <p onClick={() => { setshowApplicantDetails(false) }} className="my-4 px-4 lg:hidden hover:underline cursor-pointer text-xl font-semibold flex items-center gap-4"><IoMdArrowRoundBack className="text-xl" />Applicant Details</p>
                                    <hr className="h-px lg:hidden bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                                    <div>
                                        <ApplicantDisplay experience={experience} applicant={applicant} />
                                    </div>
                                </div> :
                                <Applications ApplicationsForSelectedJob={ApplicationsForSelectedJob} setshowJobApplications={setshowJobApplications} loading={loading} fetchApplicantDetails={fetchApplicantDetails} user={props.user} applications={applications} />
                        }
                    </div> :
                    <div className="jobs flex flex-col gap-6 py-8 lg:py-0">
                        <div className="px-4 lg:px-0">
                            <h1 className="hidden lg:block font-semibold text-lg pb-2 lg:pl-4">Manage Jobs</h1>
                            <div className="bg-white rounded-xl lg:py-6 lg:px-6">
                                <h1 className="font-semibold text-lg flex items-center gap-2"><p>Total jobs:</p> <span className="text-xs text-white bg-[#4A2C84] rounded-full py-1 px-2 font-normal">{props.jobs.length}</span></h1>
                            </div>
                        </div>
                        <div className="px-4 mb-6 lg:hidden">
                            {/* <h1 className="font-medium text-lg">Recent Listings</h1> */}
                            <div className="flex flex-col gap-3">
                                {props.jobs && props.jobs.map((job: any) => {
                                    return (
                                        <div onClick={() => {
                                            ApplicationsForSelectedJob(job.uid)
                                        }} className="border rounded-md flex items-center gap-2 justify-between px-5 py-4 bg-white">
                                            <div className="">
                                                <p className="font-semibold mb-1">{job?.title}</p>
                                                <div className="text-sm text-[#4A2C84] flex item gap-1"><IoLocationOutline className="text-xl" /> {job?.location}</div>
                                            </div>
                                            <div className="min-w-fit rounded text-white text-xs py-2 px-2 bg-[#897DD3]">Show more</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="bg-white rounded-xl pt-8 hidden lg:block">

                            <h1 className="font-semibold text-2xl pb-4 pl-8">All Jobs</h1>

                            {
                                props.jobs.length > 0 ? <JobsTable ApplicationsForSelectedJob={ApplicationsForSelectedJob} delete={deleteJob} jobs={props.jobs} /> : <div className="flex justify-center items-center h-[200px]">
                                    No Jobs found!
                                </div>
                            }
                        </div>
                    </div>}
            </div>
        </div>
    )
}
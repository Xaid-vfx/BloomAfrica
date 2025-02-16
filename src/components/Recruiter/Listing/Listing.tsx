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
import { deleteJob, getApplicationsForJob } from "@/lib/jobs/jobUtils";


type Props = {
    user: any
    jobs: any
    job_id: string
    handleChangeTabIndex: (index: number) => void
}

export default function Listing(props: Props) {

    const [showJobApplications, setshowJobApplications] = useState(false)
    const [showApplicantDetails, setshowApplicantDetails] = useState(false)
    const [loading, setloading] = useState(false)
    const [applications, setapplications] = useState([])
    const [applicant, setapplicant] = useState()
    const [experience, setexperience] = useState()
    const router = useRouter()
    const [selectedJobApplications, setselectedJobApplications] = useState([])
    const [selectedJob, setselectedJob] = useState(null)


    async function handleDeleteJob(id: string) {
        try {
            await deleteJob(id);
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete job");
        }
    }

    async function ApplicationsForSelectedJob(job_id: string) {
        setloading(true);
        try {
            const { job, applications } = await getApplicationsForJob(job_id);
            setselectedJob(job);
            setselectedJobApplications(applications);
            setshowJobApplications(true);
        } catch (error) {
            toast.error("Failed to fetch applications");
        }
        setloading(false);
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
        async function fetchJobs() {
            const supabase = createClientComponentClient()
            const { data, error } = await supabase
                .from('Jobs')
                .select()
                .eq('recruiter', props.user.id)

            if (error) {
                console.log(error);
            }
            console.log(data);

            return data;
        }
        fetchJobs().then(data => {
            props.setjobs(data)
        })
    }, [])

    useEffect(() => {
        console.log(props.job_id);
        if (props.job_id != "")
            ApplicationsForSelectedJob(props.job_id)

    }, [])
    return (
        <div className="lg:py-8 lg:px-8 lg:bg-[#F5F5F5] h-[95%] w-full">
            <button
                onClick={() => props.handleChangeTabIndex(0)}
                className="lg:hidden flex items-center gap-2 text-[#4A2C84] hover:underline px-4 mb-6"
            >
                <IoMdArrowRoundBack className="text-xl" />
                <span>Back to Dashboard</span>
            </button>

            <div className="flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white p-0 lg:p-8 overflow-scroll">
                <div className="">
                    {showJobApplications ?
                        <div>
                            {
                                showApplicantDetails ?
                                    <div className="">
                                        <h1 className="font-semibold text-xl  hidden lg:block mb-5">Apprentice Profile
                                        </h1>
                                        <p onClick={() => { setshowApplicantDetails(false) }} className="hidden lg:flex mb-4 hover:underline cursor-pointer text-sm  items-center gap-1"><IoMdArrowRoundBack className="text-xl" />Back to Applications</p>

                                        <p onClick={() => { setshowApplicantDetails(false) }} className="my-4 px-4 lg:hidden hover:underline cursor-pointer text-xl font-semibold flex items-center gap-4"><IoMdArrowRoundBack className="text-xl" />Applicant Details</p>
                                        <hr className="h-px lg:hidden bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                                        <div>
                                            <ApplicantDisplay experience={experience} applicant={applicant} />
                                        </div>
                                    </div> :
                                    <Applications
                                        applications={selectedJobApplications}
                                        jobDetails={selectedJob}
                                        setshowJobApplications={setshowJobApplications}
                                        ApplicationsForSelectedJob={ApplicationsForSelectedJob}
                                        fetchApplicantDetails={fetchApplicantDetails}
                                        loading={loading}
                                        user={props.user}
                                    />
                            }
                        </div> :
                        <div className="jobs flex flex-col gap-6 ">
                            <div className="px-4 lg:px-0">
                                <h1 className=" font-bold text-[#4A2C84] text-2xl pt-7 pb-6 lg:pt-0 lg:pb-2 ">Manage Apprenticeships</h1>
                                <div className=" rounded-xl lg:pt-5 pb-2  ">
                                    <h1 className=" text-lg text-gray-600 flex items-center gap-2"><p>Total Apprenticeships Listed:</p> <span className="text-xs  text-white bg-[#4A2C84] rounded-full py-1 px-2 font-normal">{props.jobs.length}</span></h1>
                                </div>
                            </div>
                            <div className="px-4 mb-6 bg-white lg:hidden">
                                {/* <h1 className="font-medium text-lg">Recent Listings</h1> */}
                                <div className="flex flex-col gap-3">
                                    {props.jobs && props.jobs.map((job: any) => {
                                        return (
                                            <div onClick={() => {
                                                ApplicationsForSelectedJob(job.uid)
                                            }} className="border rounded-2xl flex items-center gap-2 justify-between p-5 bg-white">
                                                <div className="">
                                                    <p className="font-semibold mb-1">{job?.title}</p>
                                                    <div className="text-sm text-[#4A2C84] flex item gap-1"><IoLocationOutline className="text-xl" /> {job?.location}</div>
                                                </div>
                                                <div className="min-w-fit rounded-xl text-white font-semibold text-sm py-3 px-3 bg-[#4A2C84]">View Applicants</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl  hidden lg:block">

                                <h1 className="font-[500] text-2xl text-[#4A2C84] pb-4 ">All Apprenticeships</h1>

                                {
                                    props.jobs.length > 0 ? <JobsTable ApplicationsForSelectedJob={ApplicationsForSelectedJob} delete={handleDeleteJob} jobs={props.jobs} /> : <div className="flex justify-center items-center h-[200px]">
                                        No Apprenticeships found!
                                    </div>
                                }
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    )
}
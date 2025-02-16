import StickyHeadTable from "@/components/General/Table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { MoonLoader, PropagateLoader } from 'react-spinners'
import Posted from '../../../assets/images/Recruiter/Job Open.png'
import Applications from '../../../assets/images/Recruiter/Job Open(1).png'
import Shortlisted from '../../../assets/images/Recruiter/Job Open(2).png'
import { IoLocationOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import JobsTable from "@/components/General/JobsTable"
import { deleteJob, getApplicationsForJob } from "@/lib/jobs/jobUtils";
import { toast } from "sonner"
import { PiBuildings } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { BiMessage } from "react-icons/bi";
import { BsBuildingUp } from "react-icons/bs";
import { IoAddCircleOutline } from "react-icons/io5";

type Props = {
    user: any
    company: any
    jobs: any
    recruiter: any
    handleChangeTabIndex: (index: number) => void
    getJobId: (id: string) => void
}

export default function Dashboard(props: Props) {

    const supabase = createClientComponentClient()
    const [applications, setapplications] = useState(null)
    const [jobs, setjobs] = useState([])

    function handleJobCardClick(id) {
        console.log(id);
        props.getJobId(id)
        props.handleChangeTabIndex(3)
    }

    useEffect(() => {
        async function fetchJobs() {
            const { data, error } = await supabase
                .from('Jobs')
                .select()
                .eq('recruiter', props.user.id)

            return data;
        }
        async function fetchApplications(jobs) {
            if (jobs.length > 0) {
                const { data, error } = await supabase
                    .from('Applicants')
                    .select()
                    .eq('job_id', jobs[0].uid)
                return data;
            }
            return [];
        }
        fetchJobs().then(data => {
            setjobs(data)
            fetchApplications(data).then(application => {
                setapplications(application)
            })

        })
    }, [])

    async function handleDeleteJob(id: string) {
        try {
            await deleteJob(id);
            const updatedJobs = jobs.filter(job => job.uid !== id);
            setjobs(updatedJobs);
        } catch (error) {
            toast.error("Failed to delete job");
        }
    }

    async function ApplicationsForSelectedJob(job_id: string) {
        props.getJobId(job_id);
        props.handleChangeTabIndex(3);
    }

    return (
        <div className='flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white p-0 lg:p-8 overflow-scroll'>
            <h1 className="text-2xl font-bold text-[#4A2C84] px-4 lg:px-0 mt-7 mb-6 lg:mb-6">Good Morning,
                {' ' + props.recruiter?.name}
            </h1>
            <div className="flex flex-col lg:flex-row gap-3 px-3 lg:px-0 justify-between lg:mt-0 mb-8">
                {/* Mobile navigation buttons */}
                <div className="lg:hidden flex flex-col gap-3 w-full">
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <button
                            onClick={() => props.handleChangeTabIndex(2)}
                            className="py-4 px-4 border border-gray-200 rounded-lg bg-white w-full text-center text-[#4A2C84] hover:bg-[#F8F8FD] transition-all flex flex-col items-center gap-2"
                        >
                            <PiBuildings className="text-2xl" />
                            <span>Company Profile</span>
                        </button>
                        <button
                            onClick={() => props.handleChangeTabIndex(3)}
                            className="py-4 px-4 border border-gray-200 rounded-lg bg-white w-full text-center text-[#4A2C84] hover:bg-[#F8F8FD] transition-all flex flex-col items-center gap-2"
                        >
                            <LuClipboardList className="text-2xl" />
                            <span>My Apprenticeships</span>
                        </button>
                        <button
                            onClick={() => props.handleChangeTabIndex(5)}
                            className="py-4 px-4 border border-gray-200 rounded-lg bg-white w-full text-center text-[#4A2C84] hover:bg-[#F8F8FD] transition-all flex flex-col items-center gap-2"
                        >
                            <BiMessage className="text-2xl" />
                            <span>Messages</span>
                        </button>
                        <button
                            onClick={() => props.handleChangeTabIndex(6)}
                            className="py-4 px-4 border border-gray-200 rounded-lg bg-white w-full text-center text-[#4A2C84] hover:bg-[#F8F8FD] transition-all flex flex-col items-center gap-2"
                        >
                            <BsBuildingUp className="text-2xl" />
                            <span>Bank Details</span>
                        </button>
                    </div>
                    <button
                        onClick={() => props.handleChangeTabIndex(4)}
                        className="py-4 px-4 rounded-lg border border-gray-200 bg-white w-full text-center text-[#4A2C84] font-medium hover:bg-[#F8F8FD] transition-all flex items-center justify-center gap-2"
                    >
                        <IoAddCircleOutline className="text-xl" />
                        <span>Post Apprenticeship</span>
                    </button>
                </div>

                {/* Desktop stats - only visible on lg screens */}
                <div className="hidden lg:flex w-full gap-3">
                    <div className="py-4 px-4 border rounded-lg bg-white w-full flex items-center lg:gap-6 gap-3">
                        <Image src={Posted} alt="" width={60} />
                        <div>
                            <div className="text-xl lg:text-2xl font-medium">{props.jobs.length}</div>
                            <div className="text-[#7C8493] text-sm lg:text-base">Posted Jobs</div>
                        </div>
                    </div>
                    <div className="py-4 px-4 border rounded-lg bg-white w-full flex items-center lg:gap-6 gap-3">
                        <Image src={Applications} alt="" width={60} />
                        <div>
                            <div className="text-xl lg:text-2xl font-medium">{applications?.length}</div>
                            <div className="text-[#7C8493] text-sm lg:text-base">Applications</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 mb-6 lg:hidden">
                <h1 className="font-semibold text-lg">Recent Listings</h1>
                <div className="my-4 flex flex-col gap-3 overflow-scroll">
                    {jobs && jobs.slice(0, 4).map((job: any) => {
                        return (
                            <div onClick={() => {
                                handleJobCardClick(job.uid)
                            }} className="border rounded-xl flex items-center gap-2 justify-between px-5 py-4">
                                <div className="">
                                    <p className="font-semibold mb-1">{job?.title}</p>
                                    <div className="text-sm text-[#4A2C84] flex item gap-1"><IoLocationOutline className="text-xl" /> {job?.location}</div>
                                </div>
                                <div className="min-w-fit font-semibold rounded-xl text-white text-sm py-3 px-5 bg-[#4A2C84]">Show More</div>
                            </div>
                        )
                    })}
                </div>
                <div onClick={() => { props.handleChangeTabIndex(3) }} className="flex items-center text-[#4A2C84] gap-2 my-2 justify-center cursor-pointer hover:underline">View All <FaArrowRightLong /></div>
            </div>
            <div className="hidden lg:block bg-white rounded-xl pb-7">
                <h1 className="text-2xl font-[500] text-[#4A2C84] pt-6 pb-3">Recent Apprenticeships</h1>
                {
                    jobs.length > 0 ? (
                        <JobsTable
                            ApplicationsForSelectedJob={ApplicationsForSelectedJob}
                            delete={handleDeleteJob}
                            jobs={props.jobs}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-[200px]">
                            No Apprenticeships found!
                        </div>
                    )
                }
                {/* {applications?.length > 0 ? <StickyHeadTable applications={applications} /> :
                    <div className="flex justify-center items-center h-[300px]">
                        <MoonLoader color="#4A2C84" /> </div>} */}
            </div>
        </div>


    )
}
'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import JobListingCard from "../JobListingCard/JobListingCard";
import { useEffect, useState } from "react";
import getJobs from "@/lib/api/getJobs";
import JobsTable from "@/components/seeker/tables/JobsTable";
import { Router } from "next/router";
import { useRouter, useSearchParams } from "next/navigation";
import StickyHeadTable from "@/components/seeker/tables/Table";
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
import { useRecruiter } from "@/context/RecruiterContext";
import { Briefcase, Plus, TrendingUp } from "lucide-react";

export default function Listing() {
    const { user, recruiter, company } = useRecruiter();
    const searchParams = useSearchParams();
    const job_id = searchParams?.get('job') || '';

    const [jobs, setjobs] = useState<any[]>([])
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
                .eq('recruiter', user.id)

            if (error) {
                console.error(error);
                toast.error("Failed to fetch jobs");
                return [];
            }

            return data || [];
        }
        fetchJobs().then(data => {
            setjobs(data)
        })
    }, [user.id])

    useEffect(() => {
        if (job_id && job_id !== "")
            ApplicationsForSelectedJob(job_id)
    }, [job_id])

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            {showJobApplications ? (
                <div className="flex flex-col h-full overflow-hidden">
                    {showApplicantDetails ? (
                        <>
                            {/* Fixed Header */}
                            <div className="flex-shrink-0 px-4 py-6 lg:p-8 border-b border-gray-100">
                                <button
                                    onClick={() => setshowApplicantDetails(false)}
                                    className="flex items-center gap-2 text-[#14B8A6] hover:text-[#0D9488] font-medium mb-4 transition-colors"
                                >
                                    <IoMdArrowRoundBack className="text-xl" />
                                    Back to Applications
                                </button>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Apprentice Profile</h1>
                            </div>
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-4 py-6 lg:p-8">
                                <ApplicantDisplay experience={experience} applicant={applicant} />
                            </div>
                        </>
                    ) : (
                        <Applications
                            applications={selectedJobApplications}
                            jobDetails={selectedJob}
                            setshowJobApplications={setshowJobApplications}
                            ApplicationsForSelectedJob={ApplicationsForSelectedJob}
                            fetchApplicantDetails={fetchApplicantDetails}
                            loading={loading}
                            user={user}
                        />
                    )}
                </div>
            ) : (
                <>
                    {/* Fixed Header */}
                    <div className="flex-shrink-0 px-4 py-6 lg:p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                    <Briefcase className="text-[#14B8A6]" size={28} />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">My Apprenticeships</h1>
                                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                                        Total listings:
                                        <span className="inline-flex items-center justify-center bg-[#14B8A6] text-white text-sm font-semibold rounded-full px-3 py-1">
                                            {jobs.length}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => router.push('/recruiter/post-a-job')}
                                className="hidden lg:flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white py-3 px-5 rounded-xl font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                            >
                                <Plus size={20} />
                                Post New
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 lg:p-8">
                        {jobs.length > 0 ? (
                            <>
                                {/* Mobile View - Cards */}
                                <div className="lg:hidden flex flex-col gap-3">
                                    {jobs.map((job: any) => (
                                        <div
                                            key={job.uid}
                                            onClick={() => ApplicationsForSelectedJob(job.uid)}
                                            className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-[#14B8A6] hover:shadow-lg transition-all cursor-pointer"
                                        >
                                            <h3 className="font-semibold text-[#0A1F44] mb-2">{job.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                <IoLocationOutline className="text-[#14B8A6]" />
                                                {job.location}
                                            </div>
                                            <button className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                                View Applications
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View - Table */}
                                <div className="hidden lg:block">
                                    <JobsTable
                                        ApplicationsForSelectedJob={ApplicationsForSelectedJob}
                                        delete={handleDeleteJob}
                                        jobs={jobs}
                                    />
                                </div>
                            </>
                        ) : (
                            // Empty State
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
                                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Briefcase className="text-[#14B8A6]" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-[#0A1F44] mb-2">
                                    No Apprenticeships Yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Start by posting your first apprenticeship opportunity
                                </p>
                                <button
                                    onClick={() => router.push('/recruiter/post-a-job')}
                                    className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white py-3 px-6 rounded-xl font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Plus size={18} />
                                    Post Apprenticeship
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
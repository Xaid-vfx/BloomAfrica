'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from '../../../assets/images/Jobs/Company Logo.png'
import SaveButton from "@/components/Button/SaveButton";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from "sonner"
import { AgreementModal } from "@/components/Modal/AgreementModal";
import getIP from "@/lib/getIP/getIP";
import UAParser from "ua-parser-js";

interface Job {
    uid: string;
    title: string;
    description: string;
    location: string;
    type: string;
    signup_fee: number;
    limit: number;
    who_we_are: string;
    teaching_method: string;
    learning_outcomes: string;
    scheduling: string;
    outcomes: string;
    trainer_credentials: string;
    companylogo?: string;
    city: string;
    state: string;
    country: string;
    category: string;
    skills: string[];
    duration: string;
    deadline: string;
    start_date: string;
    provides_certificate: string;
    settlement: string;
    payment_type: string;
    training_mode: string;
    Recruiters: {
        CompanyInfo: {
            name: string;
            logo: string;
        }
    }
}

interface JobApplicationCount {
    applicant_count: number;
    confirmed_count: number;
}

interface JobWithCounts extends Job {
    job_applications_count: JobApplicationCount[];
}

interface Props {
    jobId: string | null;
    user: any;
}

async function getJob(userid: string): Promise<JobWithCounts | null> {
    const supabase = createClientComponentClient()
    const { data: jobData, error: jobError } = await supabase
        .from('Jobs')
        .select(`
            *,
            job_applications_count(
                applicant_count,
                confirmed_count
            ),
            Recruiters(
                CompanyInfo(
                    name,
                    logo
                )
            )
        `)
        .eq('uid', userid)
        .single()

    if (jobError) {
        console.log(jobError);
        return null;
    }

    return jobData;
}

export default function JobDetailPanel({ jobId, user }: Props) {
    const supabase = createClientComponentClient()
    const [job, setjob] = useState<JobWithCounts | null>(null)
    const router = useRouter()
    const [showAgreements, setShowAgreements] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [applicantCount, setApplicantCount] = useState(0);
    const [isAtCapacity, setIsAtCapacity] = useState(false);

    async function checkifSeekerisRegistered() {
        const { data, error } = await supabase
            .from('Seekers')
            .select()
            .eq('unique_id', user?.id)

        if (error) {
            console.log(error);
            return false;
        }
        else {
            if (data.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    async function checkifSeekerisAlreadyApplied() {
        const { data, error } = await supabase
            .from('Applicants')
            .select()
            .eq('seeker_id', user?.id)
            .eq('job_id', jobId)

        if (error) {
            console.log(error);
            return false;
        }

        return data.length > 0;
    }

    async function applyForJob() {
        const { data: currentCount } = await supabase
            .from('job_applications_count')
            .select('applicant_count, confirmed_count')
            .eq('job_id', jobId)
            .single();

        if (!job) return;

        const isPaidJob = job.signup_fee > 0;
        const confirmedCount = currentCount?.confirmed_count || 0;
        const totalCount = currentCount?.applicant_count || 0;

        const effectiveCount = isPaidJob ? confirmedCount : totalCount;

        if (effectiveCount >= job.limit) {
            toast.error("This position is no longer accepting applications");
            setIsAtCapacity(true);
            return;
        }

        setIsLoading(true);
        const { data: seekerData, error: seekerError } = await supabase
            .from('Seekers')
            .select()
            .eq('unique_id', user?.id)
            .single()

        if (seekerError) {
            console.error('Error fetching Seeker:', seekerError.message);
            return;
        }

        if (!seekerData) {
            console.error('Seeker not found');
            return;
        }

        const { data, error } = await supabase
            .from('Applicants')
            .insert({
                job_id: jobId,
                name: seekerData.name,
                is_confirmed: !isPaidJob,
                status: isPaidJob ? 'pending_payment' : 'confirmed'
            })

        if (error) {
            console.log(error);
            setIsLoading(false);
        }
        else {
            if (isPaidJob) {
                toast.success("Application submitted! Please complete the payment to confirm your spot.");
            } else {
                toast.success("Enrolled for the job!");
            }
            router.push('/seeker/applied')
        }
    }

    async function handleAgreement() {
        const ip = await getIP();
        const parser = new UAParser();
        const agent = parser.getResult();

        try {
            const { data, error } = await supabase
                .from('Agreements')
                .insert(
                    {
                        version: '1.0',
                        ip_address: ip,
                        agent: agent,
                        job_id: jobId
                    }
                )
                .select('agreement_id')
                .single()
            if (error) throw error
            else {
                applyForJob()
                setShowAgreements(false)
                return true;
            }
        }
        catch (error) {
            console.error(error)
            toast.error("Error while inserting agreement")
        }
    }

    async function handleApplyJob() {
        if (user == null) {
            router.push('/signup?continue=/all-trainings?selected=' + jobId)
            return
        }
        if (!await checkifSeekerisRegistered()) {
            toast("Please register as a seeker to enroll for a job")
            return
        }
        if (await checkifSeekerisAlreadyApplied()) {
            toast.error("Already Enrolled!")
            return
        }
        setShowAgreements(true)
    }

    useEffect(() => {
        async function fetchJob() {
            if (!jobId) return;

            const data = await getJob(jobId);
            setjob(data);

            if (!data) return;

            const isPaidJob = data.signup_fee > 0;
            const confirmedCount = data.job_applications_count?.[0]?.confirmed_count || 0;
            const totalCount = data.job_applications_count?.[0]?.applicant_count || 0;

            const effectiveCount = isPaidJob ? confirmedCount : totalCount;
            setApplicantCount(effectiveCount);

            setIsAtCapacity(effectiveCount >= data.limit);
        }
        fetchJob();
    }, [jobId]);

    if (!jobId) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400 py-20">
                <p>Select a job to view details</p>
            </div>
        );
    }

    return (
        <div className="pb-10">
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center flex-col justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <div className="animate-spin rounded-2xl h-12 w-12 border-t-2 border-b-2 border-[#14B8A6] mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Redirecting...</p>
                    </div>
                </div>
            )}
            <AgreementModal handleAgreement={handleAgreement} type={0} showAgreements={showAgreements} setShowAgreements={setShowAgreements} />

            {/* Header */}
            <div className="bg-white shadow-sm rounded-xl border px-6 py-5 mb-6 sticky top-0 z-10">
                <div className="flex w-full justify-between items-start gap-4">
                    <div className="flex flex-col justify-center min-w-0 flex-1">
                        <h1 className="text-2xl font-semibold text-gray-900 break-words mb-2">
                            {job != null ? job?.title : <Skeleton width={300} height={32} />}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="break-words">{job?.Recruiters.CompanyInfo?.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="break-words">{job != null ? job?.location : <Skeleton width={100} />}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <SaveButton user={user?.id} id={jobId} />
                        <button
                            onClick={handleApplyJob}
                            className={`text-white py-3 px-6 text-center bg-[#14B8A6] rounded-lg font-medium transition-all duration-200 hover:bg-[#0D9488] focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 ${
                                isAtCapacity ? 'opacity-50 cursor-not-allowed hover:bg-[#14B8A6]' : ''
                            }`}
                            disabled={isAtCapacity}
                        >
                            {isAtCapacity ? 'No Longer Accepting' : 'Enroll Now'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-5">
                {/* Main content (70%) */}
                <div className="lg:w-[70%] border rounded-xl p-5">
                    <div className="mt-5">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="mb-7 text-[#7C8493] text-sm break-words whitespace-pre-line">{job != null ? job?.description : <Skeleton count={4} />}</p>
                    </div>
                    <div className="">
                        <h2 className="text-xl font-semibold mb-2">Who We Are</h2>
                        <p className="mb-7 text-[#7C8493] text-sm break-words whitespace-pre-line">{job != null ? job?.who_we_are : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <h2 className="text-xl font-semibold mb-2">Teaching Method</h2>
                        <p className="mb-7 text-[#7C8493] text-sm break-words whitespace-pre-line">{job != null ? job?.teaching_method : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <h2 className="text-xl font-semibold mb-2">What You Will Learn</h2>
                        <p className="mb-7 text-[#7C8493] text-sm whitespace-pre-line break-words">{job != null ? job?.learning_outcomes : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <h2 className="text-xl font-semibold mb-2">Scheduling and Delivery</h2>
                        <p className="mb-7 text-[#7C8493] text-sm break-words whitespace-pre-line">{job != null ? job?.scheduling : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <h2 className="text-xl font-semibold mb-2">Career Outcomes</h2>
                        <p className="mb-7 text-[#7C8493] text-sm break-words whitespace-pre-line">{job != null ? job?.outcomes : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <h2 className="text-xl font-semibold mb-2">Trainer Credentials</h2>
                        <p className="mb-7 text-[#7C8493] text-sm break-words whitespace-pre-line">{job != null ? job?.trainer_credentials : <Skeleton count={4} />}</p>
                    </div>
                </div>

                {/* Sidebar (30%) */}
                <div className="lg:w-[30%] border rounded-xl p-5 h-fit">
                    <div className=''>
                        <h2 className="text-xl font-semibold mb-6 text-[#25324B]">About this Role</h2>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F] mb-1">Signup Fee</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-4 py-2 text-base font-semibold border border-gray-200">
                                {job != null ?
                                    job?.signup_fee ?
                                        "₦" + Number(job?.signup_fee).toLocaleString('en-NG') :
                                        "Free"
                                    : <Skeleton width={150} />}
                            </p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F] mb-1">Training Mode</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.training_mode : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F] mb-1">Start Date</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? new Date(job?.start_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F] mb-1">Certificate</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ?
                                job?.provides_certificate === "Yes" ?
                                    "Certificate Available" :
                                    "Unavailable"
                                : <Skeleton width={150} />}
                            </p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F] mb-1">Compensation</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">
                                {job != null ?
                                    job?.payment_type === "Unpaid" ?
                                        "Unpaid" :
                                        job?.settlement || "Not specified"
                                    : <Skeleton width={150} />}
                            </p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F] mb-1">Job Type</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.type : <Skeleton width={100} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F] mb-1">Duration</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.duration : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F] mb-1">Location</p>
                            <p className="bg-gray-200 rounded-lg px-2 py-1 text-sm font-semibold w-fit">{job != null ? `${job?.city}, ${job?.state}, ${job?.country}` : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F] mb-1">Maximum Applicants</p>
                            <p className="bg-gray-200 rounded-lg px-2 py-1 text-sm font-semibold w-fit">{job != null ? job?.limit : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F] mb-1">Application Deadline</p>
                            <p className="bg-gray-200 rounded-lg px-2 py-1 text-sm font-semibold w-fit">{job != null ? job?.deadline : <Skeleton width={150} />}</p>
                        </div>
                    </div>
                    <hr className="h-px my-6 bg-gray-200 border-0 p-0"></hr>
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-[#25324B]">Category</h2>
                        <p className="rounded-lg border px-3 py-2 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-sm text-[#14B8A6] w-fit font-medium">{job != null ? job?.category : <Skeleton width={150} />}</p>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold mb-4 text-[#25324B]">Skills Required</h2>
                        <div className="flex flex-wrap gap-2">{job != null ? job?.skills?.map((word, index) => (
                            <span className="rounded-lg border px-3 py-2 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-sm text-[#14B8A6] break-words w-fit font-medium" key={index}>{word.trim()}</span>
                        )) : <Skeleton width={150} />}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Logo from '../../../../assets/images/Jobs/Company Logo.png'
import getAJob from "@/lib/api/getAJob";
import Button from "@/components/Button/Button";
import getUser from "@/lib/api/getUser";
import SaveButton from "@/components/Button/SaveButton";
import SeekerNavbar from "../_components/SeekerNavbar";
import TestComp from "./TestComp";
import { Suspense, useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from "sonner"
import { AgreementModal } from "@/components/Modal/AgreementModal";
import getIP from "@/lib/api/getIP";
import UAParser from "ua-parser-js";
import {
    FileText, Building2, BookOpen, GraduationCap, Calendar,
    TrendingUp, Award, Monitor, Clock, MapPin, Users, Briefcase,
    Wallet, AlertCircle, DollarSign
} from 'lucide-react';

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

export default function JobDescription(props: { user: { id: string } }) {
    // Helper Components
    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#0A1F44]/10 p-2 rounded-lg">
                <Icon size={20} className="text-[#0A1F44]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
    );

    const SidebarField = ({ icon: Icon, label, value, loading, useTeal = false }: {
        icon: any, label: string, value: React.ReactNode, loading: boolean, useTeal?: boolean
    }) => (
        <div className="flex items-start gap-2 py-2 lg:border-b border-gray-100 lg:last:border-0">
            <div className={`${useTeal ? 'bg-[#14B8A6]/10' : 'bg-[#0A1F44]/10'} p-1.5 rounded-md flex-shrink-0`}>
                <Icon size={14} className={useTeal ? 'text-[#14B8A6]' : 'text-[#0A1F44]'} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-600 mb-0.5">{label}</p>
                {loading ? <Skeleton width={100} height={14} /> : (
                    <p className="text-xs font-semibold text-gray-900 break-words">{value}</p>
                )}
            </div>
        </div>
    );

    const supabase = createClientComponentClient()
    const search = useSearchParams()
    const id = search.get('id')
    const [job, setjob] = useState<JobWithCounts | null>(null)
    const router = useRouter()
    const [showAgreements, setShowAgreements] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [applicantCount, setApplicantCount] = useState(0);
    const [isAtCapacity, setIsAtCapacity] = useState(false);

    async function checkifSeekerisRegistered() {
        console.log(props.user?.id);
        const { data, error } = await supabase
            .from('Seekers')
            .select()
            .eq('unique_id', props.user?.id)

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
            .eq('seeker_id', props.user?.id)
            .eq('job_id', id)

        if (error) {
            console.log(error);
            return false;
        }

        return data.length > 0;
    }

    async function applyForJob() {
        // First check if the job is still available
        const { data: currentCount } = await supabase
            .from('job_applications_count')
            .select('applicant_count, confirmed_count')
            .eq('job_id', id)
            .single();

        if (!job) return;

        // For jobs with signup fee, only count confirmed (paid) applications
        const isPaidJob = job.signup_fee > 0;
        const confirmedCount = currentCount?.confirmed_count || 0;
        const totalCount = currentCount?.applicant_count || 0;
        
        // Use confirmed count for paid jobs, total count for free jobs
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
            .eq('unique_id', props.user?.id)
            .single()

        if (seekerError) {
            console.error('Error fetching Seeker:', seekerError.message);
            return;
        }

        if (!seekerData) {
            console.error('Seeker not found');
            return;
        }

        // Insert application with is_confirmed based on signup fee
        const { data, error } = await supabase
            .from('Applicants')
            .insert({ 
                job_id: id, 
                name: seekerData.name,
                is_confirmed: !isPaidJob, // Auto-confirm if no signup fee
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
                        job_id: id
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
        if (props.user == null) {
            router.push('/signup?continue=/job?id=' + id)
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
            if (!id) return;
            
            const data = await getJob(id);
            setjob(data);

            if (!data) return;

            // For jobs with signup fee, only count confirmed applications
            const isPaidJob = data.signup_fee > 0;
            const confirmedCount = data.job_applications_count?.[0]?.confirmed_count || 0;
            const totalCount = data.job_applications_count?.[0]?.applicant_count || 0;
            
            // Use confirmed count for paid jobs, total count for free jobs
            const effectiveCount = isPaidJob ? confirmedCount : totalCount;
            setApplicantCount(effectiveCount);

            // Check if at capacity
            setIsAtCapacity(effectiveCount >= data.limit);
        }
        fetchJob();
    }, [id]);

    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center flex-col justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <div className="animate-spin rounded-2xl h-12 w-12 border-t-2 border-b-2 border-[#0A1F44] mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Redirecting...</p>
                    </div>
                </div>
            )}
            <AgreementModal handleAgreement={handleAgreement} type={0} showAgreements={showAgreements} setShowAgreements={setShowAgreements} />
            <div className="bg-white shadow-sm rounded-xl border-2 px-6 py-5 my-6 mt-20 mx-4 lg:mx-20 hidden lg:flex">
                <div className="flex w-full justify-between items-center">
                    <div className="flex flex-col justify-center min-w-0">
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
                    <div className="flex items-center gap-4">
                        <SaveButton user={props.user?.id} id={id} />
                        <button
                            onClick={handleApplyJob}
                            className={`text-white py-3 px-8 text-center bg-[#0A1F44] rounded-xl font-medium transition-all duration-200 hover:bg-[#1E3A8A] focus:ring-2 focus:ring-[#0A1F44] focus:ring-offset-2 ${
                                isAtCapacity ? 'opacity-50 cursor-not-allowed hover:bg-[#0A1F44]' : ''
                            }`}
                            disabled={isAtCapacity}
                        >
                            {isAtCapacity ? 'No Longer Accepting' : 'Enroll Now'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="py-5 px-5 lg:hidden flex flex-col text-center justify-center items-center bg-white border-b border-gray-100">
                <Image src={job != null ? job?.companylogo != null ? job.companylogo : Logo : Logo} alt="logo" width={60} height={30} className="mb-2" />
                <h1 className="text-lg font-semibold break-words px-4 text-[#0A1F44]">{job != null ? job?.title : <Skeleton width={200} />}</h1>
                <div className="flex flex-col text-center text-xs text-[#515B6F] gap-0.5 mb-3 items-baseline w-full px-4">
                    <p className='flex mx-auto justify-center break-words'>{job?.Recruiters.CompanyInfo?.name}</p>
                    <p className='flex mx-auto justify-center break-words'> {job != null ? job?.location : <Skeleton width={100} />}</p>
                </div>
                <div className="flex gap-2 mt-2">
                    <SaveButton user={props.user?.id} id={id}></SaveButton>
                    <button
                        onClick={() => { handleApplyJob() }}
                        className={`text-white py-2.5 text-center bg-[#0A1F44] rounded-2xl font-medium px-12 text-sm transition-all hover:bg-[#1E3A8A] ${isAtCapacity ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isAtCapacity}
                    >
                        {isAtCapacity ? 'No Longer Accepting' : 'Enroll'}
                    </button>
                </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-row lg:flex gap-5 px-4 lg:px-20 pb-20">
                <div className="lg:w-[70%] border-2 rounded-xl p-4 lg:p-5">
                    <div className="mt-5">
                        <SectionHeader icon={FileText} title="Description" />
                        <p className="mb-7 mt-2 text-[#7C8493] text-sm break-words">{job != null ? job?.description : <Skeleton count={4} />}</p>
                    </div>
                    <div className="">
                        <SectionHeader icon={Building2} title="Who We Are" />
                        <p className="mb-7 my-2 text-[#7C8493] text-sm break-words">{job != null ? job?.who_we_are : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <SectionHeader icon={BookOpen} title="Teaching Method" />
                        <p className="mb-7 my-2 text-[#7C8493] text-sm break-words">{job != null ? job?.teaching_method : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <SectionHeader icon={GraduationCap} title="What You Will Learn" />
                        <p className="mb-7 my-2 text-[#7C8493] text-sm whitespace-pre-line break-words">{job != null ? job?.learning_outcomes : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <SectionHeader icon={Calendar} title="Scheduling and Delivery" />
                        <p className="mb-7 my-2 text-[#7C8493] text-sm break-words">{job != null ? job?.scheduling : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <SectionHeader icon={TrendingUp} title="Career Outcomes" />
                        <p className="mb-7 my-2 text-[#7C8493] text-sm break-words">{job != null ? job?.outcomes : <Skeleton count={4} />}</p>
                    </div>

                    <div className="">
                        <SectionHeader icon={Award} title="Trainer Credentials" />
                        <p className="mb-7 my-2 text-[#7C8493] text-sm break-words">{job != null ? job?.trainer_credentials : <Skeleton count={4} />}</p>
                    </div>
                </div>
                <div className="lg:w-[30%] mt-10 lg:mt-0 border-2 rounded-xl lg:p-5 p-4">
                    <div className=''>
                        <h1 className="lg:text-2xl text-xl font-semibold lg:mb-6 mb-4 text-[#25324B] lg:mt-5 mt-3">About this Role</h1>

                        {/* Signup Fee - Featured */}
                        <div className="bg-gradient-to-br from-[#14B8A6]/5 to-[#14B8A6]/10 border-2 border-[#14B8A6]/20 rounded-xl lg:p-4 p-3 lg:mb-6 mb-4">
                            <div className="flex items-center gap-2 lg:mb-2 mb-1">
                                <DollarSign size={18} className="text-[#14B8A6]" />
                                <p className="text-xs lg:text-sm text-gray-600">Signup Fee</p>
                            </div>
                            <p className="lg:text-2xl text-xl font-bold text-gray-900">
                                {job ? (
                                    job.signup_fee ? `₦${Number(job.signup_fee).toLocaleString('en-NG')}` : "Free"
                                ) : <Skeleton width={100} />}
                            </p>
                        </div>

                        {/* Key Details */}
                        <div className="lg:space-y-0 lg:mb-6 mb-4 grid lg:grid-cols-1 grid-cols-2 gap-x-2">
                            <SidebarField
                                icon={Monitor}
                                label="Training Mode"
                                value={job?.training_mode}
                                loading={!job}
                                useTeal={true}
                            />
                            <SidebarField
                                icon={Calendar}
                                label="Start Date"
                                value={job ? new Date(job.start_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : null}
                                loading={!job}
                                useTeal={true}
                            />
                            <SidebarField
                                icon={Award}
                                label="Certificate"
                                value={job?.provides_certificate === "Yes" ? "Available" : "Not Available"}
                                loading={!job}
                                useTeal={true}
                            />
                            <SidebarField
                                icon={Wallet}
                                label="Compensation"
                                value={job?.payment_type === "Unpaid" ? "Unpaid" : job?.settlement || "Not specified"}
                                loading={!job}
                            />
                            <SidebarField
                                icon={Briefcase}
                                label="Job Type"
                                value={job?.type}
                                loading={!job}
                            />
                            <SidebarField
                                icon={Clock}
                                label="Duration"
                                value={job?.duration}
                                loading={!job}
                            />
                            <SidebarField
                                icon={MapPin}
                                label="Location"
                                value={job ? `${job.city}, ${job.state}, ${job.country}` : null}
                                loading={!job}
                            />
                            <SidebarField
                                icon={Users}
                                label="Max Applicants"
                                value={job?.limit}
                                loading={!job}
                            />
                            <SidebarField
                                icon={AlertCircle}
                                label="Deadline"
                                value={job?.deadline}
                                loading={!job}
                            />
                        </div>
                    </div>
                    <hr className="h-px lg:my-6 my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                    <div>
                        <h1 className="lg:text-2xl text-lg font-semibold lg:mb-4 mb-3 text-[#25324B]">Categories</h1>
                        <p className="rounded-lg border lg:px-3 lg:py-2 px-2.5 py-1.5 border-[#14B8A6]/30 bg-[#14B8A6]/10 lg:text-sm text-xs text-[#14B8A6] font-medium w-fit">{job != null ? job?.category : <Skeleton width={150} />}</p>
                    </div>
                    <div className="lg:mt-8 mt-6">
                        <h1 className="lg:text-2xl text-lg font-semibold lg:mb-4 mb-3 text-[#25324B]">Skills Required</h1>
                        <div className="flex flex-wrap gap-2">{job != null ? job?.skills?.map((word, index) => (
                            <span className="rounded-lg border lg:px-3 lg:py-2 px-2.5 py-1.5 border-[#14B8A6]/30 bg-[#14B8A6]/10 lg:text-sm text-xs text-[#14B8A6] font-medium break-words w-fit" key={index}>{word.trim()}</span>
                        )) : <Skeleton width={150} />}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
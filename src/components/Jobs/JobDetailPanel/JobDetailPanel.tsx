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
import {
    FileText, Building2, BookOpen, GraduationCap, Calendar,
    TrendingUp, Award, DollarSign, Monitor, Clock, MapPin,
    Users, Briefcase, Wallet, AlertCircle, Image as ImageIcon
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
    // Helper Components
    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#14B8A6]/10 p-2 rounded-lg">
                <Icon size={24} className="text-[#14B8A6]" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
    );

    const SidebarField = ({ icon: Icon, label, value, loading }: {
        icon: any, label: string, value: React.ReactNode, loading: boolean
    }) => (
        <div className="flex items-center gap-3 py-2">
            <div className="bg-[#14B8A6]/10 p-2 rounded-lg flex-shrink-0">
                <Icon size={18} className="text-[#14B8A6]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 mb-0.5">{label}</p>
                {loading ? <Skeleton width={100} height={16} /> : (
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                )}
            </div>
        </div>
    );

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
                <div className="flex gap-4 items-start">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 border border-gray-200">
                            {job?.Recruiters?.CompanyInfo?.logo ? (
                                <Image
                                    src={job.Recruiters.CompanyInfo.logo}
                                    alt={job.Recruiters.CompanyInfo.name}
                                    width={60}
                                    height={60}
                                    className="object-contain"
                                />
                            ) : (
                                <ImageIcon className="w-full h-full text-gray-400" />
                            )}
                        </div>
                    </div>

                    {/* Title and Metadata */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            {job ? job.title : <Skeleton width={300} height={32} />}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                                <Building2 size={16} />
                                <span>{job?.Recruiters?.CompanyInfo?.name || <Skeleton width={100} />}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span>{job ? job.location : <Skeleton width={100} />}</span>
                            </div>
                        </div>

                        {/* Metadata Badges */}
                        {job && (
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-xs font-medium text-[#14B8A6]">
                                    <Monitor size={12} />
                                    {job.training_mode}
                                </span>
                                {job.provides_certificate === "Yes" && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-xs font-medium text-[#14B8A6]">
                                        <Award size={12} />
                                        Certificate
                                    </span>
                                )}
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-xs font-medium text-[#14B8A6]">
                                    <Briefcase size={12} />
                                    {job.type}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-start gap-3 flex-shrink-0">
                        <SaveButton user={user?.id} id={jobId} />
                        <button
                            onClick={handleApplyJob}
                            className={`text-white py-3 px-6 text-center bg-[#14B8A6] rounded-lg font-medium transition-all duration-200 hover:bg-[#0D9488] focus:ring-2 focus:ring-[#14B8A6] focus:ring-offset-2 ${
                                isAtCapacity ? 'opacity-50 cursor-not-allowed hover:bg-[#14B8A6]' : ''
                            }`}
                            disabled={isAtCapacity}
                        >
                            {isAtCapacity ? 'Full' : 'Enroll Now'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content + Sidebar */}
            <div className="flex flex-col lg:flex-row gap-5">
                {/* Main content (70%) */}
                <div className="lg:w-[70%] border rounded-xl p-6 lg:p-8">
                    {/* Description */}
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <SectionHeader icon={FileText} title="Description" />
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                            {job ? job.description : <Skeleton count={3} />}
                        </p>
                    </div>

                    {/* Who We Are */}
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <SectionHeader icon={Building2} title="Who We Are" />
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                            {job ? job.who_we_are : <Skeleton count={3} />}
                        </p>
                    </div>

                    {/* Teaching Method */}
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <SectionHeader icon={BookOpen} title="Teaching Method" />
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                            {job ? job.teaching_method : <Skeleton count={3} />}
                        </p>
                    </div>

                    {/* What You Will Learn */}
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <SectionHeader icon={GraduationCap} title="What You Will Learn" />
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                            {job ? job.learning_outcomes : <Skeleton count={3} />}
                        </p>
                    </div>

                    {/* Scheduling and Delivery */}
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <SectionHeader icon={Calendar} title="Scheduling and Delivery" />
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                            {job ? job.scheduling : <Skeleton count={3} />}
                        </p>
                    </div>

                    {/* Career Outcomes */}
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <SectionHeader icon={TrendingUp} title="Career Outcomes" />
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                            {job ? job.outcomes : <Skeleton count={3} />}
                        </p>
                    </div>

                    {/* Trainer Credentials */}
                    <div>
                        <SectionHeader icon={Award} title="Trainer Credentials" />
                        <p className="text-sm leading-7 text-gray-600 whitespace-pre-line">
                            {job ? job.trainer_credentials : <Skeleton count={3} />}
                        </p>
                    </div>
                </div>

                {/* Sidebar (30%) */}
                <div className="lg:w-[30%] border rounded-xl p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-6 text-gray-900">About this Role</h2>

                    {/* Signup Fee - Featured */}
                    <div className="bg-gradient-to-br from-[#14B8A6]/5 to-[#14B8A6]/10 border-2 border-[#14B8A6]/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign size={20} className="text-[#14B8A6]" />
                            <p className="text-sm text-gray-600">Signup Fee</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            {job ? (
                                job.signup_fee ? `₦${Number(job.signup_fee).toLocaleString('en-NG')}` : "Free"
                            ) : <Skeleton width={100} />}
                        </p>
                    </div>

                    {/* Key Details */}
                    <div className="space-y-1 mb-6">
                        <SidebarField
                            icon={Monitor}
                            label="Training Mode"
                            value={job?.training_mode}
                            loading={!job}
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
                        />
                        <SidebarField
                            icon={Award}
                            label="Certificate"
                            value={job?.provides_certificate === "Yes" ? "Available" : "Not Available"}
                            loading={!job}
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

                    {/* Category */}
                    <div className="border-t border-gray-100 pt-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Category</h2>
                        <p className="rounded-lg border px-3 py-2 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-sm text-[#14B8A6] w-fit font-medium">
                            {job ? job.category : <Skeleton width={150} />}
                        </p>
                    </div>

                    {/* Skills */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900">Skills Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {job ? job.skills?.map((word, index) => (
                                <span className="rounded-lg border px-3 py-2 border-[#14B8A6]/30 bg-[#14B8A6]/10 text-sm text-[#14B8A6] w-fit font-medium" key={index}>
                                    {word.trim()}
                                </span>
                            )) : <Skeleton width={150} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

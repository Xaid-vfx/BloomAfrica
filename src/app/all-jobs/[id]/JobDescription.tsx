'use client'
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Logo from '../../../assets/images/Jobs/Company Logo.png'
import getAJob from "@/lib/getAJob/getAJob";
import Button from "@/components/Button/Button";
import getUser from "@/lib/getUser/getUser";
import SaveButton from "@/components/Button/SaveButton";
import SeekerNavbar from "../seekerNavbar";
import TestComp from "./TestComp";
import { Suspense, useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from "sonner"
import { AgreementModal } from "@/components/Modal/AgreementModal";
import getIP from "@/lib/getIP/getIP";
import UAParser from "ua-parser-js";

async function getJob(userid: string) {
    const supabase = createClientComponentClient()
    const { data: jobData, error: jobError } = await supabase
        .from('Jobs')
        .select(`
            *,
            job_applications_count(applicant_count),
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
    }

    return jobData;
}

export default function JobDescription(props) {
    const supabase = createClientComponentClient()
    const search = useSearchParams()
    const id = search.get('id')
    const [job, setjob] = useState()
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

    async function postJob() {
        // First check if the job is still available
        const { data: currentCount } = await supabase
            .from('job_applications_count')
            .select('applicant_count')
            .eq('job_id', id)
            .single();

        if (currentCount?.applicant_count >= job?.limit) {
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

        const { data, error } = await supabase
            .from('Applicants')
            .insert({ job_id: id, name: seekerData.name })

        if (error) {
            console.log(error);
            setIsLoading(false);
        }
        else {
            toast.success("Applied for the job!");
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
                postJob()
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
            toast("Please register as a seeker to apply for a job")
            return
        }
        if (await checkifSeekerisAlreadyApplied()) {
            toast.error("Already Applied!")
            return
        }
        setShowAgreements(true)
    }

    useEffect(() => {
        async function fetchJob() {
            const data = await getJob(id);
            setjob(data);

            const currentCount = data?.job_applications_count?.[0]?.applicant_count || 0;
            setApplicantCount(currentCount);

            // Check if job is at capacity
            setIsAtCapacity(currentCount >= (data?.limit || 0));
        }
        fetchJob();
    }, [id]);

    return (
        <div>
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center flex-col justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <div className="animate-spin rounded-2xl h-12 w-12 border-t-2 border-b-2 border-[#4A2C84] mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">Redirecting...</p>
                    </div>
                </div>
            )}
            <AgreementModal handleAgreement={handleAgreement} type={0} showAgreements={showAgreements} setShowAgreements={setShowAgreements} />
            <div className=" items-center flex-col justify-between rounded-xl border-2 px-6 py-4 my-6 mt-20 mx-20 hidden lg:flex">
                <div className="flex flex-col">
                    <div className="flex items-center gap-6">
                        <Image src={job != null ? job?.companylogo != null ? job.companylogo : Logo : Logo} alt="logo" width={70} height={100} />
                        <div className="flex flex-col  justify-center ">
                            <h1 className="text-xl font-semibold">{job != null ? job?.title : <Skeleton width={200} height={30} className="mb-2" />}</h1>
                            <div className="flex flex-col text-center text-sm text-[#515B6F] gap-2 mb-3 items-baseline">
                                <p className='flex mx-auto justify-center'>{job?.Recruiters.CompanyInfo.name}</p>
                                <p className='flex mx-auto justify-center'> {job != null ? job?.location : <Skeleton width={100} />}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="flex gap-6">
                        <SaveButton user={props.user?.id} id={id}></SaveButton>
                        <button
                            onClick={handleApplyJob}
                            className={`text-white py-3 text-center bg-[#4A2C84] rounded-2xl font-medium px-14 ${isAtCapacity ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={isAtCapacity}
                        >
                            {isAtCapacity ? 'No Longer Accepting' : 'Apply'}
                        </button>
                    </div>
                </div>
            </div>
            <div className="py-10 px-5 lg:hidden flex flex-col text-center justify-center items-center bg-[#F8F8FD]">
                <Image src={job != null ? job?.companylogo != null ? job.companylogo : Logo : Logo} alt="logo" width={100} height={50} />
                <h1 className="text-xl font-semibold mt-2">{job != null ? job?.title : <Skeleton width={200} />}</h1>
                <div className="flex flex-col  text-center text-sm text-[#515B6F] gap-1 mb-2 items-baseline">
                    <p className='flex mx-auto justify-center'>{job?.Recruiters.CompanyInfo.name}</p>
                    <p className='flex mx-auto justify-center'> {job != null ? job?.location : <Skeleton width={100} />}</p>
                </div>
                <div className="flex gap-2 mt-6">
                    <SaveButton user={props.user?.id} id={id}></SaveButton>
                    <button onClick={() => { handleApplyJob() }} className=" text-white py-3 text-center bg-[#4A2C84]  rounded-2xl font-medium px-14" >Apply</button>
                </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-row lg:flex gap-5 px-6 lg:px-20 pb-20 ">
                <div className="lg:w-[70%] border-2 rounded-xl p-5">
                    <div className="mt-5">
                        <h1 className="text-2xl font-semibold">Description</h1>
                        <p className="mb-7 mt-2 text-[#7C8493] text-sm">{job != null ? job?.description : <Skeleton count={4} />}</p>
                    </div>
                    <div className="">
                        <h1 className="text-2xl font-semibold">Responsibilities</h1>
                        <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null ? job?.responsibilities?.replace("\n", "<br/>") : <Skeleton count={4} />}</p>
                    </div>
                    <div className="">
                        <h1 className="text-2xl font-semibold">Who We Are</h1>
                        <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null ? job?.who_we_are : <Skeleton count={4} />}</p>
                    </div>
                    {/* <div className="">
                        <h1 className="text-2xl font-semibold">Nice-To-Haves</h1>
                        <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null ? job?.extras : <Skeleton count={4} />}</p>
                    </div> */}
                </div>
                <div className="lg:w-[30%] mt-10 lg:mt-0 border-2 rounded-xl p-5">
                    <div className=''>
                        <h1 className="text-2xl font-semibold mb-6 text-[#25324B] mt-5">About this Role</h1>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F]">Signup Fee</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.signup_fee ? "₦" + job?.signup_fee : "Free" : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F]">Training Mode</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.training_mode : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F]">Start Date</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? new Date(job?.start_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F]">Certificate</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ?
                                job?.provides_certificate === "Yes" ?
                                    "Certificate Available" :
                                    "Unavailable"
                                : <Skeleton width={150} />}
                            </p>
                        </div>

                        <div className="flex flex-col justify-between mt-4">
                            <p className="text-sm text-[#515B6F]">Compensation</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? "₦" + job?.minsalary + " - " + "₦" + job?.maxsalary : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Job Type</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.type : <Skeleton width={100} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Duration</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.duration : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Location</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? `${job?.city}, ${job?.state}, ${job?.country}` : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Maximum Applicants</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.limit : <Skeleton width={150} />}</p>
                        </div>

                        <div className="flex flex-col justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Application Deadline</p>
                            <p className="bg-gray-200 rounded-lg whitespace-nowrap w-max px-2 py-1 text-sm font-semibold">{job != null ? job?.deadline : <Skeleton width={150} />}</p>
                        </div>
                    </div>
                    <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                    <div>
                        <h1 className="text-2xl font-semibold mb-4 text-[#25324B]">Categories</h1>
                        <p className="rounded-xl flex flex-wrap border px-3 py-2 border-[#4A2C84] text-sm text-[#4A2C84] w-fit">{job != null ? job?.category : <Skeleton width={150} />}</p>
                    </div>
                    <div className="mt-8">
                        <h1 className="text-2xl font-semibold mb-4 text-[#25324B]">Skills Required</h1>
                        <p className="flex flex-wrap gap-2">{job != null ? job?.skills?.map((word, index) => (
                            <span className="rounded-xl border px-3 py-2 border-[#4A2C84] text-sm text-[#4A2C84] w-fit" key={index}>{word.trim()}</span>
                        )) : <Skeleton width={150} />}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
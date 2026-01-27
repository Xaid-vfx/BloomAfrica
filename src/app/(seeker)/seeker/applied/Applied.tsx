'use client'
import AppliedTable from "@/components/seeker/tables/AppliedTable";
import PaymentComponent from "@/components/Payment/Payment";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FileCheck, Search, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface Job {
    id: number;
    uid: string;
    title: string;
    location: string;
    type: string;
    created_at: string;
    signup_fee: number;
    limit: number;
    confirmed_count: number;
    paymentStatus?: string;
}

interface MobilePaymentStatusProps {
    job: Job;
    seekerId: string;
    paymentStatuses: { [key: string]: string };
    setPaymentStatuses: (value: { [key: string]: string }) => void;
    setJobCapacityStatus: (value: { [key: string]: boolean }) => void;
    checkJobCapacity: (jobId: string) => Promise<boolean>;
}

const MobilePaymentStatus: React.FC<MobilePaymentStatusProps> = ({
    job,
    seekerId,
    paymentStatuses,
    setPaymentStatuses,
    setJobCapacityStatus,
    checkJobCapacity
}) => {
    const [status, setStatus] = useState<React.ReactNode | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            setIsLoading(true);

            // First check if this application is already paid for
            const isPaid = paymentStatuses[job.id] === 'success';

            // If paid, we don't care about capacity - the spot is secured
            if (isPaid) {
                setStatus(
                    <div className="flex items-center justify-center gap-2 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl font-medium">
                        <CheckCircle size={18} />
                        Payment Successful
                    </div>
                );
                setIsLoading(false);
                return;
            }

            // Only check capacity if not paid
            const isAtCapacity = await checkJobCapacity(job.uid);

            if (isAtCapacity) {
                setStatus(
                    <div className="flex items-center justify-center gap-2 bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl font-medium">
                        <AlertCircle size={18} />
                        No Spots Available
                    </div>
                );
            } else if (job.signup_fee > 0) {
                setStatus(
                    <div className='flex flex-col gap-2'>
                        <PaymentComponent
                            jobId={job.uid}
                            seekerId={seekerId}
                            amount={job.signup_fee}
                            initialPaymentStatus={paymentStatuses[job.id]}
                            onPaymentSuccess={async () => {
                                setPaymentStatuses((prev: { [key: string]: string }) => {
                                    const newState: { [key: string]: string } = {
                                        ...prev,
                                        [job.id]: 'success'
                                    };
                                    return newState;
                                });
                                const newCapacityStatus = await checkJobCapacity(job.uid);
                                setJobCapacityStatus((prev: { [key: string]: boolean }) => {
                                    const newState: { [key: string]: boolean } = {
                                        ...prev,
                                        [job.id]: newCapacityStatus
                                    };
                                    return newState;
                                });
                            }}
                        />
                        <p className='text-xs text-center font-medium text-red-600 bg-red-50 px-3 py-2 rounded-lg'>
                            Complete payment to confirm your apprenticeship
                        </p>
                    </div>
                );
            }
            setIsLoading(false);
        };

        checkStatus();
    }, [job.id, job.uid, paymentStatuses, checkJobCapacity, seekerId, job.signup_fee]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center gap-2 text-gray-600 px-4 py-3">
                <Clock size={18} className="animate-pulse" />
                Checking availability...
            </div>
        );
    }

    return status;
};

export default function Applied(props: { appliedjobs: Job[], seekerId: string }) {
    const [paymentStatuses, setPaymentStatuses] = useState<{ [key: string]: string }>({});
    const [jobCapacityStatus, setJobCapacityStatus] = useState<{ [key: string]: boolean }>({});
    const supabase = createClientComponentClient();

    const checkJobCapacity = async (jobId: string) => {
        const { data, error } = await supabase
            .from('job_applications_count')
            .select('confirmed_count')
            .eq('job_id', jobId)
            .single();

        if (error) {
            console.error('Error checking job capacity:', error);
            return false;
        }

        const job = props.appliedjobs.find(j => j.uid === jobId);
        return (data?.confirmed_count || 0) >= (job?.limit || 0);
    };

    useEffect(() => {
        // Initialize payment statuses from the server-side data
        const statuses = props.appliedjobs.reduce((acc, job) => ({
            ...acc,
            [job.id]: job.paymentStatus
        }), {});
        setPaymentStatuses(statuses);

        // Initialize capacity status for each job
        const initializeCapacityStatus = async () => {
            const capacityStatus: { [key: number]: boolean } = {};
            for (const job of props.appliedjobs) {
                capacityStatus[job.id] = await checkJobCapacity(job.uid);
            }
            setJobCapacityStatus(capacityStatus);
        };

        initializeCapacityStatus();
    }, [props.appliedjobs]);

    return (
        <div className="relative min-h-screen">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.04] pointer-events-none -z-10" style={{ transform: 'translate(30%, -20%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-0 left-0 w-[350px] h-[350px] opacity-[0.05] pointer-events-none -z-10" style={{ transform: 'translate(-25%, 25%)' }}>
                <path fill="#0A1F44" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <FileCheck className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0A1F44]">All Applications</h1>
                </div>
                <p className="text-gray-600 ml-16">
                    {props.appliedjobs.length > 0
                        ? `You have applied to ${props.appliedjobs.length} ${props.appliedjobs.length === 1 ? 'apprenticeship' : 'apprenticeships'}`
                        : "Start applying to apprenticeships to begin your journey"}
                </p>
            </div>

            {/* Content */}
            {props.appliedjobs.length > 0 ? (
                <>
                    {/* Desktop View */}
                    <div className="hidden lg:block">
                        <AppliedTable
                            jobs={props.appliedjobs}
                            seekerId={props.seekerId}
                        />
                    </div>

                    {/* Mobile View */}
                    <div className="lg:hidden">
                        <div className="flex flex-col gap-4">
                            {props.appliedjobs.map((job) => (
                                <div key={job.uid} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-lg text-[#0A1F44] pr-2">{job.title}</h3>
                                            <a
                                                href={`/all-trainings/job?id=${job.uid}`}
                                                className="text-[#14B8A6] hover:text-[#0D9488] text-sm font-medium whitespace-nowrap"
                                            >
                                                View Job →
                                            </a>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 mb-1">Location</p>
                                                <p className="font-medium text-gray-900">{job.location}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 mb-1">Type</p>
                                                <p className="font-medium text-gray-900">{job.type}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-500 mb-1">Applied On</p>
                                                <p className="font-medium text-gray-900">
                                                    {job.created_at.substring(0, job.created_at.indexOf('T'))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50">
                                        <MobilePaymentStatus
                                            job={job}
                                            seekerId={props.seekerId}
                                            paymentStatuses={paymentStatuses}
                                            setPaymentStatuses={setPaymentStatuses}
                                            setJobCapacityStatus={setJobCapacityStatus}
                                            checkJobCapacity={checkJobCapacity}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                // Empty State
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 md:p-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="bg-[#14B8A6]/10 rounded-full p-8">
                                    <FileCheck className="text-[#14B8A6]" size={64} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                                    <CheckCircle className="text-gray-400" size={24} />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-[#0A1F44] mb-3">
                            No Applications Yet
                        </h2>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Start your apprenticeship journey by exploring available programs
                            and applying to the ones that match your interests and goals.
                        </p>

                        <a
                            href="/all-trainings"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#14B8A6] text-white rounded-xl font-medium hover:bg-[#0D9488] transition-colors shadow-lg shadow-[#14B8A6]/30"
                        >
                            <Search size={20} />
                            Explore Apprenticeships
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

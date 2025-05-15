'use client'
import AppliedTable from "@/components/General/AppliedTable";
import PaymentComponent from "@/components/Payment/Payment";
import { useState, useEffect } from "react";
import { SlOptions } from "react-icons/sl";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
                    <div className="text-center bg-green-100 text-green-800 px-4 py-2 rounded-2xl">
                        Payment successful
                    </div>
                );
                setIsLoading(false);
                return;
            }

            // Only check capacity if not paid
            const isAtCapacity = await checkJobCapacity(job.uid);
            
            if (isAtCapacity) {
                setStatus(
                    <div className="text-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-2xl">
                        No spots available
                    </div>
                );
            } else if (job.signup_fee > 0) {
                setStatus(
                    <div className='flex flex-col'>
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
                        <p className='text-[13px] text-center font-[500] text-red-600'>
                            Complete the payment to confirm your apprenticeship
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
            <div className="text-center px-4 py-2">
                Checking availability...
            </div>
        );
    }

    return status;
};

export default function Applied(props: { appliedjobs: Job[], seekerId: string }) {
    const [paymentStatuses, setPaymentStatuses] = useState<{ [key: string]: string }>({});
    const [jobCapacityStatus, setJobCapacityStatus] = useState<{ [key: string]: boolean }>({});
    const [showOptionMap, setShowOptionMap] = useState<{ [key: string]: boolean }>({});
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

    const toggleShowOption = (jobId: number) => {
        setShowOptionMap(prev => ({
            ...prev,
            [jobId]: !prev[jobId]
        }));
    };

    return (
        <div className="flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white lg:pt-7 lg:px-8 pt-5 overflow-scroll">
            <div className="hidden lg:block bg-white rounded-xl">
                <h1 className="font-bold text-[#4A2C84] text-2xl mb-6">All Applications</h1>
                <AppliedTable
                    jobs={props.appliedjobs}
                    seekerId={props.seekerId}
                />
            </div>
            <div className="lg:hidden px-4">
                <p className="font-bold text-2xl text-[#4A2C84]">Jobs applied</p>
                {props.appliedjobs.length > 0 ? (
                    <div className="">
                        {props.appliedjobs.map((job) => (
                            <div key={job.uid} className="border p-4 my-4 relative rounded-xl">
                                {showOptionMap[job.id] && (
                                    <a href={`/all-trainings/job?id=${job?.uid}`} className="bg-[#e0e0e0] p-4 absolute text-sm rounded-xl font-semibold right-1 top-10">
                                        View Job
                                    </a>
                                )}
                                <div className="flex justify-between">
                                    <p className="font-semibold mb-3 text-lg">{job?.title}</p>
                                    <SlOptions
                                        onClick={() => toggleShowOption(job.id)}
                                        className="text-xl"
                                    />
                                </div>
                                <div className="flex gap-6">
                                    <div>
                                        <p className="text-[#7C8493] mb-1 text-sm min-w-max">{job?.location}</p>
                                        <p className="min-w-max text-sm ">{job?.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-[#7C8493] text-sm mb-1">Date applied</p>
                                        <p className='text-sm'>{job?.created_at.substring(0, job.created_at.indexOf('T'))}</p>
                                    </div>
                                </div>
                                <MobilePaymentStatus
                                    job={job}
                                    seekerId={props.seekerId}
                                    paymentStatuses={paymentStatuses}
                                    setPaymentStatuses={setPaymentStatuses}
                                    setJobCapacityStatus={setJobCapacityStatus}
                                    checkJobCapacity={checkJobCapacity}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-96">
                        <h1 className="text-xl font-medium">No applications yet.</h1>
                    </div>
                )}
            </div>
        </div>
    );
}
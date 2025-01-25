'use client'
import AppliedTable from "@/components/General/AppliedTable";
import PaymentComponent from "@/components/Payment/Payment";
import { useState, useEffect } from "react";
import { SlOptions } from "react-icons/sl";

export default function Applied(props: { appliedjobs: any[], seekerId: string }) {
    const [paymentStatuses, setPaymentStatuses] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Initialize payment statuses from the server-side data
        const statuses = props.appliedjobs.reduce((acc, job) => ({
            ...acc,
            [job.id]: job.paymentStatus
        }), {});
        setPaymentStatuses(statuses);
    }, [props.appliedjobs]);

    function startPayment(row) {
        console.log(row);
    }
    return (
        <div className="flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white lg:pt-7 lg:px-8 pt-5 overflow-scroll">
            <div className="hidden lg:block bg-white rounded-xl">
                <h1 className="font-bold text-[#4A2C84] text-2xl mb-6">All Applications</h1>
                <AppliedTable
                    startPayment={startPayment}
                    jobs={props.appliedjobs}
                    seekerId={props.seekerId}
                />
            </div>
            <div className="lg:hidden px-4 ">
                <p className="font-bold text-2xl text-[#4A2C84]">Jobs applied</p>
                {props.appliedjobs.length > 0 ? (
                    <div className="">
                        {props.appliedjobs.map((job) => {
                            const [showOption, setshowOption] = useState(false)
                            return (
                                <div key={job.uid} className="border p-4 my-4 relative rounded-xl">
                                    {
                                        showOption && <a href={`/all-jobs/job?id=${job?.uid}`} className="bg-[#e0e0e0] p-4 absolute text-sm rounded-xl font-semibold right-1 top-10">
                                            View Job
                                        </a>
                                    }
                                    <div className="flex justify-between">
                                        <p className="font-semibold mb-3 text-lg">{job?.title}</p>
                                        <SlOptions onClick={() => {
                                            if (showOption) setshowOption(false)
                                            else setshowOption(true)
                                        }} className="text-xl" />
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
                                    {job.signup_fee > 0 && !paymentStatuses[job.id] && (
                                        <div className='flex flex-col'>
                                            <PaymentComponent
                                                jobId={job.uid}
                                                seekerId={props.seekerId}
                                                amount={job.signup_fee}
                                                onPaymentSuccess={() => {
                                                    setPaymentStatuses(prev => ({
                                                        ...prev,
                                                        [job.id]: 'success'
                                                    }));
                                                }}
                                            />
                                            <p className='text-[13px] text-center font-[500] text-red-600'>Complete the payment to confirm your apprenticeship</p>
                                        </div>
                                    )}
                                    {paymentStatuses[job.id] && (
                                        <div className={`text-center px-4 py-2 rounded-2xl ${paymentStatuses[job.id] === 'success'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            Payment {paymentStatuses[job.id]}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-96">
                        <h1 className="text-xl font-medium">No applications yet.</h1>
                    </div>
                )}
            </div>
        </div>
    )
}
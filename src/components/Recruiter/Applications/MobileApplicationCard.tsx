import { DialogDemo } from '@/components/Modal/Modal';
import React, { useState, useEffect } from 'react';
import { LuEye } from "react-icons/lu";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface MobileApplicationCardProps {
    type: string;
    applications: any[];
    updateStatus: (status: string, id: string) => void;
    fetchApplicantDetails: (id: string) => void;
    id: string;
}

const MobileApplicationCard: React.FC<MobileApplicationCardProps> = (props) => {
    const [paymentStatuses, setPaymentStatuses] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPaymentStatuses = async () => {
            setIsLoading(true);
            const supabase = createClientComponentClient();
            const { data, error } = await supabase
                .from('jobpayments')
                .select('job_id, status')
                .eq('seeker_id', props.id);

            if (data) {
                const statuses = data.reduce((acc, curr) => ({
                    ...acc,
                    [curr.job_id]: curr.status
                }), {});
                setPaymentStatuses(statuses);
            }
            setIsLoading(false);
        };

        fetchPaymentStatuses();
    }, [props.id]);

    return (
        <div className="lg:hidden my-4 flex flex-col gap-4">
            <p className="lg:hidden text-lg font-semibold">{props.type} Applicants</p>
            {props.applications && props.applications.map((app: any) => {
                const paymentStatus = paymentStatuses[app.job_id];

                return (
                    <div className="border rounded-md px-5 py-4 bg-white" key={app.seeker_id}>
                        <div className="">
                            <div className='flex justify-between items-start'>
                                <div>
                                    <p className="font-semibold">{app?.name}</p>
                                </div>
                                <div className='flex flex-col items-end gap-2'>
                                    <button
                                        onClick={() => { props.fetchApplicantDetails(app.seeker_id); }}
                                        className="text-xs flex gap-1 items-center text-[#4A2C84] border border-[#4A2C84] px-2 rounded-full py-1"
                                    >
                                        <LuEye className='text-sm' />View
                                    </button>
                                    {isLoading ? (
                                        <div className="animate-pulse h-4 w-14 bg-gray-200 rounded-full"></div>
                                    ) : (
                                        <div className={`text-xs font-medium px-4 py-1 rounded-full ${paymentStatus === 'success'
                                            ? 'bg-green-50 border border-green-300 text-green-600'
                                            : 'bg-red-50 text-red-600'
                                            }`}>
                                            {paymentStatus === 'success' ? 'Paid' : 'Unpaid'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                        <div className="text-[#7C8493] text-sm">Date Applied</div>
                        <div>{app.created_at.substring(0, app.created_at.indexOf('T'))}</div>
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                        <div className="flex gap-2 justify-between items-center">
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => { props.updateStatus("accepted", app.unique_id); }}
                                    className="text-xs text-white px-4 rounded-full py-2 bg-[#4A2C84]"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => { props.updateStatus("rejected", app.unique_id); }}
                                    className="text-xs text-[#4A2C84] border border-[#4A2C84] px-4 rounded-full py-2"
                                >
                                    Reject
                                </button>
                            </div>
                            <DialogDemo seeker_id={app.seeker_id} name={app.name} user_id={props.id} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MobileApplicationCard;
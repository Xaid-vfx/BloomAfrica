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
        <div className="lg:hidden flex flex-col gap-2">
            {props.applications && props.applications.map((app: any) => {
                const paymentStatus = app.payment_status;

                return (
                    <div className="border rounded-xl px-4 py-3 bg-white" key={app.seeker_id}>
                        <div className='flex justify-between items-center'>
                            <div className="flex items-center gap-3">
                                <p className="font-medium text-gray-900">{app?.name}</p>
                                {isLoading ? (
                                    <div className="animate-pulse h-5 w-12 bg-gray-200 rounded-full"></div>
                                ) : (
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${paymentStatus === 'success'
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-red-50 text-red-600'
                                        }`}>
                                        {paymentStatus === 'success' ? 'Paid' : 'Unpaid'}
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => { props.fetchApplicantDetails(app.seeker_id); }}
                                    className="text-xs flex gap-1 items-center text-[#14B8A6] hover:bg-[#14B8A6]/10 px-2 py-1 rounded-lg transition-colors"
                                >
                                    <LuEye className='text-sm' />View
                                </button>
                                <DialogDemo seeker_id={app.seeker_id} name={app.name} user_id={props.id} />
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            Applied {app.created_at.substring(0, app.created_at.indexOf('T'))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MobileApplicationCard;
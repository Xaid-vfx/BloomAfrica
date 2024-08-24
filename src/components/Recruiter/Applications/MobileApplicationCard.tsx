import { DialogDemo } from '@/components/Modal/Modal';
import React from 'react';
import { LuEye } from "react-icons/lu";

interface MobileApplicationCardProps {
    // Define the props for your component here
}

const MobileApplicationCard: React.FC<MobileApplicationCardProps> = (props) => {


    return (
        <div className="lg:hidden my-4 flex flex-col gap-4">
            <p className="lg:hidden text-lg font-semibold">{props.type} Applicants</p>
            {props.applications && props.applications.map((app: any) => {
                return (
                    <div className="border rounded-md px-5 py-4 bg-white" key={app.seeker_id}>
                        <div className="">
                            <div className='flex justify-between'>
                                <p className="font-semibold ">{app?.name}</p>
                                {props.status == "" ? <button onClick={() => { props.fetchApplicantDetails(app.seeker_id); }} className="text-xs flex gap-1 items-center text-[#4A2C84] border border-[#4A2C84] px-2 rounded-full py-1 bg-[#]"><LuEye className='text-sm' />View</button> :
                                    props.status == "paid" ? <div className='text-[#56CDAD] font-semibold text-[0.6rem] px-3 py-1 rounded-3xl bg-green-100'>Paid</div> : <div className='text-[#FF2323] font-semibold text-[0.6rem] px-3 py-1 rounded-3xl bg-red-100'>Unpaid</div>}
                            </div>
                            <div className="text-sm my-1 text-[#4A2C84] flex item gap-1">Product Designer</div>
                            <div className="text-sm text-[#7C8493] flex item gap-1">Yaba, Lagos</div>
                        </div>
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                        <div className="text-[#7C8493] text-sm">Date Applied</div>
                        <div>{app.created_at.substring(0, app.created_at.indexOf('T'))}</div>
                        <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
                        <div className="flex gap-2 justify-between items-center">
                            <div className='flex gap-2'>
                                <button onClick={() => { props.updateStatus("accepted", app.unique_id); }} className="text-xs text-white px-4 rounded-full py-2 bg-[#4A2C84]">Accept</button>
                                <button onClick={() => { props.updateStatus("rejected", app.unique_id); }} className="text-xs text-[#4A2C84] border border-[#4A2C84] px-4 rounded-full py-2 bg-[#]">Reject</button>
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
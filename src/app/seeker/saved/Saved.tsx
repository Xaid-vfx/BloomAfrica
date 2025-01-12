'use client'
import SavedTable from "@/components/General/SavedTable";
import MobileCard from "@/components/Jobs/MobileCard/MobileCard";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"

export default function Saved(props) {

    const router = useRouter()
    console.log(props.savedjobs);

    async function deleteJob(id: string) {
        console.log(id);
        const job = props.savedjobs.find((obj: any) => obj.id === id);
        console.log(job.uid);
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('Saved')
            .delete()
            .eq('job_id', job.uid)


        console.log(data);
        console.log(error);
        if (error) {
            console.log(error);
        }
        else {
            toast("Removed Job!!")
            router.refresh()
        }

    } 
    return (
        <div className="flex flex-col border-gray-300 border-[1px] h-full max-h-[calc(100vh-95px)] w-full rounded-t-xl bg-white lg:pt-7 lg:px-8 pt-5 overflow-scroll ">
            <div className="hidden lg:block bg-white rounded-xl">
                {
                    props.savedjobs.length > 0 ? (
                        <>
                            <h1 className="font-semibold text-2xl px-10 pt-6 pb-3">Saved Jobs</h1>
                            <SavedTable delete={deleteJob} jobs={props.savedjobs} />
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-96">
                            <h1 className="text-xl font-medium">No saved jobs yet.</h1>
                        </div>
                    )
                }
            </div>
            <div className="lg:hidden px-4 my-6">
                <p className="text-xl font-semibold">Saved Jobs</p>
                <div className="flex flex-col gap-4 my-4">
                    {props.savedjobs.map((job) => {
                        return (
                            <div className="">
                                <MobileCard id={job.uid}
                                    logo={job.logo} title={job.title} location={job.location} type={job.type} category={job.category} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
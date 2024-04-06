'use client'
import SavedTable from "@/components/General/SavedTable";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

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
            alert("Removed Job!!")
        }
        router.refresh()

    }
    return (
        <div className="pt-8 px-8 bg-[#F5F5F5] h-[95%] w-full">
            {
                props.savedjobs.length > 0 ? <div className="bg-white rounded-xl">
                    <h1 className="font-semibold text-2xl px-10 pt-6 pb-3">Saved Jobs</h1>
                    <SavedTable delete={deleteJob} jobs={props.savedjobs} />
                </div>
                    : (
                        <div className="flex justify-center items-center h-96">
                            <h1 className="text-xl font-medium">No saved jobs</h1>
                        </div>
                    )
            }
        </div>
    )
}
import getUser from "@/lib/getUser/getUser";
import Sidebar from "../Sidebar";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "../Header";
import Saved from "./Saved";

export const metadata: Metadata = {
    title: 'Saved Apprenticeships | Prentis'
}

async function fetchSeeker(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Seekers').select().eq('unique_id', id).single()

    console.log(data);
    return data;
}

async function fetchSavedJobs(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Saved').select().eq('seeker_id', id)

    console.log(data);
    return data;
}

export default async function page() {
    const supabase = createServerComponentClient({ cookies })
    const user = await getUser();
    const company = await getCompany(user?.id)
    const seeker = await fetchSeeker(user?.id)
    const savedjobsid = await fetchSavedJobs(user?.id)
    const savedjobs = await Promise.all(savedjobsid?.map(async (job) => {
        const { data, error } = await supabase.from('Jobs').select().eq('uid', job.job_id).single();
        return data;
    }));

    return (
        <div className="flex flex-col bg-[#F5F5F5] h-screen pb-5 ">
            <div>
                <Header name={seeker.name} />
            </div>
            <div className='flex flex-row lg:gap-5 mx-5 h-full '>
                <div className="h-full lg:w-[20%]">
                    <Sidebar />
                </div>
                <div className="w-full lg:w-[80%] flex flex-col lg:max-h-[calc(100vh-116px)] max-h-[calc(100vh-88px)]">
                    <Saved savedjobs={savedjobs} />
                </div>
            </div>        
        </div>
        
    )
}
//4A2C84
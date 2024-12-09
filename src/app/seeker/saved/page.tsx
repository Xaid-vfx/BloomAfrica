import getUser from "@/lib/getUser/getUser";
import Sidebar from "../Sidebar";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "../Header";
import Saved from "./Saved";

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
        <div className="  bg-[#F8F8FD]">
            <div className="flex w-full justify-center ms-auto me-auto max-w-[1500px]">
                <Sidebar />
                <div className="w-full flex flex-col h-screen">
                    <Header name={seeker.name} />
                    <Saved savedjobs={savedjobs} />
                </div>
            </div>
        </div>
    )
}
//4A2C84
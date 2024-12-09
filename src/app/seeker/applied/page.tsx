import getUser from "@/lib/getUser/getUser";
import Sidebar from "../Sidebar";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "../Header";
import AppliedTable from "@/components/General/AppliedTable";
import Applied from "./Applied";

async function fetchSeeker(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Seekers').select().eq('unique_id', id).single()

    console.log(data);
    return data;
}

async function fetchAppliedJobs(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Applicants').select().eq('seeker_id', id)

    console.log(data);
    return data;
}

export default async function page() {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const user = await getUser();
    const company = await getCompany(user?.id)
    const seeker = await fetchSeeker(user?.id)
    const appliedjobsid = await fetchAppliedJobs(user?.id)
    const appliedjobs = await Promise.all(appliedjobsid?.map(async (job) => {
        const { data, error } = await supabase.from('Jobs').select().eq('uid', job.job_id).single();
        return data;
    }));


    console.log(appliedjobs);

    return (
        <div className="  bg-[#F8F8FD]">
            <div className="flex w-full justify-center ms-auto me-auto max-w-[1500px]">
                <Sidebar />
                <div className="w-full flex flex-col h-screen">
                    <Header name={seeker.name} />
                    <Applied appliedjobs={appliedjobs} />
                </div>
            </div>
        </div>
    )
}

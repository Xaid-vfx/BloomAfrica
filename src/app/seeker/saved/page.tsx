import getUser from "@/lib/getUser/getUser";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Saved from "./Saved";
import SeekerNavbar from "../../all-trainings/seekerNavbar";
import { Metadata } from "next";

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
        <div className="min-h-screen bg-white">
            <SeekerNavbar user={user || null} />
            <main className="px-6 py-10 max-w-7xl mx-auto">
                <Saved savedjobs={savedjobs} />
            </main>
        </div>
    )
}
//4A2C84
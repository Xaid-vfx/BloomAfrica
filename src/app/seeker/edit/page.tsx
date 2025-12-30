import getUser from "@/lib/getUser/getUser";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import EditSeeker from "./Edit";
import SeekerNavbar from "../../all-trainings/seekerNavbar";

async function fetchSeeker(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Seekers').select().eq('unique_id', id).single()

    console.log(data);
    return data;
}

async function getEducation(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Education').select().eq('unique_id', id).single()

    console.log(data);
    return data;
}

async function getExperience(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Experience').select().eq('unique_id', id).single()

    console.log(data);
    return data;
}

export default async function page() {
    const user = await getUser();
    const education = await getEducation(user?.id)
    const experience = await getExperience(user?.id)
    const seeker = await fetchSeeker(user?.id)

    return (
        <div className="min-h-screen bg-white">
            <SeekerNavbar user={user || null} />
            <main className="px-6 py-10 max-w-7xl mx-auto">
                <EditSeeker user={user} seeker={seeker} education={education} experience={experience} />
            </main>
        </div>
    )
}
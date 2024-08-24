import getCompany from "@/lib/getCompany/getCompany";
import getUser from "@/lib/getUser/getUser";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SeekerContent from "./SeekerContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Apprentice Dashboard | Bloom'
}

async function fetchSeeker(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Seekers').select().eq('unique_id', id).single()

    console.log(data);

    return data;
}

export default async function Recruiter() {
    const user = await getUser();
    const company = await getCompany(user?.id)
    const seeker = await fetchSeeker(user?.id)

    return (
        <div>
            <SeekerContent user={user} seeker={await seeker} company={await company} />
        </div>
    )
}
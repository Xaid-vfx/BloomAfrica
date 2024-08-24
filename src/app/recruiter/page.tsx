import RecruiterContent from "@/components/Recruiter/RecruiterContent/RecruiterContent";
import getCompany from "@/lib/getCompany/getCompany";
import getUser from "@/lib/getUser/getUser";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Metadata } from "next";
import { cookies } from "next/headers";

async function fetchRecruiter(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Recruiters').select().eq('uniqueid', id).single()

    console.log(error);

    return data;
}

export const metadata: Metadata = {
    title: 'Recruiter Dashboard | Bloom'
}


export default async function Recruiter() {
    const user = await getUser();
    const company = await getCompany(user?.id)
    const recruiter = await fetchRecruiter(user?.id)

    return (
        <div>
            <RecruiterContent user={user} recruiter={await recruiter} company={await company} />
        </div>
    )
}
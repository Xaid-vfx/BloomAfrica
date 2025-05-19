import RecruiterContent from "@/components/Recruiter/RecruiterContent/RecruiterContent";
import getCompany from "@/lib/getCompany/getCompany";
import getUser from "@/lib/getUser/getUser";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
    
    // Redirect to signup if no user is logged in
    if (!user?.id) {
        redirect('/signup');
    }

    const company = await getCompany(user.id);
    const recruiter = await fetchRecruiter(user.id);

    // Redirect to signup if user is not a recruiter
    if (!recruiter) {
        redirect('/signup');
    }

    return (
        <div>
            <RecruiterContent user={user} recruiter={recruiter} company={company} />
        </div>
    )
}
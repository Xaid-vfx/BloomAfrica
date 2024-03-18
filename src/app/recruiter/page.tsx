import RecruiterContent from "@/components/Recruiter/RecruiterContent/RecruiterContent";
import Sidebar from "@/components/Recruiter/Sidebar/Sidebar";
import getCompany from "@/lib/getCompany/getCompany";
import getUser from "@/lib/getUser/getUser";
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";


export default async function Recruiter() {
    const user = await getUser();
    const company = await getCompany(user?.id)

    return (
        <div>
            <RecruiterContent user={user} company={company} />
        </div>
    )
}
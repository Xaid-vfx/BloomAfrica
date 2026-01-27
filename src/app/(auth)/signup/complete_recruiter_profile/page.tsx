import LeftColumn from "@/components/SignUp/LeftColumn/LeftColumn";
import RightColomnRecruiter from "./RightColumnRecruiter";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import getUser from "@/lib/api/getUser";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Complete Recruiter Profile | Prentis'
}

async function checkIfUserExists(id: string | undefined) {
    console.log("Inside function")
    console.log(id);
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase
        .from('Recruiters')
        .select()
        .eq('uniqueid', id)
        .single()

    if (error) { console.log(error); }

    return data;
}

export default async function CompleteRecruiterProfile() {
    const user = await getUser();
    const result = await checkIfUserExists(user?.id)
    console.log(result);

    // Check if profile is actually complete (has name, not just email)
    // If only email exists (OAuth just created the record), show profile completion form
    if (result?.uniqueid && result?.name && result?.number) {
        // Profile is complete, redirect to recruiter dashboard
        redirect('/recruiter')
    }

    // Profile incomplete or doesn't exist, show form
    return (
        <div>
            <div className="flex h-screen w-full">
                <LeftColumn userType="recruiter" />
                <RightColomnRecruiter />
            </div>
        </div>
    )
}
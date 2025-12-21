import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn";
import RightColomnRecruiter from "./RightColumnRecruiter";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import getUser from "@/lib/getUser/getUser";

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

    if (result?.uniqueid) {
        redirect('/recruiter')
    }

    return (
        <div>
            <div className="flex h-screen w-full">
                <LeftColomn />
                <RightColomnRecruiter />
            </div>
        </div>
    )
}
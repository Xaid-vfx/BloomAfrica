import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn";
import RightColomnRecruiter from "./RightColumnRecruiter";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import getUser from "@/lib/getUser/getUser";

async function checkIfUserExists(id: string) {
    console.log("Inside function")
    console.log(id);
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase
        .from('Seekers')
        .select()
        .eq('unique_id', id)
        .single()

    if (error) { console.log(error); }

    return data;
}

export default async function CompleteRecruiterProfile() {
    const user = await getUser();
    const result = await checkIfUserExists(await user?.id)
    console.log(result);

    if (result?.unique_id) {
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
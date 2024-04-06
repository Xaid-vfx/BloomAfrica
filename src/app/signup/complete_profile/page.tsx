import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn";
import RightColumnSeeker from "@/components/SignUp/RightColomnSeeker/RightColomnSeeker";
import getUser from "@/lib/getUser/getUser";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export default async function CompleteProfile() {
    const user = await getUser();
    const result = await checkIfUserExists(await user?.id)
    console.log(result);



    if (result?.unique_id) {
        redirect('/all-jobs')
    }
    else {
        console.log("Complete profile")

        return (
            <div className="flex h-screen">
                <LeftColomn />
                <RightColumnSeeker />
            </div>
        )
    }
}
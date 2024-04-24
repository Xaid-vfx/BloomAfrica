import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn";
import RightColumnSeeker from "@/components/SignUp/RightColomnSeeker/RightColomnSeeker";
import getUser from "@/lib/getUser/getUser";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { log } from "console";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


cookies().getAll()
const supabase = createServerComponentClient({ cookies })

async function checkIfUserExists(id: string) {
    console.log("Inside function")
    console.log(id);
    const { data, error } = await supabase
        .from('Seekers')
        .select()
        .eq('unique_id', id)
        .single()

    if (error) { console.log(error); }

    return data;
}

export default async function CompleteProfile() {
    const session = await supabase.auth.getSession();

    const user = session.data.session?.user



    const result = await checkIfUserExists(await user?.id)



    if (await result) {
        redirect('/all-jobs')
    }
    else {
        return (
            <div className="flex h-screen">
                <LeftColomn />
                <RightColumnSeeker />
            </div>
        )
    }

}
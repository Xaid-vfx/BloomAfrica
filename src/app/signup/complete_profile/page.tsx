import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn";
import RightColumnSeeker from "@/components/SignUp/RightColomnSeeker/RightColomnSeeker";
import getUser from "@/lib/getUser/getUser";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function checkIfUserExists(id: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase
        .from('Seekers')
        .select()
        .eq('unique_id', id)

    return data;
}

export default async function CompleteProfile() {
    const user = await getUser();
    const result = await checkIfUserExists(user?.id)
    console.log(result);

    if (result) {
        redirect('/all-jobs')
    }

    return (
        <div className="flex h-screen">
            <LeftColomn />
            <RightColumnSeeker />
        </div>
    )
}
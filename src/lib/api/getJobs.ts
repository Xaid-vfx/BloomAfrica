import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers";

export default async function getJobs(userid: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = userid == '' ? await supabase
        .from('Jobs')
        .select() :
        await supabase
            .from('Jobs')
            .select()
            .eq('recruiter', userid)

    if (error) {
        console.log(error);
    }

    return data;
}
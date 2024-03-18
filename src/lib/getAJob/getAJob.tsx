import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers";

export default async function getAJob(jobid: string) {
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase
        .from('Jobs')
        .select()
        .eq('uid', jobid)

    if (error) {
        console.log(error);
    }

    return data;
}
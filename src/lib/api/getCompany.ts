import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function getCompany(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase
        .from('CompanyInfo')
        .select()
        .eq('unique_id', id)
        .single()

    return data;
}
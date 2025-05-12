import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn";
import RightColumnSeeker from "@/components/SignUp/RightColomnSeeker/RightColomnSeeker";
import getUser from "@/lib/getUser/getUser";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { log } from "console";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Complete Apprentice Profile | Bloom'
}

async function checkIfUserExists(id: string) {
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

export default async function CompleteProfile({
    params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const session = await supabase.auth.getSession();

    const user = session.data.session?.user

    const result = await checkIfUserExists(await user?.id)

    if (await result) {
        if (searchParams?.continue != "null")
            redirect('/all-trainings' + searchParams?.continue)
        else redirect('/all-trainings')
    }
    else {
        return (
            <div className="flex h-screen">
                <LeftColomn />
                <RightColumnSeeker redirectUrl={searchParams?.continue} />
            </div>
        )
    }

}
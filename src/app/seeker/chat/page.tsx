import getUser from "@/lib/getUser/getUser";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import SeekerMessages from "./SeekerMessages";
import SeekerNavbar from "../../all-trainings/seekerNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Chat | Prentis'
}

async function fetchSeeker(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Seekers').select().eq('unique_id', id).single()

    console.log(data);
    return data;
}
async function fetchRelations(id) {
    console.log(id);

    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
            conversation_id,
            conversations (
                last_message,
                last_message_timestamp,
                conversation_participants (
                    recruiter,
                    Recruiters (
                        name
                    )
                )
            )
        `)
        .eq('seeker', id);
    if (error) {
        console.error('Error fetching conversations:', error);
    } else {
        console.log('Conversations:', data);
    }
    return data
}

export default async function page() {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const user = await getUser();
    const company = await getCompany(user?.id)
    const seeker = await fetchSeeker(user?.id)
    const relations = await fetchRelations(user?.id)
    console.log('realtaion');
    console.log(relations);


    return (
        <div className="min-h-screen bg-white">
            <SeekerNavbar user={user || null} />
            <main className="px-6 py-10 max-w-7xl mx-auto">
                <SeekerMessages relations={relations} user={user} />
            </main>
        </div>
    )
}
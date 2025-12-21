import getUser from "@/lib/getUser/getUser";
import Sidebar from "../Sidebar";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "../Header";
import ChatClient from "@/components/Chat/Chat";
import SeekerMessages from "./SeekerMessages";

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


        <div className="flex flex-col bg-[#F5F5F5] h-screen pb-5  ">
            <div>
                <Header name={seeker.name} />
            </div>
            <div className='flex flex-row lg:gap-5 mx-5 h-full '>
                <div className="h-full lg:w-[20%]">
                    <Sidebar />
                </div>
                <div className="w-full lg:w-[80%] flex flex-col lg:max-h-[calc(100vh-116px)] max-h-[calc(100vh-88px)]">
                    <SeekerMessages relations={relations} user={user} />
                </div>
            </div>
                
        </div>
        
  
    )
}
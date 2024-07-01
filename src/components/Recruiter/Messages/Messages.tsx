import ChatClient from "@/components/Chat/Chat";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Messages(props) {
    const [relations, setrelations] = useState([])
    const [showChat, setshowChat] = useState(false)
    const [selectedUser, setselectedUser] = useState()
    const [selectedConvo, setselectedConvo] = useState()

    useEffect(() => {
        async function fetchRelations() {
            const supabase = createClientComponentClient()
            const { data, error } = await supabase
                .from('conversation_participants')
                .select(`
                    conversation_id,
                    conversations (
                        last_message,
                        last_message_timestamp,
                        conversation_participants (
                            seeker,
                            Seekers (
                                name
                            )
                        )
                    )
                `)
                .eq('recruiter', props.recruiter.uniqueid);


            if (error) {
                console.error('Error fetching conversations:', error);
            } else {
                console.log('Conversations:', data);
            }
            return data
        }
        fetchRelations().then(data => {
            setrelations(data)
        })
    }, [])
    return (
        <div>
            <h1>Messages</h1>
            {relations?.map((relation) => {
                return (
                    <div onClick={() => {
                        setshowChat(true)
                        setselectedUser(relation?.conversations?.conversation_participants[0])
                        setselectedConvo(relation?.conversation_id)
                        console.log(selectedUser);

                    }} className="border text-black bg-gray-300">
                        {relation?.conversations?.conversation_participants[0].Seekers.name}
                    </div>
                )
            })}
            {showChat && <ChatClient sender={props.user} receiver={selectedUser} conversation_id={selectedConvo} />}
        </div>
    )
}
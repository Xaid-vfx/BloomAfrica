'use client'
import ChatClient from "@/components/Chat/Chat";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function SeekerMessages(props) {

    const [showChat, setshowChat] = useState(false)
    const [selectedUser, setselectedUser] = useState()
    const [selectedConvo, setselectedConvo] = useState()

    useEffect(() => {
    }, [])
    return (
        <div className="h-full w-full bg-white">
            <h1>Messages</h1>
            {props.relations?.map((relation) => {
                return (
                    <div onClick={() => {
                        setshowChat(true)
                        setselectedUser(relation?.conversations?.conversation_participants[0])
                        setselectedConvo(relation?.conversation_id)
                        console.log(selectedUser);

                    }} className="border text-black bg-gray-300">
                        {relation?.conversations?.conversation_participants[0].Recruiters.name}
                    </div>
                )
            })}
            {showChat && <ChatClient sender={props.user} receiver={selectedUser} conversation_id={selectedConvo} />}
        </div>
    )
}
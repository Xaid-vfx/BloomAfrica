'use client'
import ChatClient from "@/components/Chat/Chat";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa6";

export default function SeekerMessages(props) {

    const [showChat, setshowChat] = useState(false)
    const [selectedUser, setselectedUser] = useState()
    const [selectedConvo, setselectedConvo] = useState()

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();

        const diff = now - date;
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diff / (1000 * 60));

        if (diffDays === 0) {
            // Today
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            return `${formattedHours}:${formattedMinutes} ${ampm}`;
        } else if (diffDays === 1) {
            // Yesterday
            return 'Yesterday';
        } else if (diffDays < 7) {
            // This week
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()];
        } else {
            // Older than a week
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-based
            const day = date.getDate();
            return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        }
    }

    useEffect(() => {
    }, [])
    return (
        <div className="lg:px-8 lg:py-8 flex w-full h-full lg:bg-[#F5F5F5] overflow-scroll">
            <div className={`${showChat ? 'w-[40%]' : 'w-full'}  bg-white p-4`}>
                {props.relations?.map((relation) => {
                    return (
                        <div onClick={() => {
                            setshowChat(true)
                            setselectedUser(relation?.conversations?.conversation_participants[0])
                            setselectedConvo(relation?.conversation_id)
                            console.log(selectedUser);

                        }} className={`flex items-center gap-4 text-black px-4 py-3 cursor-pointer ${selectedUser?.recruiter == relation?.conversations?.conversation_participants[0].recruiter ? 'bg-[#E9EBFD]' : ''}  hover:bg-[#E9EBFD]`}>
                            <FaRegUser className="text-2xl" />
                            <div className="w-full">
                                <div className="flex justify-between w-full">
                                    <p className="font-semibold text-sm">{relation?.conversations?.conversation_participants[0].Recruiters.name}</p>
                                    <p className="text-xs mt-1 text-[#7C8493]">{formatTimestamp(relation?.conversations?.last_message_timestamp)}</p>
                                </div>
                                <p className="text-sm mt-1 text-[#515B6F]">{relation?.conversations?.last_message}</p>
                            </div>

                        </div>
                    )
                })}
            </div>
            {showChat && <ChatClient sender={props.user} receiver={selectedUser} conversation_id={selectedConvo} />}
        </div>
    )
}
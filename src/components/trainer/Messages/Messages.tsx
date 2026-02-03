'use client'

import ChatClient from "@/components/Chat/Chat";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRecruiter } from "@/context/RecruiterContext";

export default function Messages() {
    const { user, recruiter, company } = useRecruiter();
    const [relations, setrelations] = useState([]);
    const [showChat, setshowChat] = useState(false);
    const [selectedUser, setselectedUser] = useState();
    const [selectedConvo, setselectedConvo] = useState();
    const [supabaseClient] = useState(() => createClientComponentClient());

    function convertToLocalTime(utcTimeStr) {
        console.log(utcTimeStr);

        const match = utcTimeStr.match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])/);

        if (!match) {
            return utcTimeStr;
        }

        let [, hours, minutes, period] = match;

        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (period.toLowerCase() === "pm" && hours !== 12) {
            hours += 12;
        } else if (period.toLowerCase() === "am" && hours === 12) {
            hours = 0;
        }

        const now = new Date();
        const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes));

        const localDate = new Date(utcDate.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return localDate.toLocaleString('en-US', options);
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();

        const diff = now - date;
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            return `${formattedHours}:${formattedMinutes} ${ampm}`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[date.getDay()];
        } else {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        }
    }

    useEffect(() => {
        async function fetchRelations() {
            const { data, error } = await supabaseClient
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
                .eq('recruiter', recruiter.uniqueid || recruiter.id);

            if (error) {
                console.error('Error fetching conversations:', error);
                return;
            }

            const sortedData = data.sort((a, b) => new Date(b.conversations.last_message_timestamp) - new Date(a.conversations.last_message_timestamp));
            setrelations(sortedData);

            // Fetch unread messages count for each conversation
            await fetchUnreadMessagesCount(sortedData);
        }

        async function fetchUnreadMessagesCount(conversations) {
            const updatedConversations = await Promise.all(conversations.map(async (relation) => {
                const { data: unreadMessages, error } = await supabaseClient
                    .from('messages')
                    .select('id')
                    .eq('conversation_id', relation.conversation_id)
                    .eq('read', false)
                    .eq('receiver_id', recruiter.uniqueid || recruiter.id);

                if (error) {
                    console.error('Error fetching unread messages:', error);
                    return relation;
                }

                return {
                    ...relation,
                    unreadMessagesCount: unreadMessages.length,
                };
            }));

            setrelations(updatedConversations);
        }

        fetchRelations();

        const channel = supabaseClient
            .channel('conversations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, payload => {
                fetchRelations();
            })
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [recruiter?.uniqueid, recruiter?.id, supabaseClient]);

    const handleChatClick = (relation) => {
        setshowChat(true);
        setselectedUser(relation?.conversations?.conversation_participants[0]);
        setselectedConvo(relation?.conversation_id);

        // Update unreadMessagesCount to 0 for the selected conversation
        setrelations((prevRelations) =>
            prevRelations.map((r) =>
                r.conversation_id === relation.conversation_id
                    ? { ...r, unreadMessagesCount: 0 }
                    : r
            )
        );
    };

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            {/* Fixed Header */}
            <div className="flex-shrink-0 px-4 py-6 lg:p-8 border-b border-gray-100">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Messages</h1>
                <p className="text-gray-600 mt-1">Communicate with apprentice applicants</p>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden relative">
                <div className='flex flex-row h-full lg:gap-5 px-4 py-6 lg:p-8'>
                    <div className={`${showChat ? 'lg:w-[40%] hidden lg:block' : 'w-full'} overflow-y-auto lg:relative absolute bottom-0 top-0 left-0 right-0 z-10 border-2 border-gray-100 rounded-xl bg-white`}>
                        {relations?.map((relation) => {
                            return (
                                <div
                                    key={relation.conversation_id}
                                    onClick={() => handleChatClick(relation)}
                                    className={`flex items-center gap-4 text-black px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedUser?.seeker == relation?.conversations?.conversation_participants[0].seeker ? 'bg-[#14B8A6]/10' : ''}  hover:bg-[#14B8A6]/5`}
                                >
                                    <div className="w-full">
                                        <div className="flex justify-between w-full">
                                            <p className="font-semibold text-sm text-[#0A1F44]">{relation?.conversations?.conversation_participants[0].Seekers.name}</p>
                                            <p className={`text-xs mt-1 ${relation.unreadMessagesCount > 0 ? 'font-semibold text-[#14B8A6]' : 'text-gray-500'}`}>{convertToLocalTime(formatTimestamp(relation?.conversations?.last_message_timestamp))}</p>
                                        </div>
                                        <div className="flex justify-between w-full items-center">
                                            <p className="text-sm mt-1 text-gray-600 truncate pr-2">{relation?.conversations?.last_message}</p>
                                            {relation.unreadMessagesCount > 0 && (
                                                <p className="text-[.55rem] mt-1 text-white bg-[#14B8A6] px-2 py-1 rounded-full flex-shrink-0">{relation.unreadMessagesCount}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='w-[60%] lg:flex hidden'>
                        {showChat && <ChatClient back={() => {
                            setshowChat(false);
                        }} sender={user} receiver={selectedUser} conversation_id={selectedConvo} />}
                    </div>
                    <div className='flex w-full absolute bottom-0 top-0 left-0 right-0 z-0 lg:hidden'>
                        {showChat && <ChatClient back={() => {
                            setshowChat(false);
                        }} sender={user} receiver={selectedUser} conversation_id={selectedConvo} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

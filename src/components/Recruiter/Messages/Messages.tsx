import ChatClient from "@/components/Chat/Chat";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";

export default function Messages(props) {
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
                .eq('recruiter', props.recruiter.uniqueid);

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
                    .eq('receiver_id', props.recruiter.uniqueid);

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
    }, [props.recruiter.uniqueid, supabaseClient]);

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

        <div className="flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white p-0 lg:p-8 relative ">
            <h1 className="font-bold text-2xl text-[#4A2C84] hidden lg:mb-6 lg:block">Messages
            </h1>
            <div className='flex flex-row h-full max-h-[calc(100%-3.3rem)] lg:gap-5'>
                <div className={`${showChat ? 'lg:w-[40%] hidden lg:block' : 'w-full'} overflow-scroll lg:relative absolute bottom-0 top-0 left-0 right-0 z-10 rounded-xl border border-gray-300 bg-white`}>
                    {relations?.map((relation) => {
                        return (
                            <div onClick={() => handleChatClick(relation)} className={`flex items-center gap-4 text-black px-4 py-3 border-b-[1px] border-gray-200 cursor-pointer ${selectedUser?.seeker == relation?.conversations?.conversation_participants[0].seeker ? 'bg-[#E9EBFD]' : ''}  hover:bg-[#E9EBFD]`}>

                                <div className="w-full">
                                    <div className="flex justify-between w-full">
                                        <p className="font-semibold text-sm">{relation?.conversations?.conversation_participants[0].Seekers.name}</p>
                                        <p className={`text-xs mt-1 ${relation.unreadMessagesCount > 0 ? 'font-semibold text-[#4A2C84]' : 'text-[#7C8493]'}`}>{convertToLocalTime(formatTimestamp(relation?.conversations?.last_message_timestamp))}</p>
                                    </div>
                                    <div className="flex justify-between w-full items-center">
                                        <p className="text-sm mt-1 text-[#515B6F]">{relation?.conversations?.last_message}</p>
                                        {relation.unreadMessagesCount > 0 && (
                                            <p className="text-[.55rem] mt-1 text-white bg-[#4A2C84] px-2 py-1 rounded-full">{relation.unreadMessagesCount}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className=' w-[60%] lg:flex hidden'>
                    {showChat && <ChatClient back={() => {
                        setshowChat(false);
                    }} sender={props.user} receiver={selectedUser} conversation_id={selectedConvo} />}
                </div>
                <div className=' flex w-full  absolute bottom-0 top-0 left-0 right-0 z-0 lg:hidden '>
                    {showChat && <ChatClient back={() => {
                        setshowChat(false);
                    }} sender={props.user} receiver={selectedUser} conversation_id={selectedConvo} />}
                </div>

            </div>

        </div>
    );
}

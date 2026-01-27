'use client'
import ChatClient from "@/components/Chat/Chat";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { MessageCircle, Search, Mail } from "lucide-react";

export default function SeekerMessages(props) {

    const [showChat, setshowChat] = useState(false);
    const [selectedUser, setselectedUser] = useState();
    const [selectedConvo, setselectedConvo] = useState();
    const [relations, setrelations] = useState(props.relations);
    const [supabaseClient] = useState(() => createClientComponentClient());

    function convertToLocalTime(utcTimeStr) {
        // Convert UTC time to local time
        const match = utcTimeStr.match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])/);
        if (!match) return "Invalid time format";

        let [, hours, minutes, period] = match;
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
        else if (period.toLowerCase() === "am" && hours === 12) hours = 0;

        const now = new Date();
        const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes));
        const localDate = new Date(utcDate.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return localDate.toLocaleString('en-US', options);
    }

    function formatTimestamp(timestamp) {
        // Format timestamp to human-readable format
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
                            recruiter,
                            Recruiters (
                                name
                            )
                        )
                    )
                `)
                .eq('seeker', props.user.id);

            if (error) {
                console.error('Error fetching conversations:', error);
                return
            }
            const sortedData = data.sort((a, b) => new Date(b.conversations.last_message_timestamp) - new Date(a.conversations.last_message_timestamp));
            console.log(sortedData);

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
                    .eq('receiver_id', props.user.id);

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

        // Subscribe to real-time changes
        const channel = supabaseClient
            .channel('conversations')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, payload => {
                // Refresh the data when there are changes
                fetchRelations();
            })
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [props.user.id, supabaseClient]);

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
        <div className="relative min-h-screen">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.04] pointer-events-none -z-10" style={{ transform: 'translate(30%, -20%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-0 left-0 w-[350px] h-[350px] opacity-[0.05] pointer-events-none -z-10" style={{ transform: 'translate(-25%, 25%)' }}>
                <path fill="#0A1F44" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <MessageCircle className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0A1F44]">Messages</h1>
                </div>
                <p className="text-gray-600 ml-16">
                    {relations.length > 0
                        ? `${relations.length} ${relations.length === 1 ? 'conversation' : 'conversations'}`
                        : "Start a conversation with trainers"}
                </p>
            </div>

            {/* Content */}
            {relations.length > 0 ? (
                <div className='flex flex-row w-full gap-6 h-[calc(100vh-250px)] lg:h-[600px]'>
                    {/* Conversation List */}
                    <div className={`${showChat ? 'lg:w-[40%] w-full hidden lg:block' : 'w-full'} bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden`}>
                        <div className="overflow-y-auto h-full">
                            {relations.map((relation, index) => {
                                const name = relation?.conversations?.conversation_participants[0].Recruiters.name;
                                const check = selectedUser?.Recruiters.name === name;
                                const ts = convertToLocalTime(formatTimestamp(relation?.conversations?.last_message_timestamp));
                                const lm = relation?.conversations?.last_message;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleChatClick(relation)}
                                        className={`flex items-center gap-4 px-4 py-4 border-b border-gray-100 cursor-pointer transition-colors ${
                                            check ? 'bg-[#F0FDFA] border-l-4 border-l-[#14B8A6]' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg ${
                                            check ? 'bg-[#14B8A6] text-white' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {name?.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-semibold text-[#0A1F44] truncate">{name}</p>
                                                <p className={`text-xs ml-2 flex-shrink-0 ${
                                                    relation.unreadMessagesCount > 0 ? 'font-semibold text-[#14B8A6]' : 'text-gray-500'
                                                }`}>
                                                    {ts}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-600 truncate pr-2">{lm}</p>
                                                {relation.unreadMessagesCount > 0 && (
                                                    <span className="flex-shrink-0 bg-[#14B8A6] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                        {relation.unreadMessagesCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className='lg:w-[60%] lg:flex w-full hidden'>
                        {showChat ? (
                            <ChatClient
                                back={() => setshowChat(false)}
                                sender={props.user}
                                receiver={selectedUser}
                                conversation_id={selectedConvo}
                            />
                        ) : (
                            <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="bg-[#14B8A6]/10 rounded-full p-6 inline-block mb-4">
                                        <MessageCircle className="text-[#14B8A6]" size={48} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-gray-600">Select a conversation to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Chat */}
                    <div className='flex w-full absolute bottom-0 top-0 left-0 right-0 z-20 lg:hidden'>
                        {showChat && (
                            <ChatClient
                                back={() => setshowChat(false)}
                                sender={props.user}
                                receiver={selectedUser}
                                conversation_id={selectedConvo}
                            />
                        )}
                    </div>
                </div>
            ) : (
                // Empty State
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 md:p-16">
                    <div className="max-w-md mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="bg-[#14B8A6]/10 rounded-full p-8">
                                    <MessageCircle className="text-[#14B8A6]" size={64} strokeWidth={1.5} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                                    <Mail className="text-gray-400" size={24} />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-[#0A1F44] mb-3">
                            No Messages Yet
                        </h2>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            When you apply to apprenticeships or connect with trainers,
                            your conversations will appear here.
                        </p>

                        <a
                            href="/all-trainings"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#14B8A6] text-white rounded-xl font-medium hover:bg-[#0D9488] transition-colors shadow-lg shadow-[#14B8A6]/30"
                        >
                            <Search size={20} />
                            Explore Apprenticeships
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

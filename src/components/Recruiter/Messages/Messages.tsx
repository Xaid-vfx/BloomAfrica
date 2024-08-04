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
        // Extract hours and minutes from the input string
        const match = utcTimeStr.match(/(\d{1,2}):(\d{2})\s*([AaPp][Mm])/);

        if (!match) {
            return "Invalid time format";
        }

        let [, hours, minutes, period] = match;

        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        // Convert 12-hour format to 24-hour format
        if (period.toLowerCase() === "pm" && hours !== 12) {
            hours += 12;
        } else if (period.toLowerCase() === "am" && hours === 12) {
            hours = 0;
        }

        // Create a Date object using the extracted hours and minutes in UTC
        const now = new Date();
        const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes));

        // Convert the UTC date to the local time
        const localDate = new Date(utcDate.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));

        // Format the local time in 12-hour format with am/pm
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        return localDate.toLocaleString('en-US', options);
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();

        const diff = now - date;
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diff / (1000 * 60));

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
            } else {
                const sortedData = data.sort((a, b) => new Date(b.conversations.last_message_timestamp) - new Date(a.conversations.last_message_timestamp));
                console.log(sortedData);

                setrelations(sortedData);
            }
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
    }, [props.recruiter.uniqueid, supabaseClient]);

    return (
        <div className="lg:px-8 lg:py-8 flex w-full h-full lg:bg-[#F5F5F5] overflow-scroll">
            <div className={`${showChat ? 'w-[40%] hidden lg:block' : 'w-full'}  bg-white p-4`}>
                {relations?.map((relation) => {
                    return (
                        <div onClick={() => {
                            setshowChat(true);
                            setselectedUser(relation?.conversations?.conversation_participants[0]);
                            setselectedConvo(relation?.conversation_id);
                        }} className={`flex items-center gap-4 text-black px-4 py-3 cursor-pointer ${selectedUser?.seeker == relation?.conversations?.conversation_participants[0].seeker ? 'bg-[#E9EBFD]' : ''}  hover:bg-[#E9EBFD]`}>
                            <FaRegUser className="text-2xl" />
                            <div className="w-full">
                                <div className="flex justify-between w-full">
                                    <p className="font-semibold text-sm">{relation?.conversations?.conversation_participants[0].Seekers.name}</p>
                                    <p className="text-xs mt-1 text-[#7C8493]">{convertToLocalTime(formatTimestamp(relation?.conversations?.last_message_timestamp))}</p>
                                </div>
                                <p className="text-sm mt-1 text-[#515B6F]">{relation?.conversations?.last_message}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            {showChat && <ChatClient back={() => {
                setshowChat(false);
            }} sender={props.user} receiver={selectedUser} conversation_id={selectedConvo} />}
        </div>
    );
}

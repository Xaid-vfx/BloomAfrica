"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { IoMdSend } from "react-icons/io";
import { IoChevronBackCircle } from "react-icons/io5";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client = createClient(supabaseUrl, supabaseAnonKey);

export default function ChatClient({ back, sender, receiver, conversation_id }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState("");
    const [lastMessageTimestamp, setLastMessageTimestamp] = useState("");
    const messagesEndRef = useRef(null);
    const newMessageRef = useRef(null);
    console.log(receiver.recruiter);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };

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

    function formatTodayTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    async function updateLastMessage(newMessage, newTimestamp) {
        // Update only if the last message or timestamp has changed
        if (lastMessage !== newMessage || lastMessageTimestamp !== newTimestamp) {
            const { error: updateError } = await client
                .from('conversations')
                .update({
                    last_message: newMessage,
                    last_message_timestamp: newTimestamp
                })
                .eq('id', conversation_id);

            if (updateError) {
                console.error('Error updating conversation:', updateError);
            } else {
                // Update local state
                setLastMessage(newMessage);
                setLastMessageTimestamp(newTimestamp);
            }
        }
    }

    useEffect(() => {
        if (!conversation_id) return;

        // Fetch initial messages
        async function fetchMessages() {
            const { data, error } = await client
                .from('messages')
                .select('*')
                .eq('conversation_id', conversation_id)
                .order('created_at', { ascending: true });

            if (error) console.error('Error fetching messages:', error);
            else {
                setMessages(data);
                // Set initial last message and timestamp
                if (data.length > 0) {
                    const lastMsg = data[data.length - 1];
                    setLastMessage(lastMsg.text);
                    setLastMessageTimestamp(lastMsg.created_at);
                }
            }
        }

        fetchMessages();

        // Subscribe to new messages
        const channel = client
            .channel(`conversation:${conversation_id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                if (payload.new.conversation_id === conversation_id) {
                    setMessages((prev) => [...prev, payload.new]);
                    console.log('New message received:', payload.new);
                }
            })
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            client.removeChannel(channel);
        };
    }, [conversation_id]);

    useEffect(() => {
        // Scroll to the bottom when messages change
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            updateLastMessage(lastMsg.text, lastMsg.created_at);
        }
    }, [messages]);

    useEffect(() => {
        async function markMessagesAsRead() {
            // Filter unread messages from the opposite party
            const unreadMessages = messages.filter(msg => !msg.read && msg.sender_id !== sender.id);
            const unreadMessageIds = unreadMessages.map(msg => msg.id);

            if (unreadMessageIds.length > 0) {
                const { error } = await client
                    .from('messages')
                    .update({ read: true })
                    .in('id', unreadMessageIds);

                if (error) console.error('Error marking messages as read:', error);
            }
        }

        markMessagesAsRead();
    }, [messages]);

    async function onSend() {
        const { data, error } = await client
            .from('messages')
            .insert([{ text: message, sender_id: sender.id, conversation_id, receiver_id: receiver?.seeker || receiver?.recruiter }]);

        if (error) console.error('Error sending message:', error);
        else {
            setMessage(""); // Clear input after sending
        }
        newMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const firstUnreadIndex = messages.findIndex((msg) => !msg.read);

    return (
        <div className="h-full w-full lg:w-3/4 flex flex-col bg-[#ededed]">
            <div className="flex lg:justify-center gap-4 items-center bg-white py-4 lg:py-6 px-4 font-medium">
                <IoChevronBackCircle onClick={() => { back() }} className="lg:hidden cursor-pointer text-2xl" />
                <p className="">{receiver.Seekers?.name}{receiver.Recruiters?.name}</p>
            </div>
            <div ref={messagesEndRef} className="overflow-scroll h-full">
                {messages.map((e, index) => {
                    return (
                        <div key={index} className={`px-4 my-3 w-full flex flex-col ${e.sender_id !== sender.id ? '' : 'items-end'}`}>
                            {index === firstUnreadIndex && (
                                <div className="flex items-center justify-center w-full my-2">
                                    <hr className="flex-grow border-t border-gray-300" />
                                    <span className="mx-2 text-gray-500 text-sm">Unread Messages</span>
                                    <hr className="flex-grow border-t border-gray-300" />
                                </div>
                            )}
                            <p className={`w-fit flex gap-3 text-sm  px-4 bg-white border ${e.sender_id !== sender.id ? 'rounded-e-2xl rounded-b-2xl' : 'rounded-s-2xl rounded-b-2xl'} `}>
                                <p className="py-2">{e.text}</p>
                                <p className="text-[.6rem] text-right pt-4 pb-0 text-[#7C8493]">{convertToLocalTime(formatTodayTime(e.created_at))}</p>
                            </p>
                        </div>
                    )
                })}
                <div ref={newMessageRef} />
            </div>
            <div className="lg:w-full flex bg-white border m-1 lg:m-0">
                <input
                    value={message}
                    placeholder="Write a message"
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    className="w-full outline-none px-4 py-2 text-sm placeholder:text-sm"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') onSend();
                    }}
                />
                <div className="flex bg-[#4A2C84] justify-center items-center px-6 py-2 m-1">
                    <IoMdSend className="text-2xl cursor-pointer text-white" onClick={onSend} />
                </div>
            </div>
        </div>
    );
}

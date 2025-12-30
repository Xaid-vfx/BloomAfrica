"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, ArrowLeft } from "lucide-react";

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
        // Prevent sending empty messages or messages with only whitespace
        if (!message.trim()) {
            return;
        }

        const { data, error } = await client
            .from('messages')
            .insert([{
                text: message.trim(), // Trim whitespace from message
                sender_id: sender.id,
                conversation_id,
                receiver_id: receiver?.seeker || receiver?.recruiter
            }]);

        if (error) console.error('Error sending message:', error);
        else {
            setMessage(""); // Clear input after sending
        }
        newMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const firstUnreadIndex = messages.findIndex((msg) => !msg.read);

    return (
        <div className="h-full w-full flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 bg-white">
                <button
                    onClick={() => back()}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="text-[#14B8A6]" size={24} />
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-semibold">
                    {receiver.Seekers?.name?.charAt(0).toUpperCase() || receiver.Recruiters?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                    <p className="font-semibold text-[#0A1F44]">
                        {receiver.Seekers?.name || receiver.Recruiters?.name}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div ref={messagesEndRef} className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {messages.map((e, index) => {
                    // Determine if this message is unread and should show the separator
                    const isUnreadMessage = e.sender_id === receiver.seeker || receiver.recruiter && !e.read;

                    return (
                        <div key={index}>
                            {index === firstUnreadIndex && isUnreadMessage && (
                                <div className="flex items-center justify-center my-4">
                                    <hr className="flex-grow border-t border-gray-300" />
                                    <span className="mx-3 text-xs text-gray-500 font-medium bg-white px-3 py-1 rounded-full">
                                        Unread Messages
                                    </span>
                                    <hr className="flex-grow border-t border-gray-300" />
                                </div>
                            )}
                            <div className={`mb-3 flex ${e.sender_id === sender.id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] ${e.sender_id === sender.id ? 'bg-[#14B8A6] text-white' : 'bg-white border border-gray-200'} rounded-2xl px-4 py-2.5 shadow-sm`}>
                                    <p className="text-sm break-words">{e.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${e.sender_id === sender.id ? 'text-white/70' : 'text-gray-500'}`}>
                                        {convertToLocalTime(formatTodayTime(e.created_at))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={newMessageRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-[#14B8A6] transition-colors">
                    <input
                        value={message}
                        placeholder="Write a message..."
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className="flex-1 bg-transparent outline-none px-4 py-3 text-sm placeholder:text-gray-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') onSend();
                        }}
                    />
                    <button
                        onClick={onSend}
                        disabled={!message.trim()}
                        className="m-1 bg-[#14B8A6] hover:bg-[#0D9488] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-colors shadow-md shadow-[#14B8A6]/20"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

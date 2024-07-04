"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { IoMdSend } from "react-icons/io";
import { FaRegUser } from "react-icons/fa6";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client = createClient(supabaseUrl, supabaseAnonKey);

export default function ChatClient({ sender, receiver, conversation_id }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const newMessageRef = useRef(null);

    const scrollToBottom = () => {
        console.log(messagesEndRef);
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    };
    function formatTodayTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }


    useEffect(() => {
        if (!conversation_id) return;

        // Fetch initial messages
        async function fetchMessages() {
            const { data, error } = await client
                .from('messages')
                .select('*')
                .eq('conversation_id', conversation_id);

            if (error) console.error('Error fetching messages:', error);
            else setMessages(data);
        }

        fetchMessages();

        // Subscribe to new messages
        const channel = client
            .channel(`conversation:${conversation_id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                setMessages((prev) => [...prev, payload.new]);
                console.log('New message received:', payload.new);
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
        async function updateLastMessage() {
            const newMessage = messages[messages.length - 1]?.text;

            // Update last message in conversation
            const { error: updateError } = await client
                .from('conversations')
                .update({
                    last_message: newMessage,
                    last_message_timestamp: new Date().toISOString()
                })
                .eq('id', conversation_id);

            if (updateError) {
                console.error('Error updating conversation:', updateError);
            }
        }
        updateLastMessage();
    }, [messages]);

    async function onSend() {

        const { data, error } = await client
            .from('messages')
            .insert([{ text: message, sender_id: sender.id, conversation_id }]);

        if (error) console.error('Error sending message:', error);
        else {
            setMessage(""); // Clear input after sending
        }
        newMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div className="h-full w-3/4 flex flex-col bg-[#ededed]">
            <div className="flex flex-col justify-center items-center bg-white py-6 px-4 font-medium">
                <p className="">{receiver.Seekers?.name}{receiver.Recruiters?.name}</p>
            </div>
            <div ref={messagesEndRef} className="overflow-scroll h-full">
                {messages.map((e, index) => (
                    <div key={index} className={`px-4 my-3 w-full flex flex-col ${e.sender_id !== sender.id ? '' : 'items-end'}`}>
                        <p className={`w-fit flex gap-3 text-sm  px-4 bg-white border ${e.sender_id !== sender.id ? 'rounded-e-2xl rounded-b-2xl' : 'rounded-s-2xl rounded-b-2xl'} `}>
                            <p className="py-2">{e.text}</p>
                            <p className="text-[.6rem] text-right pt-4 pb-0 text-[#7C8493]">{formatTodayTime(e.created_at)}</p>
                        </p>
                    </div>
                ))}
                <div ref={newMessageRef} />
            </div>
            <div className="w-full flex bg-white border">
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
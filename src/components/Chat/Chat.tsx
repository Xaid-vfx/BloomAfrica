"use client";
import { useEffect, useState, useRef } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ChatClient(props: any) {
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<string>("Jane");
    const [messages, setMessages] = useState([]);

    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const channelA = client.channel('room-1')

    function messageReceived(payload) {
        console.log(payload)
    }

    // async function onSend() {
    //     const supabase = createClientComponentClient()
    //     const { data, error } = await supabase
    //         .from('messages')
    //         .insert({ text: message })

    //     // Join a room/topic. Can be anything except for 'realtime'.
    //     const channelB = client.channel('room-1')

    //     channelB.subscribe((status) => {
    //         // Wait for successful connection
    //         if (status !== 'SUBSCRIBED') {
    //             return null
    //         }
    //         // Send a message once the client is subscribed
    //         channelB.send({
    //             type: 'broadcast',
    //             event: 'test',
    //             payload: { message: message },
    //         })
    //     })
    // }

    // client
    //     .channel('room-1')
    //     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
    //         setMessages((prev) => [...prev, payload])
    //         console.log(payload);
    //     })
    //     .subscribe()

    // useEffect(() => {
    //     async function fetchmessages() {


    //     }
    //     fetchmessages()
    // }, [])

    useEffect(() => {
        console.log('useEffect');
        console.log(props.sender);
        console.log(props.receiver);



        // Fetch initial messages
        async function fetchMessages() {
            const { data, error } = await client
                .from('messages')
                .select('*')
                .eq('conversation_id', props.conversation_id)

            if (error) console.error('Error fetching messages:', error);
            else setMessages(data);
        }

        fetchMessages();

        // Subscribe to new messages
        const channel = client
            .channel(`${props.conversation_id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                setMessages((prev) => [...prev, payload.new]);
                console.log('New message received:', payload.new);
            })
            .subscribe();

        // Cleanup subscription on unmount
        return () => {
            client.removeChannel(channel);
        };
    }, [props.receiver]);

    async function onSend() {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase
            .from('messages')
            .insert([{ text: message, conversation_id: props.conversation_id }]);

        console.log(data);

        if (error) console.error('Error sending message:', error);
        else setMessage(""); // Clear input after sending
    }
    return (
        <div className="lg:px-8 lg:py-8 w-full h-full lg:bg-[#F5F5F5] overflow-scroll">
            <input value={message} onChange={(e) => { setMessage(e.target.value) }} type="text" className="border rounded-lg px-4 py-2 text-sm" />
            <Button onClick={onSend}>Send</Button>
            {messages?.map(e => {
                return <div>
                    {e?.text}
                </div>
            })}
        </div>
    );
}
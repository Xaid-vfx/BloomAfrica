import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { BsChatText } from "react-icons/bs";

export function DialogDemo(props) {

    const [message, setMessage] = useState('')

    async function createConversation() {
        console.log(props.seeker_id);
        const supabase = createClientComponentClient();

        try {
            // Check if the conversation already exists
            const { data: existingConversations, error: checkError } = await supabase
                .from('conversation_participants')
                .select('conversation_id')
                .eq('seeker', props.seeker_id)
                .eq('recruiter', props.user_id)
                .single();  // Use single() to get a single row (if exists)

            if (checkError && checkError.code !== 'PGRST116') throw checkError;  // Handle errors other than no rows found

            let conversation_id;

            if (existingConversations) {
                conversation_id = existingConversations.conversation_id;
            } else {
                // Create a new conversation if it doesn't exist
                const { data: conversationData, error: conversationError } = await supabase
                    .from('conversations')
                    .insert([{ last_message: 'First message' }])
                    .select('id')
                    .single();  // Use single() to get a single row (the created conversation)

                if (conversationError) throw conversationError;

                conversation_id = conversationData.id;

                // Insert participants
                const { data: participantData, error: participantError } = await supabase
                    .from('conversation_participants')
                    .insert([
                        { seeker: props.seeker_id, recruiter: props.user_id, conversation_id }
                    ]);

                if (participantError) throw participantError;

                console.log(participantData);
            }

            // Insert the message
            const { data: messageData, error: messageError } = await supabase
                .from('messages')
                .insert([{ text: message, sender_id: props.user_id, conversation_id, receiver_id: props.seeker_id }]);

            if (messageError) throw messageError;

            console.log(messageData);

            alert("Message sent successfully!");
            setMessage('')

        } catch (error) {
            console.error("Error creating conversation or sending message:", error);
            alert("Error creating conversation or sending message. Please try again.");
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className=''>
                    <div className="border border-[#4A2C84] lg:flex gap-2 items-center justify-center hidden text-sm font-medium cursor-pointer text-[#4A2C84] px-4 py-2 lg:font-semibold rounded-xl"><BsChatText className="text-xl" /> Chat</div>
                    <BsChatText className="lg:hidden text-2xl" />
                </div>
            </DialogTrigger>
            <DialogContent className="lg:w-[50%] w-[80%] max-w-none">
                <DialogHeader>
                    <DialogTitle>Send a Message to {props.name}</DialogTitle>
                </DialogHeader>

                <div className="">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full text-sm rounded p-4 border outline-none"
                        rows={10}
                        placeholder="Type a message"
                    ></textarea>
                </div>

                <DialogFooter>
                    <Button onClick={createConversation} className="bg-[#4A2C84]" type="submit">
                        Send
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

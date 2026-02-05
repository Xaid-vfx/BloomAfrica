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
                <button className="text-gray-500 hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 p-1.5 rounded-lg transition-colors">
                    <BsChatText className="text-base" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[90%] rounded-2xl p-0 overflow-hidden bg-white">
                <DialogHeader className="px-5 pt-5 pb-3">
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                        Message {props.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="px-5 pb-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full text-sm rounded-xl p-4 border border-gray-200 outline-none focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] transition-colors resize-none"
                        rows={5}
                        placeholder="Write your message..."
                    ></textarea>
                </div>

                <DialogFooter className="px-5 pb-5 pt-0">
                    <button
                        onClick={createConversation}
                        className="w-full bg-[#0A1F44] hover:bg-[#081832] text-white font-medium py-2.5 rounded-xl transition-colors"
                        type="submit"
                    >
                        Send Message
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

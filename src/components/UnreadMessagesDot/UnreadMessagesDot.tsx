'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function UnreadMessagesDot({ userId }: { userId: string }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const supabaseClient = createClientComponentClient();

    useEffect(() => {
        async function fetchUnreadMessages() {
            const { data, error } = await supabaseClient
                .from('messages')
                .select('id')
                .eq('receiver_id', userId)
                .eq('read', false);

            if (error) {
                console.error('Error fetching unread messages:', error);
                return;
            }

            setUnreadCount(data.length);
        }

        fetchUnreadMessages();

        // Optionally subscribe to real-time changes for updates
        const channel = supabaseClient
            .channel('messages')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
                // Update unread count on message changes
                fetchUnreadMessages();
            })
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [userId, supabaseClient]);

    return (
        unreadCount > 0 ? (
            <div className="bg-red-600 text-white rounded-full w-2 h-2 flex justify-center items-center">
            </div>
        ) : null
    );
}

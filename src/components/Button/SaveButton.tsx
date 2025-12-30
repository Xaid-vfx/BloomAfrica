"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Bookmark, BookmarkCheck } from "lucide-react"

type Props = {
    id: any
    user: any
}

export default function SaveButton(props: Props) {
    const supabase = createClientComponentClient()
    const [saved, setsaved] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    async function checkifSeekerisRegistered() {
        if (!props.user) return false;

        const { data, error } = await supabase
            .from('Seekers')
            .select()
            .eq('unique_id', props.user)

        if (error) {
            console.log(error);
            return false;
        }

        return data.length > 0;
    }

    async function checkifSeekerisAlreadySaved() {
        if (!props.user || !props.id) return false;

        const { data, error } = await supabase
            .from('Saved')
            .select()
            .eq('seeker_id', props.user)
            .eq('job_id', props.id)

        if (error) {
            console.log(error);
            return false;
        }

        return data.length > 0;
    }

    async function handleApplyJob() {
        if (props.user == null) {
            router.push('/signup?continue=/job?id=' + props.id)
            return
        }
        if (!await checkifSeekerisRegistered()) {
            toast.error("Please register as a seeker to Save this job")
            return
        }
        if (await checkifSeekerisAlreadySaved()) {
            toast.error("Already Saved!!")
            return
        }
        else {

            const { data: seekerData, error: seekerError } = await supabase
                .from('Seekers')
                .select()
                .eq('unique_id', props.user)
                .single()


            if (seekerError) {
                console.error('Error fetching Seeker:', seekerError.message);
                return;
            }

            if (!seekerData) {
                console.error('Seeker not found');
                return;
            }


            const { data, error } = await supabase
                .from('Saved')
                .insert({ job_id: props.id, name: seekerData.name })

            if (error) {
                console.log(error);
            }
            else {
                toast.success("Saved job!");
                setsaved(true);
            }
        }
    }

    useEffect(() => {
        async function CheckSaved() {
            setIsLoading(true);
            const res = await checkifSeekerisAlreadySaved()
            setsaved(res);
            setIsLoading(false);
        }
        CheckSaved();
    }, [props.user, props.id])

    if (isLoading) {
        return (
            <button
                disabled
                className="inline-flex items-center gap-2 text-gray-400 border-2 border-gray-200 py-3 px-6 text-center font-medium rounded-lg cursor-wait"
            >
                <Bookmark size={18} />
                Save
            </button>
        )
    }

    if (saved) {
        return (
            <button
                className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white py-3 px-6 text-center font-medium rounded-lg transition-colors shadow-md shadow-[#14B8A6]/20"
            >
                <BookmarkCheck size={18} />
                Saved
            </button>
        )
    }

    return (
        <button
            onClick={() => { handleApplyJob() }}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-[#14B8A6] border-2 border-gray-300 hover:border-[#14B8A6] py-3 px-6 text-center font-medium rounded-lg transition-colors"
        >
            <Bookmark size={18} />
            Save
        </button>
    )
}

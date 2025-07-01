"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
    id: any
    user: any
}

export default function SaveButton(props: Props) {
    const supabase = createClientComponentClient()
    const [saved, setsaved] = useState(false)
    const router = useRouter()

    async function checkifSeekerisRegistered() {
        console.log(props.user);

        const { data, error } = await supabase
            .from('Seekers')
            .select()
            .eq('unique_id', props.user)


        console.log(error);
        console.log(data);

        if (error) {
            console.log(error);
            return false;
        }
        else {
            console.log(data);
            if (data.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    async function checkifSeekerisAlreadySaved() {
        console.log(props.user);

        const { data, error } = await supabase
            .from('Saved')
            .select()
            .eq('seeker_id', props.user)
            .eq('job_id', props.id)

        if (error) {
            console.log(error);
            return false;
        }
        else {
            console.log(data.length);
            if (data.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
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
            else
                toast.success("Saved job!");
            console.log(data);
        }
    }

    useEffect(() => {
        async function CheckSaved() {
            const res = await checkifSeekerisAlreadySaved()
            return res;
        }
        CheckSaved().then((res) => {
            console.log(res);
            if (res == true) {
                setsaved(true)
            }
        })
    }, [])

    if (saved) {
        return <button className="  text-black border border-neutral-400 py-3 text-center font-medium rounded-2xl px-14" >Saved</button>
    }

    return (
        <button onClick={() => { handleApplyJob() }} className="  text-black border border-neutral-400  py-3 text-center font-medium rounded-2xl px-14" >Save</button>
    )
}
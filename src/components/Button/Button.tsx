"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Props = {
    id: any
    user: any
}

export default function Button(props: Props) {
    const supabase = createClientComponentClient()


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

    async function handleApplyJob() {
        if (!await checkifSeekerisRegistered()) {
            alert("Please register as a seeker to apply for a job")
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
                .from('Applicants')
                .insert({ job_id: props.id, name: seekerData.name })

            if (error) {
                console.log(error);
            }
            else
                alert("Applied for the job!");
            console.log(data);
        }
    }

    return (
        <button onClick={() => { handleApplyJob() }} className=" text-white py-3 text-center bg-[#4A2C84]  rounded-3xl font-medium px-14" >Apply</button>
    )
}
import StickyHeadTable from "@/components/General/Table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { MoonLoader, PropagateLoader } from 'react-spinners'
import Posted from '../../../assets/images/Recruiter/Job Open.png'
import Applications from '../../../assets/images/Recruiter/Job Open(1).png'
import Shortlisted from '../../../assets/images/Recruiter/Job Open(2).png'

type Props = {
    user: any
    company: any
    jobs: any
}

export default function Dashboard(props: Props) {

    const supabase = createClientComponentClient()
    const [applications, setapplications] = useState()

    useEffect(() => {
        async function fetchJobs() {
            const { data, error } = await supabase
                .from('Jobs')
                .select()
                .eq('recruiter', props.user.id)
            console.log(data);

            return data;
        }
        async function fetchApplications(jobs) {
            const { data, error } = await supabase
                .from('Applicants')
                .select()
                .eq('job_id', jobs[0].uid)

            return data;
        }
        fetchJobs().then(data => {
            console.log(data);
            fetchApplications(data).then(application => {
                setapplications(application)
                console.log(application);
            })

        })
    }, [])

    return (
        <div className="pt-10 px-10 bg-[#F5F5F5] h-[95%] w-full">
            <h1 className="font-semibold text-2xl">Good Morning,
                {/* {props.company[0]?.name.slice(0, props.company[0]?.name.indexOf(' '))} */}
            </h1>
            <div className="flex justify-between my-10">
                <div className="py-4 px-4 mx-2 bg-white rounded-md w-1/3 flex items-center gap-6">
                    <Image src={Posted} alt="" width={60} />
                    <div>
                        <div className="text-2xl text-semibold">{props.jobs.length}</div>
                        <div className="text-[#7C8493]">Posted Jobs</div>
                    </div>
                </div>
                <div className="py-4 px-4 mx-2 bg-white rounded-md w-1/3 flex items-center gap-6">
                    <Image src={Applications} alt="" width={60} />
                    <div>
                        <div className="text-2xl text-semibold">{applications?.length}</div>
                        <div className="text-[#7C8493]">Applications</div>
                    </div>
                </div>
                <div className="py-4 px-4 mx-2 bg-white rounded-md w-1/3 flex items-center gap-6">
                    <Image src={Shortlisted} alt="" width={60} />
                    <div>
                        <div className="text-2xl text-semibold">0</div>
                        <div className="text-[#7C8493]">Shorlisted</div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl">
                <h1 className="font-semibold text-2xl px-10 pt-6 pb-3">Recent Applications</h1>
                {applications?.length > 0 ? <StickyHeadTable applications={applications} /> :
                    <div className="flex justify-center items-center h-[300px]">
                        <MoonLoader color="#4A2C84" /> </div>}
            </div>
        </div>
    )
}
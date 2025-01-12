import StickyHeadTable from "@/components/General/Table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { MoonLoader, PropagateLoader } from 'react-spinners'
import Posted from '../../../assets/images/Recruiter/Job Open.png'
import Applications from '../../../assets/images/Recruiter/Job Open(1).png'
import Shortlisted from '../../../assets/images/Recruiter/Job Open(2).png'
import { IoLocationOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";

type Props = {
    user: any
    company: any
    jobs: any
    recruiter: any
}

export default function Dashboard(props: Props) {

    const supabase = createClientComponentClient()
    const [applications, setapplications] = useState(null)
    const [jobs, setjobs] = useState([])

    function handleJobCardClick(id) {
        console.log(id);
        props.getJobId(id)
        props.handleChangeTabIndex(3)
    }

    useEffect(() => {
        async function fetchJobs() {
            const { data, error } = await supabase
                .from('Jobs')
                .select()
                .eq('recruiter', props.user.id)

            return data;
        }
        async function fetchApplications(jobs) {
            if (jobs.length > 0) {
                const { data, error } = await supabase
                    .from('Applicants')
                    .select()
                    .eq('job_id', jobs[0].uid)
                return data;
            }
            return [];
        }
        fetchJobs().then(data => {
            setjobs(data)
            fetchApplications(data).then(application => {
                setapplications(application)
            })

        })
    }, [])

    return (
        
        <div className='flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white lg:pt-7 lg:px-8 pt-5 overflow-scroll'>

        
            <h1 className="lg:font-semibold my-4 lg:my-0 text-base lg:text-xl px-3 lg:px-0 lg:ml-4 ">Good Morning,
                {' ' + props.recruiter?.name}
            </h1>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 px-3 lg:px-0 justify-between lg:mt-6 mb-8">
                <div className="py-4 px-4 lg:mx-2 border rounded-lg bg-white lg:w-1/3 flex items-center lg:gap-6 gap-3">
                    <Image src={Posted} alt="" width={60} />
                    <div>
                        <div className="text-xl lg:text-2xl font-medium">{props.jobs.length}</div>
                        <div className="text-[#7C8493] text-sm lg:text-base">Posted Jobs</div>
                    </div>
                </div>
                <div className="py-4 px-4 lg:mx-2 border rounded-lg bg-white lg:w-1/3 flex items-center lg:gap-6 gap-3">
                    <Image src={Applications} alt="" width={60} />
                    <div>
                        <div className="text-xl lg:text-2xl font-medium">{applications?.length}</div>
                        <div className="text-[#7C8493] text-sm lg:text-base">Applications</div>
                    </div>
                </div>
                <div className="py-4 px-4 lg:mx-2 border rounded-lg bg-white lg:w-1/3 flex items-center lg:gap-6 gap-3">
                    <Image src={Shortlisted} alt="" width={60} />
                    <div>
                        <div className="text-xl lg:text-2xl font-medium">0</div>
                        <div className="text-[#7C8493] text-sm lg:text-base">Shorlisted</div>
                    </div>
                </div>
            </div>
            <div className="px-4 mb-6 lg:hidden">
                <h1 className="font-medium text-lg">Recent Listings</h1>
                <div className="my-4 flex flex-col gap-3 overflow-scroll">
                    {jobs && jobs.slice(0, 4).map((job: any) => {
                        return (
                            <div onClick={() => {
                                handleJobCardClick(job.uid)
                            }} className="border rounded-xl flex items-center gap-2 justify-between px-5 py-4">
                                <div className="">
                                    <p className="font-semibold mb-1">{job?.title}</p>
                                    <div className="text-sm text-[#4A2C84] flex item gap-1"><IoLocationOutline className="text-xl" /> {job?.location}</div>
                                </div>
                                <div className="min-w-fit rounded-2xl text-white text-sm py-2 px-5 bg-[#4A2C84]">Show More</div>
                            </div>
                        )
                    })}
                </div>
                <div onClick={() => { props.handleChangeTabIndex(3) }} className="flex items-center text-[#4A2C84] gap-2 my-2 justify-center cursor-pointer hover:underline">View All <FaArrowRightLong /></div>
            </div>
            <div className="hidden lg:block bg-white rounded-xl pb-7">
                <h1 className="font-semibold text-2xl px-10 pt-6 pb-3">Recent Applications</h1>

                {
                    applications == null ? <div className="flex justify-center items-center h-[250px]">
                        <MoonLoader color="#4A2C84" /> </div> : applications?.length > 0 ? <StickyHeadTable user={props.user} applications={applications} /> : <div className="flex justify-center items-center h-[200px]">
                            No applications found!
                        </div>
                }
                {/* {applications?.length > 0 ? <StickyHeadTable applications={applications} /> :
                    <div className="flex justify-center items-center h-[300px]">
                        <MoonLoader color="#4A2C84" /> </div>} */}
            </div>
        </div>
            
        
    )
}
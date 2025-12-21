import getUser from "@/lib/getUser/getUser";
import Sidebar from "../Sidebar";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Header from "../Header";
import AppliedTable from "@/components/General/AppliedTable";
import Applied from "./Applied";

async function fetchSeeker(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from('Seekers').select().eq('unique_id', id).single()

    console.log(data);
    return data;
}

async function fetchAppliedJobsWithPayments(id: string) {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })

    // Fetch both jobs and payment statuses in parallel
    const [applicantsResponse, paymentsResponse] = await Promise.all([
        supabase.from('Applicants').select().eq('seeker_id', id),
        supabase.from('jobpayments').select('job_id, status').eq('seeker_id', id)
    ]);

    const appliedJobs = await Promise.all(applicantsResponse.data?.map(async (job) => {
        const { data, error } = await supabase.from('Jobs').select().eq('uid', job.job_id).single();

        // Find payment status for this job
        const paymentStatus = paymentsResponse.data?.find(payment => payment.job_id === job.job_id)?.status;

        return {
            ...data,
            paymentStatus
        };
    }));

    return appliedJobs;
}

export const metadata: Metadata = {
    title: 'Applied Jobs | Prentis'
}

export default async function page() {
    cookies().getAll()
    const supabase = createServerComponentClient({ cookies })
    const user = await getUser();
    const company = await getCompany(user?.id)
    const seeker = await fetchSeeker(user?.id)
    const appliedjobs = await fetchAppliedJobsWithPayments(user?.id);

    console.log(appliedjobs);

    return (
        <div className="flex flex-col bg-[#F5F5F5] h-screen pb-5   ">
            <div>
                <Header name={seeker.name} />
            </div>
            <div className='flex flex-row lg:gap-5 mx-5 h-full '>
                <div className="h-full lg:w-[20%]">
                    <Sidebar />
                </div>
                <div className="w-full lg:w-[80%] flex flex-col lg:max-h-[calc(100vh-116px)] max-h-[calc(100vh-88px)]">
                    <Applied appliedjobs={appliedjobs} seekerId={user?.id} />
                </div>
            </div>
                
        </div>
        
    )
}

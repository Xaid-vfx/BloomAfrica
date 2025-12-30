import getUser from "@/lib/getUser/getUser";
import getCompany from "@/lib/getCompany/getCompany";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Applied from "./Applied";
import SeekerNavbar from "../../all-trainings/seekerNavbar";
import { Metadata } from "next";

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
        <div className="min-h-screen bg-white">
            <SeekerNavbar user={user || null} />
            <main className="px-6 py-10 max-w-7xl mx-auto">
                <Applied appliedjobs={appliedjobs} seekerId={user?.id} />
            </main>
        </div>
    )
}

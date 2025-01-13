import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

export async function deleteJob(id: string) {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
        .from('Jobs')
        .delete()
        .eq('uid', id);

    if (error) {
        console.error('Error deleting job:', error);
        throw error;
    }

    toast.success("Job Deleted Successfully!");
    return data;
}

export async function getApplicationsForJob(job_id: string) {
    const supabase = createClientComponentClient();

    // First fetch the job details
    const { data: jobData, error: jobError } = await supabase
        .from('Jobs')
        .select('*')
        .eq('uid', job_id)
        .single();

    if (jobError) {
        console.error('Error fetching job:', jobError);
        throw jobError;
    }

    // Then fetch the applications
    const { data: applications, error: applicationsError } = await supabase
        .from('Applicants')
        .select('*')
        .eq('job_id', job_id);

    if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        throw applicationsError;
    }

    return {
        job: jobData,
        applications: applications
    };
} 
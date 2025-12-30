'use client'

import StickyHeadTable from "@/components/General/Table"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import JobsTable from "@/components/General/JobsTable"
import {
    Briefcase,
    FileText,
    TrendingUp,
    Eye,
    MapPin,
    Calendar,
    Users,
    Plus,
    ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
    uid: string;
    title: string;
    description: string;
    recruiter: string;
    location?: string;
    created_at?: string;
}

interface Application {
    id: string;
    job: string;
}

interface Props {
    user: {
        id: string;
    };
    company: {
        name: string;
    };
    recruiter: {
        id: string;
        name?: string;
    };
}

export default function Dashboard({ user, company, recruiter }: Props) {
    const [applications, setApplications] = useState<Application[] | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        async function fetchJobs() {
            const { data, error } = await supabase
                .from('Jobs')
                .select()
                .eq('recruiter', user.id);

            if (data) {
                setJobs(data as Job[]);
            }
        }

        async function fetchApplications(jobs: Job[]) {
            const jobIds = jobs.map(job => job.uid);
            const { data: application, error } = await supabase
                .from('Applications')
                .select()
                .in('job', jobIds);

            if (application) {
                setApplications(application as Application[]);
            }
        }

        fetchJobs().then(() => {
            if (jobs.length > 0) {
                fetchApplications(jobs);
            }
        });
    }, [user.id]);

    const handleJobClick = (jobId: string) => {
        router.push(`/recruiter/listings?job=${jobId}`);
    };

    async function handleDeleteJob(id: string) {
        const { error } = await supabase
            .from('Jobs')
            .delete()
            .eq('uid', id);

        if (!error) {
            setJobs(jobs.filter(job => job.uid !== id));
        }
    }

    async function ApplicationsForSelectedJob(job_id: string) {
        // Implementation needed
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            {/* Header Section - Fixed */}
            <div className="flex-shrink-0 p-6 lg:p-8 border-b border-gray-100">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44] mb-2">
                    {getGreeting()}, {recruiter?.name || company?.name}
                </h1>
                <p className="text-gray-600">Here's what's happening with your apprenticeships today</p>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
                {/* Stats Cards */}
                <div className="p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {/* Posted Jobs Card */}
                    <div className="bg-gradient-to-br from-[#14B8A6]/5 to-[#14B8A6]/10 border-2 border-[#14B8A6]/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#14B8A6]/10 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-[#14B8A6] rounded-xl p-3">
                                <Briefcase className="text-white" size={24} />
                            </div>
                            <TrendingUp className="text-[#14B8A6]" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-[#0A1F44] mb-1">{jobs.length}</div>
                        <div className="text-sm text-gray-600 font-medium">Active Apprenticeships</div>
                    </div>

                    {/* Applications Card */}
                    <div className="bg-gradient-to-br from-[#0A1F44]/5 to-[#0A1F44]/10 border-2 border-[#0A1F44]/20 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#0A1F44]/10 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-[#0A1F44] rounded-xl p-3">
                                <FileText className="text-white" size={24} />
                            </div>
                            <Users className="text-[#0A1F44]" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-[#0A1F44] mb-1">{applications?.length || 0}</div>
                        <div className="text-sm text-gray-600 font-medium">Total Applications</div>
                    </div>
                </div>

                {/* Quick Action - Post Apprenticeship */}
                <div className="mt-6">
                    <button
                        onClick={() => router.push('/recruiter/post-a-job')}
                        className="w-full flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white py-4 px-6 rounded-xl font-semibold transition-colors shadow-lg shadow-[#14B8A6]/30"
                    >
                        <Plus size={20} />
                        Post New Apprenticeship
                    </button>
                </div>
            </div>

            {/* Recent Apprenticeships Section */}
            <div className="px-6 lg:px-8 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-[#0A1F44]">Recent Apprenticeships</h2>
                    {jobs.length > 0 && (
                        <button
                            onClick={() => router.push('/recruiter/listings')}
                            className="text-[#14B8A6] hover:text-[#0D9488] font-medium text-sm flex items-center gap-1 transition-colors"
                        >
                            View All
                            <ArrowRight size={16} />
                        </button>
                    )}
                </div>

                {jobs.length > 0 ? (
                    <>
                        {/* Mobile View - Cards */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {jobs.slice(0, 4).map((job: any) => (
                                <div
                                    key={job.uid}
                                    onClick={() => handleJobClick(job.uid)}
                                    className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-[#14B8A6] hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <h3 className="font-semibold text-[#0A1F44] mb-2">{job.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                        <MapPin size={14} className="text-[#14B8A6]" />
                                        {job.location}
                                    </div>
                                    <button className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View - Table */}
                        <div className="hidden lg:block">
                            <JobsTable
                                ApplicationsForSelectedJob={ApplicationsForSelectedJob}
                                delete={handleDeleteJob}
                                jobs={jobs}
                            />
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center">
                        <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Briefcase className="text-[#14B8A6]" size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-[#0A1F44] mb-2">
                            No Apprenticeships Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start by posting your first apprenticeship opportunity
                        </p>
                        <button
                            onClick={() => router.push('/recruiter/post-a-job')}
                            className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white py-3 px-6 rounded-xl font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                        >
                            <Plus size={18} />
                            Post Apprenticeship
                        </button>
                    </div>
                )}
            </div>
            </div>
        </div>
    )
}

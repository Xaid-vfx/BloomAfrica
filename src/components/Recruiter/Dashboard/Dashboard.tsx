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
    ArrowRight,
    Lock,
    Clock,
    CheckCircle2,
    CreditCard,
    AlertCircle,
    XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import FAB from "@/components/Recruiter/FAB/FAB"
import { SwipeableJobCard } from "@/components/Recruiter/SwipeableCard/SwipeableCard"
import { usePullToRefresh } from "@/hooks/useSwipeGesture"
import { toast } from "sonner"
import PendingPaymentBanner from "@/components/Recruiter/PendingPaymentBanner/PendingPaymentBanner"
import { useRecruiter } from "@/context/RecruiterContext"

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
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();
    const { hasActiveSubscription, subscriptionStatus, accountStatus, isAccountApproved, canPostApprenticeships, subscription } = useRecruiter();

    // Check if features are locked - need both payment AND approval to post
    const isLocked = !canPostApprenticeships;

    // Handle payment from subscription card
    const handlePayNow = async () => {
        setIsPaymentProcessing(true);
        try {
            // Mock payment flow (Paystack has bugs - frontend only for now)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update subscription status
            try {
                await supabase
                    .from('TrainerSubscriptions')
                    .update({
                        status: 'active',
                        paid_at: new Date().toISOString(),
                        payment_reference: `mock_${Date.now()}`,
                        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    })
                    .eq('user_id', user.id);
            } catch (error) {
                // Update localStorage for local mode
                const subscriptionData = localStorage.getItem(`trainer_subscription_${user.id}`);
                if (subscriptionData) {
                    const data = JSON.parse(subscriptionData);
                    data.status = 'active';
                    data.paid_at = new Date().toISOString();
                    data.payment_reference = `mock_${Date.now()}`;
                    localStorage.setItem(`trainer_subscription_${user.id}`, JSON.stringify(data));
                }
            }

            toast.success('Payment successful! Your subscription is now active.');
            router.refresh();
        } catch (error) {
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsPaymentProcessing(false);
        }
    };

    const fetchJobs = async () => {
        const { data, error } = await supabase
            .from('Jobs')
            .select()
            .eq('recruiter', user.id);

        if (data) {
            setJobs(data as Job[]);
            return data as Job[];
        }
        return [];
    };

    const fetchApplications = async (jobs: Job[]) => {
        const jobIds = jobs.map(job => job.uid);
        const { data: application, error } = await supabase
            .from('Applications')
            .select()
            .in('job', jobIds);

        if (application) {
            setApplications(application as Application[]);
        }
    };

    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            const fetchedJobs = await fetchJobs();
            if (fetchedJobs.length > 0) {
                await fetchApplications(fetchedJobs);
            }
            toast.success('Dashboard refreshed!');
        } catch (error) {
            toast.error('Failed to refresh dashboard');
        } finally {
            setIsRefreshing(false);
        }
    };

    const pullToRefreshRef = usePullToRefresh(refreshData);

    useEffect(() => {
        fetchJobs().then((fetchedJobs) => {
            if (fetchedJobs.length > 0) {
                fetchApplications(fetchedJobs);
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
            toast.success('Apprenticeship deleted');
        } else {
            toast.error('Failed to delete apprenticeship');
        }
    }

    async function handleArchiveJob(id: string) {
        // For now, we'll just show a toast. You can implement actual archive logic later
        toast.success('Apprenticeship archived');
        // TODO: Implement archive functionality in database
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
        <div className='relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden'>
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
            <div ref={pullToRefreshRef} className="flex-1 overflow-y-auto">
                {/* Pending Payment Banner */}
                <div className="px-6 lg:px-8 pt-6">
                    <PendingPaymentBanner />
                </div>

                {/* Account Status Cards */}
                <div className="px-6 lg:px-8 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Account Status Card */}
                        <div className={`rounded-2xl p-4 border-2 ${
                            accountStatus === 'approved'
                                ? 'bg-green-50 border-green-200'
                                : accountStatus === 'rejected'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-amber-50 border-amber-200'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                    accountStatus === 'approved'
                                        ? 'bg-green-100'
                                        : accountStatus === 'rejected'
                                        ? 'bg-red-100'
                                        : 'bg-amber-100'
                                }`}>
                                    {accountStatus === 'approved' ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    ) : accountStatus === 'rejected' ? (
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-amber-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Status</p>
                                    <p className={`font-semibold ${
                                        accountStatus === 'approved'
                                            ? 'text-green-700'
                                            : accountStatus === 'rejected'
                                            ? 'text-red-700'
                                            : 'text-amber-700'
                                    }`}>
                                        {accountStatus === 'approved'
                                            ? 'Approved'
                                            : accountStatus === 'rejected'
                                            ? 'Rejected'
                                            : 'In Review'}
                                    </p>
                                </div>
                            </div>
                            {accountStatus === 'pending_review' && (
                                <p className="text-xs text-amber-600 mt-2">
                                    Your profile is being reviewed by our team
                                </p>
                            )}
                        </div>

                        {/* Subscription Status Card */}
                        <div className={`rounded-2xl p-4 border-2 ${
                            hasActiveSubscription
                                ? 'bg-green-50 border-green-200'
                                : 'bg-amber-50 border-amber-200'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        hasActiveSubscription ? 'bg-green-100' : 'bg-amber-100'
                                    }`}>
                                        <CreditCard className={`h-5 w-5 ${
                                            hasActiveSubscription ? 'text-green-600' : 'text-amber-600'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subscription</p>
                                        <p className={`font-semibold ${
                                            hasActiveSubscription ? 'text-green-700' : 'text-amber-700'
                                        }`}>
                                            {hasActiveSubscription ? 'Active' : 'Pending Payment'}
                                        </p>
                                    </div>
                                </div>
                                {!hasActiveSubscription && (
                                    <button
                                        onClick={handlePayNow}
                                        disabled={isPaymentProcessing}
                                        className="bg-[#14B8A6] hover:bg-[#0D9488] disabled:bg-gray-300 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {isPaymentProcessing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                                                Processing...
                                            </>
                                        ) : (
                                            'Pay Now'
                                        )}
                                    </button>
                                )}
                            </div>
                            {!hasActiveSubscription && subscription && (
                                <p className="text-xs text-amber-600 mt-2">
                                    Amount due: ₦{subscription.total_amount?.toLocaleString()}/mo
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="p-6 lg:p-8 pt-4">
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
                <div className="mt-6 relative group">
                    <button
                        onClick={() => {
                            if (isLocked) {
                                if (!hasActiveSubscription) {
                                    toast.error('Complete your subscription payment to unlock this feature')
                                } else if (!isAccountApproved) {
                                    toast.error('Your account is still under review')
                                }
                                return
                            }
                            router.push('/recruiter/post-a-job')
                        }}
                        disabled={isLocked}
                        className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-colors ${
                            isLocked
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-lg shadow-[#14B8A6]/30'
                        }`}
                    >
                        {isLocked ? <Lock size={20} /> : <Plus size={20} />}
                        Post New Apprenticeship
                    </button>
                    {isLocked && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {!hasActiveSubscription ? 'Complete payment to unlock' : 'Account under review'}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    )}
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
                        {/* Mobile View - Swipeable Cards */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {jobs.slice(0, 4).map((job: any) => (
                                <SwipeableJobCard
                                    key={job.uid}
                                    onDelete={() => handleDeleteJob(job.uid)}
                                    onArchive={() => handleArchiveJob(job.uid)}
                                >
                                    <div
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
                                </SwipeableJobCard>
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
                            onClick={() => {
                                if (isLocked) {
                                    if (!hasActiveSubscription) {
                                        toast.error('Complete your subscription payment to unlock this feature')
                                    } else if (!isAccountApproved) {
                                        toast.error('Your account is still under review')
                                    }
                                    return
                                }
                                router.push('/recruiter/post-a-job')
                            }}
                            disabled={isLocked}
                            className={`inline-flex items-center gap-2 py-3 px-6 rounded-xl font-medium transition-colors ${
                                isLocked
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#14B8A6] hover:bg-[#0D9488] text-white shadow-lg shadow-[#14B8A6]/30'
                            }`}
                        >
                            {isLocked ? <Lock size={18} /> : <Plus size={18} />}
                            Post Apprenticeship
                        </button>
                    </div>
                )}
            </div>
            </div>

            {/* Floating Action Button - Mobile Only */}
            <FAB
                icon={isLocked ? <Lock size={24} /> : <Plus size={24} />}
                onClick={() => {
                    if (isLocked) {
                        if (!hasActiveSubscription) {
                            toast.error('Complete your subscription payment to unlock this feature')
                        } else if (!isAccountApproved) {
                            toast.error('Your account is still under review')
                        }
                        return
                    }
                    router.push('/recruiter/post-a-job')
                }}
                variant={isLocked ? "secondary" : "accent"}
            />
        </div>
    )
}

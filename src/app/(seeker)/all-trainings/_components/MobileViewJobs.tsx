'use client'
import MobileCard from "@/components/Jobs/MobileCard/MobileCard"
import GetStarted from "@/components/GetStartedBanner/GetStarted"
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { MoonLoader } from "react-spinners";
import FilterDropdown from "@/components/Jobs/FilterDropdown/FilterDropdown";
import { JobDetailModal } from "@/components/Modal/JobDetailModal";
import MobileViewToggle, { MobileViewMode } from "@/components/Jobs/ViewToggle/MobileViewToggle";
import MobileGridCard from "@/components/Jobs/MobileGridCard/MobileGridCard";

type JobProps = {
    uid: string;
    title: string;
    type: string;
    location: string;
    salary: string;
    description: string;
    responsibilities: string;
    who_you_are: string;
    extras: string;
    category: string;
    company_name?: string;
    provides_certificate?: boolean;
    training_mode?: string;
    isVerified?: boolean;
    logo?: string;
    deadline?: string;
    start_date?: string;
    apprenticeship_level?: string;
    duration?: string;
    signup_fee?: number;
    Recruiters?: {
        CompanyInfo?: {
            name: string;
            logo: string;
        }
    }
}

// Helper component for mobile card content (without link wrapper)
function MobileCardContent({ job }: { job: JobProps }) {
    const companyName = job.Recruiters?.CompanyInfo?.name || job.company_name || "Unknown"
    const companyLogo = job.Recruiters?.CompanyInfo?.logo || job.logo
    const fee = job.signup_fee && job.signup_fee > 0
        ? `₦${Number(job.signup_fee).toLocaleString('en-NG')}`
        : "Free"

    const formatDate = (dateString?: string) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <div className="flex flex-col border border-gray-200 rounded-xl mx-auto w-full bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Header: Logo + Company */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                    {companyLogo ? (
                        <img
                            src={companyLogo}
                            alt={companyName}
                            className="object-contain w-full h-full"
                        />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                            <circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{companyName}</p>
                    {job.isVerified && (
                        <span className="text-xs text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
                                <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Job Title & Location */}
            <div className="px-4 pt-4 pb-3">
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                    {job.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span className="truncate">{job.location}</span>
                    </div>
                    {job.training_mode && (
                        <>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <rect width="20" height="14" x="2" y="3" rx="2"/>
                                    <line x1="8" x2="16" y1="21" y2="21"/>
                                    <line x1="12" x2="12" y1="17" y2="21"/>
                                </svg>
                                <span>{job.training_mode}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Description Preview */}
            <div className="px-4 pb-3">
                <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                </p>
            </div>

            {/* Badges Row */}
            <div className="px-4 pb-3">
                <div className="flex gap-1.5 flex-wrap">
                    <span className="rounded-md text-xs px-2 py-1 bg-green-100 text-green-800 font-medium">
                        {job.type}
                    </span>
                    <span className="rounded-md text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium">
                        {job.category}
                    </span>
                    {job.apprenticeship_level && (
                        <span className="rounded-md text-xs px-2 py-1 border border-[#0A1F44]/30 bg-[#0A1F44]/10 text-[#0A1F44] font-medium flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                            {job.apprenticeship_level}
                        </span>
                    )}
                    {job.provides_certificate && (
                        <span className="rounded-md text-xs px-2 py-1 border border-[#14B8A6]/30 bg-[#14B8A6]/10 text-[#14B8A6] font-medium flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="6"/>
                                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                            </svg>
                            Certificate
                        </span>
                    )}
                </div>
            </div>

            {/* Dates Row */}
            {(job.deadline || job.start_date) && (
                <div className="px-4 pb-3">
                    <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
                        {job.deadline && (
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                                    <line x1="16" x2="16" y1="2" y2="6"/>
                                    <line x1="8" x2="8" y1="2" y2="6"/>
                                    <line x1="3" x2="21" y1="10" y2="10"/>
                                </svg>
                                <span className="text-gray-500">Apply by:</span>
                                <span className="font-medium text-gray-700">{formatDate(job.deadline)}</span>
                            </div>
                        )}
                        {job.start_date && (
                            <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14B8A6]">
                                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                                    <line x1="16" x2="16" y1="2" y2="6"/>
                                    <line x1="8" x2="8" y1="2" y2="6"/>
                                    <line x1="3" x2="21" y1="10" y2="10"/>
                                </svg>
                                <span className="text-gray-500">Starts:</span>
                                <span className="font-medium text-gray-700">{formatDate(job.start_date)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Footer: Fee & Duration */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#14B8A6]">
                            <line x1="12" x2="12" y1="2" y2="22"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        <span className={`text-sm font-semibold ${fee === "Free" ? "text-[#14B8A6]" : "text-gray-900"}`}>
                            {fee}
                        </span>
                    </div>
                    {job.duration && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span>{job.duration}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

async function getJobs(page: number = 1, pageSize: number = 8, track: 'artisan' | 'company' = 'artisan') {
    const supabase = createClientComponentClient()

    // Determine which trainer category to filter by
    const trainerCategory = track === 'artisan'
        ? 'Individual/Artisan/Small Business'
        : 'Company'

    // Get trainer user IDs for the selected track
    const { data: trainers } = await supabase
        .from('TrainerProfiles')
        .select('user_id')
        .eq('trainer_category', trainerCategory)
        .eq('is_completed', true)

    const trainerUserIds = trainers?.map(t => t.user_id) || []

    let allJobs;
    let count;

    // If trainers found for this track, filter jobs by them
    if (trainerUserIds.length > 0) {
        const { data, error, count: jobCount } = await supabase
            .from('Jobs')
            .select(`*,
            Recruiters(
                CompanyInfo(
                    name,
                    logo
                )
            )`, { count: 'exact' })
            .in('recruiter', trainerUserIds)
            .order('isVerified', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error);
            return { data: [], count: 0 };
        }
        allJobs = data;
        count = jobCount;
    } else if (track === 'artisan') {
        // Fallback for artisan: Show all jobs if no trainers have completed onboarding yet
        const { data, error, count: jobCount } = await supabase
            .from('Jobs')
            .select(`*,
            Recruiters(
                CompanyInfo(
                    name,
                    logo
                )
            )`, { count: 'exact' })
            .order('isVerified', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })

        if (error) {
            console.error(error);
            return { data: [], count: 0 };
        }
        allJobs = data;
        count = jobCount;
    } else {
        // No company trainers yet, return empty
        return { data: [], count: 0 };
    }

    // Then manually handle pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginatedData = allJobs?.slice(from, to) || [];

    return { data: paginatedData, count };
}

export default function MobileViewJobs(props: any) {
    const [jobs, setjobs] = useState<JobProps[]>([])
    const [totalJobs, setTotalJobs] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedModes, setSelectedModes] = useState<string[]>([]);
    const [certificateOnly, setCertificateOnly] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<MobileViewMode>('list')
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 8; // 8 jobs per page for mobile view
    const isCompanyTrack = props.track === 'company'

    const handleJobClick = (jobId: string) => {
        setSelectedJobId(jobId);
        setIsModalOpen(true);
    }


    const handleCategoryChange = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(cat => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleTypeChange = (type: string) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleModeChange = (mode: string) => {
        if (selectedModes.includes(mode)) {
            setSelectedModes(selectedModes.filter(m => m !== mode));
        } else {
            setSelectedModes([...selectedModes, mode]);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        const track = props.track || 'artisan'
        getJobs(currentPage, pageSize, track).then(({ data, count }) => {
            const renderJobs = data?.filter(job => {
                // Check if the title includes the search query (case-insensitive)
                const titleMatch = job.title.toLowerCase().includes(props.search?.toLowerCase());

                // Check if the location includes the location query (case-insensitive)
                const locationMatch = job.location.toLowerCase().includes(props.location?.toLowerCase());
                const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(job.category);
                const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(job.type);
                const modeMatch = selectedModes.length === 0 || selectedModes.includes(job.training_mode || '');
                const certificateMatch = !certificateOnly || job.provides_certificate === true;
                const verifiedMatch = !verifiedOnly || job.isVerified === true;

                // Return true if all conditions are met
                return titleMatch && locationMatch && categoryMatch && typeMatch && modeMatch && certificateMatch && verifiedMatch;
            });
            setjobs(renderJobs || []); // Provide empty array as fallback
            setTotalJobs(count || 0)
            setIsLoading(false);
        })
    }, [props.location, props.search, props.track, selectedCategories, selectedTypes, selectedModes, certificateOnly, verifiedOnly, currentPage])

    const totalPages = Math.ceil(totalJobs / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className=" pb-10 flex flex-col px-4 lg:hidden w-full mx-auto justify-center max-w-[700px]">
            <div className="justify-center">
                {/* Filter Pills */}
                <div className="mb-6 pb-2 flex justify-center">
                    <FilterDropdown
                        selectedTypes={selectedTypes}
                        selectedCategories={selectedCategories}
                        selectedModes={selectedModes}
                        certificateOnly={certificateOnly}
                        verifiedOnly={verifiedOnly}
                        onTypeChange={handleTypeChange}
                        onCategoryChange={handleCategoryChange}
                        onModeChange={handleModeChange}
                        onCertificateChange={setCertificateOnly}
                        onVerifiedChange={setVerifiedOnly}
                    />
                </div>

                {/* Results count and View Toggle */}
                <div className="flex items-center justify-between my-3">
                    <p className="font-light text-sm text-[#7C8493]">
                        Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalJobs)} of {totalJobs}
                    </p>
                    <MobileViewToggle currentView={viewMode} onViewChange={setViewMode} />
                </div>

                {/* Cards - List View */}
                {viewMode === 'list' && (
                    <div className="flex flex-col gap-4 lg:hidden w-full">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-[250px]">
                                <MoonLoader color="#0A1F44" />
                            </div>
                        ) : jobs && jobs.length > 0 ? jobs.map((job) => (
                            <div
                                key={job.uid}
                                onClick={() => handleJobClick(job.uid)}
                                className="cursor-pointer"
                            >
                                <MobileCardContent job={job} />
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                                        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                                        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                                        <path d="M10 6h4"/>
                                        <path d="M10 10h4"/>
                                        <path d="M10 14h4"/>
                                        <path d="M10 18h4"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Listings Yet</h3>
                                <p className="text-sm text-gray-500 px-4">
                                    There are no programs available at the moment. Check back soon!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Cards - Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-2 gap-3 lg:hidden w-full">
                        {isLoading ? (
                            <div className="col-span-2 flex justify-center items-center h-[250px]">
                                <MoonLoader color="#0A1F44" />
                            </div>
                        ) : jobs && jobs.length > 0 ? jobs.map((job) => (
                            <MobileGridCard
                                key={job.uid}
                                job={job}
                                onClick={() => handleJobClick(job.uid)}
                            />
                        )) : (
                            <div className="col-span-2 flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                                        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                                        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                                        <path d="M10 6h4"/>
                                        <path d="M10 10h4"/>
                                        <path d="M10 14h4"/>
                                        <path d="M10 18h4"/>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Listings Yet</h3>
                                <p className="text-sm text-gray-500 px-4">
                                    There are no programs available at the moment. Check back soon!
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Job Detail Modal */}
                <JobDetailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    jobId={selectedJobId}
                    user={props.user}
                />

                {/* Mobile Pagination Controls */}
                <div className="flex justify-center gap-2 mt-6 mb-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 text-sm rounded-lg border ${
                            currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                        }`}
                    >
                        Prev
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage <= 2) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 1) {
                                pageNum = totalPages - 2 + i;
                            } else {
                                pageNum = currentPage - 1 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                                        currentPage === pageNum
                                            ? 'bg-[#0A1F44] text-white'
                                            : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1.5 text-sm rounded-lg border ${
                            currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            <div className="px-4 lg:hidden"><GetStarted /></div>
        </div>
    )
}
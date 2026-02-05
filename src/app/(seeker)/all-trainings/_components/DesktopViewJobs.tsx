'use client'
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar"
import JobCard from "@/components/Jobs/JobCard/JobCard"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState, useRef } from "react"
import { MoonLoader, SyncLoader } from "react-spinners"
import { useRouter, useSearchParams } from 'next/navigation'
import CompactJobListItem from '@/components/Jobs/CompactJobListItem/CompactJobListItem'
import JobDetailPanel from '@/components/Jobs/JobDetailPanel/JobDetailPanel'
import FilterDropdown from '@/components/Jobs/FilterDropdown/FilterDropdown'
import CompanyGridCard from '@/components/Jobs/CompanyGridCard/CompanyGridCard'
import JobListCard from '@/components/Jobs/JobListCard/JobListCard'
import { JobDetailModal } from '@/components/Modal/JobDetailModal'
import ViewToggle, { ViewMode } from '@/components/Jobs/ViewToggle/ViewToggle'

type JobProps = {
    uid: string;
    handleClick: any;
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

async function getJobs(page: number = 1, pageSize: number = 15, track: 'artisan' | 'company' = 'artisan') {
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

export default function DesktopViewJobs(props: any) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const urlSelectedId = searchParams.get('selected')

    const [jobs, setjobs] = useState<JobProps[]>([])
    const [totalJobs, setTotalJobs] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedModes, setSelectedModes] = useState<string[]>([]);
    const [certificateOnly, setCertificateOnly] = useState(false);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(urlSelectedId)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        // Default view: split for artisan, grid for company
        return props.track === 'company' ? 'grid' : 'split'
    })
    const pageSize = 15; // 15 jobs per page for desktop view
    const isCompanyTrack = props.track === 'company'

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

    const handleJobSelect = (jobId: string) => {
        setSelectedJobId(jobId)
        if (viewMode === 'split') {
            // Split view: update URL and show in side panel
            const track = props.track || 'artisan'
            router.push(`/all-trainings?track=${track}&selected=${jobId}`, { scroll: false } as any)
        } else {
            // Grid or List view: open modal
            setIsModalOpen(true)
        }
    }

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

    // Sync selectedJobId with URL parameter
    useEffect(() => {
        if (urlSelectedId) {
            setSelectedJobId(urlSelectedId)
        }
    }, [urlSelectedId])

    // Auto-select first job if none selected (only for split view)
    useEffect(() => {
        if (viewMode === 'split' && !selectedJobId && jobs.length > 0) {
            const track = props.track || 'artisan'
            const firstJobId = jobs[0].uid
            setSelectedJobId(firstJobId)
            router.push(`/all-trainings?track=${track}&selected=${firstJobId}`, { scroll: false } as any)
        }
    }, [selectedJobId, router, jobs, props.track, viewMode])

    // Reset view mode when track changes
    useEffect(() => {
        setViewMode(isCompanyTrack ? 'grid' : 'split')
    }, [isCompanyTrack])

    const totalPages = Math.ceil(totalJobs / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedJobId(null); // Clear selection - first job will auto-select
    };

    return (
        <div className="hidden lg:block w-full ms-auto me-auto max-w-[1500px]">
            {/* Filter Pills */}
            <div className="px-10 flex justify-center">
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
            <div className="px-10 py-4 flex items-center justify-between">
                <p>Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalJobs)} of {totalJobs} results</p>
                <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
            </div>

            {/* Render based on view mode */}
            {viewMode === 'grid' && (
                /* Grid Layout */
                <div className="px-5 pb-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[250px]">
                            <MoonLoader color="#0A1F44" />
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                            {jobs.map((job: JobProps) => (
                                <CompanyGridCard
                                    key={job.uid}
                                    job={job}
                                    onClick={() => handleJobSelect(job.uid)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                                    <path d="M10 6h4"/>
                                    <path d="M10 10h4"/>
                                    <path d="M10 14h4"/>
                                    <path d="M10 18h4"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listings Yet</h3>
                            <p className="text-gray-500 max-w-md">
                                There are no apprenticeship programs available at the moment. Check back soon!
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {jobs.length > 0 && (
                        <div className="flex justify-center gap-2 mt-8 mb-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg border ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                }`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentPage === page
                                            ? 'bg-[#0A1F44] text-white'
                                            : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg border ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'list' && (
                /* List Layout */
                <div className="px-5 pb-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[250px]">
                            <MoonLoader color="#0A1F44" />
                        </div>
                    ) : jobs.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {jobs.map((job: JobProps) => (
                                <JobListCard
                                    key={job.uid}
                                    job={job}
                                    onClick={() => handleJobSelect(job.uid)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                                    <path d="M10 6h4"/>
                                    <path d="M10 10h4"/>
                                    <path d="M10 14h4"/>
                                    <path d="M10 18h4"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listings Yet</h3>
                            <p className="text-gray-500 max-w-md">
                                There are no apprenticeship programs available at the moment. Check back soon!
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {jobs.length > 0 && (
                        <div className="flex justify-center gap-2 mt-8 mb-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 py-2 rounded-lg border ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                }`}
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentPage === page
                                            ? 'bg-[#0A1F44] text-white'
                                            : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`px-4 py-2 rounded-lg border ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'split' && (
                /* Split Layout - Job List (40%) + Detail Panel (60%) */
                <div className="flex gap-5 px-5">
                    {/* Left: Job List */}
                    <div className="w-[40%] pr-2">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-[250px]">
                                <MoonLoader color="#0A1F44" />
                            </div>
                        ) : jobs.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {jobs.map((job: JobProps) => (
                                    <CompactJobListItem
                                        key={job.uid}
                                        job={job}
                                        isSelected={selectedJobId === job.uid}
                                        onClick={() => handleJobSelect(job.uid)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
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
                                <p className="text-sm text-gray-500">Check back soon!</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {jobs.length > 0 && (
                            <div className="flex justify-center gap-2 mt-8 mb-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                    }`}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-lg border ${
                                            currentPage === page
                                                ? 'bg-[#0A1F44] text-white'
                                                : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg border ${
                                        currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-[#0A1F44] hover:bg-gray-50'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Detail Panel */}
                    <div className="w-[60%] border-l pl-5 h-screen sticky top-0 overflow-y-auto">
                        {selectedJobId ? (
                            <JobDetailPanel jobId={selectedJobId} user={props.user} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <p>Select a job to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Job Detail Modal for Grid and List views */}
            <JobDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                jobId={selectedJobId}
                user={props.user}
            />
        </div>
    )
}
'use client'
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar"
import JobCard from "@/components/Jobs/JobCard/JobCard"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState, useRef } from "react"
import { MoonLoader, SyncLoader } from "react-spinners"
import HowTo from "../welcome/howto"
import { useRouter, useSearchParams } from 'next/navigation'
import CompactJobListItem from '@/components/Jobs/CompactJobListItem/CompactJobListItem'
import JobDetailPanel from '@/components/Jobs/JobDetailPanel/JobDetailPanel'
import FilterDropdown from '@/components/Jobs/FilterDropdown/FilterDropdown'

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
}

async function getJobs(page: number = 1, pageSize: number = 15) {
    const supabase = createClientComponentClient()

    // First get all jobs to sort them properly
    const { data: allJobs, error: allJobsError, count } = await supabase
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

    if (allJobsError) {
        console.error(allJobsError);
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
    const [selectedJobId, setSelectedJobId] = useState<string | null>(urlSelectedId)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const arr = ["Software", "Electronics", "Design"]
    const pageSize = 15; // 15 jobs per page for desktop view

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

    const handleJobSelect = (jobId: string) => {
        setSelectedJobId(jobId)
        router.push(`/all-trainings?selected=${jobId}`, { scroll: false } as any)
    }

    useEffect(() => {
        getJobs(currentPage, pageSize).then(({ data, count }) => {
            const renderJobs = data?.filter(job => {
                // Check if the title includes the search query (case-insensitive)
                const titleMatch = job.title.toLowerCase().includes(props.search?.toLowerCase());

                // Check if the location includes the location query (case-insensitive)
                const locationMatch = job.location.toLowerCase().includes(props.location?.toLowerCase());
                const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(job.category);

                const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(job.type);

                // Return true if both conditions are met
                return titleMatch && locationMatch && categoryMatch && typeMatch;
            });
            setjobs(renderJobs || []); // Provide empty array as fallback
            setTotalJobs(count || 0)
        })
    }, [props.location, props.search, selectedCategories, selectedTypes, currentPage])

    // Sync selectedJobId with URL parameter
    useEffect(() => {
        if (urlSelectedId) {
            setSelectedJobId(urlSelectedId)
        }
    }, [urlSelectedId])

    // Auto-select first job when jobs load
    useEffect(() => {
        if (jobs.length > 0 && !selectedJobId) {
            const firstJobId = jobs[0].uid
            setSelectedJobId(firstJobId)
            router.push(`/all-trainings?selected=${firstJobId}`, { scroll: false } as any)
        }
    }, [jobs, selectedJobId, router])

    const totalPages = Math.ceil(totalJobs / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSelectedJobId(null); // Clear selection - first job will auto-select
    };

    return (
        <div className="hidden lg:block w-full border-t ms-auto me-auto max-w-[1500px]">
            {/* Filter Dropdown at Top */}
            <div className="px-10 pt-10">
                <FilterDropdown
                    isOpen={isFilterOpen}
                    onToggle={() => setIsFilterOpen(!isFilterOpen)}
                    selectedTypes={selectedTypes}
                    selectedCategories={selectedCategories}
                    onTypeChange={handleTypeChange}
                    onCategoryChange={handleCategoryChange}
                />
            </div>

            {/* Results count */}
            <div className="px-10 py-4">
                <p>Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalJobs)} of {totalJobs} results</p>
            </div>

            {/* Split Layout: Job List (40%) + Detail Panel (60%) */}
            <div className="flex gap-5 px-5">
                {/* Left: Job List */}
                <div className="w-[40%] pr-2">
                    <HowTo />
                    <div className="flex flex-col gap-2 mt-4">
                        {jobs ? jobs.map((job: JobProps) => (
                            <CompactJobListItem
                                key={job.uid}
                                job={job}
                                isSelected={selectedJobId === job.uid}
                                onClick={() => handleJobSelect(job.uid)}
                            />
                        )) : (
                            <div className="flex justify-center items-center h-[250px]">
                                <MoonLoader color="#14B8A6" />
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2 mt-8 mb-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg border ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-[#14B8A6] hover:bg-gray-50'
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
                                        ? 'bg-[#14B8A6] text-white'
                                        : 'bg-white text-[#14B8A6] hover:bg-gray-50'
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
                                    : 'bg-white text-[#14B8A6] hover:bg-gray-50'
                            }`}
                        >
                            Next
                        </button>
                    </div>
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
        </div>
    )
}
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

    const handleHowToSelect = () => {
        setSelectedJobId('howto')
        router.push(`/all-trainings?selected=howto`, { scroll: false } as any)
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

    // Auto-select HowTo on page 1, or first job on other pages
    useEffect(() => {
        if (!selectedJobId) {
            if (currentPage === 1) {
                setSelectedJobId('howto')
                router.push(`/all-trainings?selected=howto`, { scroll: false } as any)
            } else if (jobs.length > 0) {
                const firstJobId = jobs[0].uid
                setSelectedJobId(firstJobId)
                router.push(`/all-trainings?selected=${firstJobId}`, { scroll: false } as any)
            }
        }
    }, [selectedJobId, router, currentPage, jobs])

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
                    {currentPage === 1 && <HowTo onClick={handleHowToSelect} isSelected={selectedJobId === 'howto'} />}
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
                                <MoonLoader color="#0A1F44" />
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
                </div>

                {/* Right: Detail Panel */}
                <div className="w-[60%] border-l pl-5 h-screen sticky top-0 overflow-y-auto">
                    {selectedJobId === 'howto' ? (
                        <div className="p-8">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <h1 className="text-3xl font-bold text-[#0A1F44]">How to Use Prentis</h1>
                                    <span className="text-sm text-[#14B8A6] bg-[#14B8A6]/15 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 0L9.86593 1.86593L12.364 1.13407L13.0959 3.63204L15.5939 4.36391L14.862 6.86187L16.728 8.72781L14.862 10.5937L15.5939 13.0917L13.0959 13.8236L12.364 16.3215L9.86593 15.5897L8 17.4556L6.13407 15.5897L3.63611 16.3215L2.90424 13.8236L0.40628 13.0917L1.13815 10.5937L-0.727783 8.72781L1.13815 6.86187L0.40628 4.36391L2.90424 3.63204L3.63611 1.13407L6.13407 1.86593L8 0Z" fill="#14B8A6"/>
                                            <path d="M11.0625 6.125L7.0625 10.125L5 8.0625" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Welcome Guide
                                    </span>
                                </div>
                                <p className="text-lg text-[#515B6F]">Get a guaranteed certificate and hands-on support to launch your own business after training.</p>
                            </div>

                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="text-green-800 font-bold">1</span>
                                        </div>
                                        <h2 className="text-xl font-semibold text-[#0A1F44]">Getting Started</h2>
                                    </div>
                                    <div className="ml-10 space-y-3 text-[#515B6F]">
                                        <p>Welcome to Prentis! Here's how to begin your journey:</p>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>Browse through available apprenticeships in various fields</li>
                                            <li>Click on any training to view detailed information</li>
                                            <li>Review the requirements, duration, and certification details</li>
                                            <li>Apply directly to apprenticeships that match your interests</li>
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                                            <span className="text-[#14B8A6] font-bold">2</span>
                                        </div>
                                        <h2 className="text-xl font-semibold text-[#0A1F44]">Quick Tips</h2>
                                    </div>
                                    <div className="ml-10 space-y-3 text-[#515B6F]">
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>Use the filter options at the top to narrow down apprenticeships by category and type</li>
                                            <li>Look for verified apprenticeships marked with a checkmark</li>
                                            <li>Pay attention to the training mode (on-site, remote, or hybrid)</li>
                                            <li>Check if the apprenticeship provides a certificate upon completion</li>
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                                            <span className="text-[#14B8A6] font-bold">3</span>
                                        </div>
                                        <h2 className="text-xl font-semibold text-[#0A1F44]">Certificates</h2>
                                    </div>
                                    <div className="ml-10 space-y-3 text-[#515B6F]">
                                        <p>Upon successful completion of your apprenticeship:</p>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>Receive a recognized certificate to validate your skills</li>
                                            <li>Boost your resume with industry-relevant credentials</li>
                                            <li>Demonstrate your practical experience to potential employers</li>
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 flex items-center justify-center">
                                            <span className="text-[#14B8A6] font-bold">4</span>
                                        </div>
                                        <h2 className="text-xl font-semibold text-[#0A1F44]">Apprentice Guide</h2>
                                    </div>
                                    <div className="ml-10 space-y-3 text-[#515B6F]">
                                        <p>As an apprentice, you'll benefit from:</p>
                                        <ul className="list-disc pl-5 space-y-2">
                                            <li>Hands-on training in real-world environments</li>
                                            <li>Mentorship from experienced professionals</li>
                                            <li>Support to launch your own business after training</li>
                                            <li>Networking opportunities with industry experts</li>
                                        </ul>
                                    </div>
                                </section>

                                <div className="mt-8 p-6 bg-gradient-to-br from-[#14B8A6]/5 to-white border-2 border-[#14B8A6]/30 rounded-xl">
                                    <h3 className="text-lg font-semibold text-[#0A1F44] mb-2">Ready to start?</h3>
                                    <p className="text-[#515B6F] mb-4">Explore the apprenticeships below and take the first step towards your future career!</p>
                                </div>
                            </div>
                        </div>
                    ) : selectedJobId ? (
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
'use client'
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar"
import JobCard from "@/components/Jobs/JobCard/JobCard"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { MoonLoader, SyncLoader } from "react-spinners"
import HowTo from "../welcome/howto"

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

async function getJobs(page: number = 1, pageSize: number = 9) {
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
    const [jobs, setjobs] = useState<JobProps[]>([])
    const [totalJobs, setTotalJobs] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const arr = ["Software", "Electronics", "Design"]
    const pageSize = 9; // 9 jobs per page for desktop view

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

    const totalPages = Math.ceil(totalJobs / pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="hidden lg:block w-full border-t  ms-auto me-auto max-w-[1500px]">
            <div className="flex justify-between py-10 px-10 font-medium">
                <p>Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalJobs)} of {totalJobs} results</p>
                <div className="flex text-[#979ca6] font-light gap-2">
                    <p className="text-xs rounded-3xl px-10 py-3 border border-[#D6DDEB]">Default</p>
                    <p className="text-xs rounded-3xl px-10 py-3 border border-[#D6DDEB]">{pageSize} per page</p>
                </div>
            </div>
            <div className="flex w-full gap-5 px-5">
                <div className=" w-[20%] min-w-[250px]">
                    <FilterSidebar handleCategoryChange={handleCategoryChange} handleTypeChange={handleTypeChange} />
                </div>
                <div className=" w-[80%]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-semibold">All Apprenticeships</h1>
                            <p className="my-2 text-[#7C8493]">Showing {jobs?.length} results for {props.search == '' ? ' ' : props.search}  jobs {props.location == '' ? '' : ' in ' + props.location}</p>
                        </div>
                        <div><span className="text-[#7C8493]">Sort by:</span> Most relevant</div>
                    </div>
                    <HowTo />
                    <div className="my-8 ">
                        {jobs ? jobs?.map((job: JobProps) => {
                            return (
                                <JobCard
                                    id={job.uid}
                                    key={job.uid}
                                    title={job.title}
                                    location={job.location}
                                    salary={job.salary}
                                    type={job.type}
                                    category={job.category}
                                    description={job.description}
                                    extras={job.extras}
                                    responsibilities={job.responsibilities}
                                    who_you_are={job.who_you_are}
                                    companyName={job.company_name ? job.company_name : "Unknown"}
                                    certificate={job.provides_certificate}
                                    training_mode={job.training_mode}
                                    user={props.user || null}
                                    isVerified={job.isVerified}
                                />
                            );
                        }
                        ) : <div className="flex justify-center items-center h-[250px]">
                            <MoonLoader color="#4A2C84" /> </div>
                        }
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center gap-2 mt-8 mb-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg border ${
                                currentPage === 1 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-[#4A2C84] hover:bg-gray-50'
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
                                        ? 'bg-[#4A2C84] text-white'
                                        : 'bg-white text-[#4A2C84] hover:bg-gray-50'
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
                                    : 'bg-white text-[#4A2C84] hover:bg-gray-50'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'
import MobileCard from "@/components/Jobs/MobileCard/MobileCard"
import ShowFilters from "./ShowFilters"
import GetStarted from "@/components/GetStartedBanner/GetStarted"
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IoCloseSharp, IoFilter } from "react-icons/io5";
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar";
import { MoonLoader } from "react-spinners";
import { log } from "console";
import HowTo from "../welcome/howto";

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
}

async function getJobs(page: number = 1, pageSize: number = 8) {
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
        .order('isVerified', { ascending: false, nullsFirst: false }) // Put nulls last
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

export default function MobileViewJobs(props: any) {
    const [jobs, setjobs] = useState<JobProps[]>([])
    const [totalJobs, setTotalJobs] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const arr = ["Software", "Electronics", "Design"]
    const [showfilter, setshowfilter] = useState(false)
    const pageSize = 8; // 8 jobs per page for mobile view


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
        <div className=" py-10 flex flex-col px-4 lg:hidden w-full mx-auto justify-center max-w-[700px]">
            <div className="justify-center">
                <div className="flex justify-between w-full items-center">
                    <h1 className="text-xl">All Apprenticeships</h1>
                    {/* <p className="text-sm">Most relevant</p> */}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-left my-2 font-light text-sm text-[#7C8493]">
                        Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalJobs)} of {totalJobs} results
                    </p>
                    {showfilter ? <div className="h-[200vh] m-0 w-full left-0 top-0 z-10 fixed bg-white overflow-scroll">
                        <div onClick={() => { setshowfilter(false) }} className="flex justify-center items-center text-center pt-6 pb-10 text-base cursor-pointer text-red-700"><IoCloseSharp className="text-2xl" /><div>Close</div></div>
                        <FilterSidebar selectedCategories={selectedCategories} selectedTypes={selectedTypes} handleCategoryChange={handleCategoryChange} handleTypeChange={handleTypeChange} />
                    </div> : <p onClick={() => {
                        setshowfilter(true)
                    }} className="text-sm flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg cursor-pointer"><IoFilter className="text-xl" />Filters</p>}
                </div>



                {/* Cards */}

                <HowTo/>

                <div className="flex flex-col gap-4 lg:hidden  w-full  ">
                    {jobs ? jobs?.map((job) => {
                        return <MobileCard
                            id={job.uid}
                            key={job.uid}
                            title={job.title}
                            category={job.category}
                            location={job.location}
                            salary={job.salary}
                            type={job.type}
                            description={job.description}
                            extras={job.extras}
                            responsibilities={job.responsibilities}
                            who_you_are={job.who_you_are}
                            companyName={job.company_name || "Unknown"}
                            certificate={job.provides_certificate}
                            training_mode={job.training_mode}
                            isVerified={job.isVerified}
                            logo={job.logo || ""}
                        />
                    }) : <div className="flex justify-center items-center h-[250px]">
                        <MoonLoader color="#14B8A6" /> </div>}
                </div>

                {/* Mobile Pagination Controls */}
                <div className="flex justify-center gap-2 mt-6 mb-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1.5 text-sm rounded-lg border ${
                            currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-[#14B8A6] hover:bg-gray-50'
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
                                            ? 'bg-[#14B8A6] text-white'
                                            : 'bg-white text-[#14B8A6] hover:bg-gray-50'
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
                                : 'bg-white text-[#14B8A6] hover:bg-gray-50'
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
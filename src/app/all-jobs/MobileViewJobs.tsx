'use client'
import MobileCard from "@/components/Jobs/MobileCard/MobileCard"
import ShowFilters from "./ShowFilters"
import GetStarted from "@/components/GetStartedBanner/GetStarted"
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IoCloseSharp, IoFilter } from "react-icons/io5";
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar";

async function getJobs() {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase
        .from('Jobs')
        .select(`*, 
        Recruiters(
            CompanyInfo(
                name,
                logo
            )
        )`)

    if (error) {
        console.log(error);
    }

    return data;
}

export default function MobileViewJobs(props) {
    const [jobs, setjobs] = useState()
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const arr = ["Software", "Electronics", "Design"]
    const [showfilter, setshowfilter] = useState(false)


    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(cat => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
        console.log(selectedCategories);
    };

    const handleTypeChange = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
        console.log(selectedTypes);
    };

    useEffect(() => {
        getJobs().then((data) => {
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
            setjobs(renderJobs)
        })
    }, [props.location, props.search, selectedCategories, selectedTypes])


    return (
        <div className=" py-10 flex flex-col px-4 lg:hidden w-full mx-auto justify-center max-w-[700px]">
            <div className="justify-center">
                <div className="flex justify-between w-full items-center">
                    <h1 className="text-xl">All Apprenticeships</h1>
                    {/* <p className="text-sm">Most relevant</p> */}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-left my-2 font-light text-sm text-[#7C8493]">Showing {props.renderJobs?.length} results</p>
                    {showfilter ? <div className="h-[200vh] m-0 w-full left-0 top-0 z-10 fixed bg-white overflow-scroll">
                        <div onClick={() => { setshowfilter(false) }} className="flex justify-center items-center text-center pt-6 pb-10 text-base cursor-pointer text-red-700"><IoCloseSharp className="text-2xl" /><div>Close</div></div>
                        <FilterSidebar selectedCategories={selectedCategories} selectedTypes={selectedTypes} handleCategoryChange={handleCategoryChange} handleTypeChange={handleTypeChange} />
                    </div> : <p onClick={() => {
                        setshowfilter(true)
                    }} className="text-sm flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg cursor-pointer"><IoFilter className="text-xl" />Filters</p>}
                </div>



                {/* Cards */}

                <div className="flex flex-col gap-4 lg:hidden  w-full  ">
                    {jobs?.map((job: JobProps) => {
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
                            companyName={job.company_name ? job.company_name : "Unknown"}
                        />
                    })}
                </div>
            </div>

            <div className="px-4 lg:hidden"><GetStarted /></div>
        </div>
    )
}
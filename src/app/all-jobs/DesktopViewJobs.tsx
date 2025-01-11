'use client'
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar"
import JobCard from "@/components/Jobs/JobCard/JobCard"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import { MoonLoader, SyncLoader } from "react-spinners"

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
    category: string
}



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

export default function DesktopViewJobs(props: any) {

    const [jobs, setjobs] = useState()
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const arr = ["Software", "Electronics", "Design"]

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
        <div className="hidden lg:block w-full border-t  ms-auto me-auto max-w-[1500px]">
            <div className="flex justify-between py-10 px-10 font-medium">
                <p>Showing 1-9 of {jobs?.length} results</p>
                <div className="flex text-[#979ca6] font-light gap-2">
                    <p className="text-xs rounded-3xl px-10 py-3 border border-[#D6DDEB]">Default</p>
                    <p className="text-xs rounded-3xl px-10 py-3 border border-[#D6DDEB]">9 per page</p>
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
                    <div className="my-8 ">
                        {jobs ? jobs?.map((job: JobProps) => {

                            return (
                                <JobCard
                                    id={job.uid}
                                    logo={job.companylogo}
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
                                    companyName={"test"}
                                />
                            );
                        }
                        ) : <div className="flex justify-center items-center h-[250px]">
                            <MoonLoader color="#4A2C84" /> </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
import Footer from "@/components/Footer/Footer";
import GetStarted from "@/components/GetStartedBanner/GetStarted";
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar";
import JobCard from "@/components/Jobs/JobCard/JobCard";
import MobileCard from "@/components/Jobs/MobileCard/MobileCard";
import SeekerNavbar from "./seekerNavbar";
import { useRouter } from "next/navigation";
import { FaLocationArrow, FaSearch, FaSearchLocation } from "react-icons/fa";
import { FaLocationPin, FaLocationPinLock, FaSearchengin } from "react-icons/fa6";
import getUser from "@/lib/getUser/getUser";
import { useEffect, useState } from "react";
import getJobs from "@/lib/getJobs/getJobs";
import Search from "./Search";
import ShowFilters from "./ShowFilters";
import DesktopViewJobs from "./DesktopViewJobs";

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

export default async function AllJobs({ params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const jobs = await getJobs('')
    const user = await getUser()
    const search = searchParams?.search ? searchParams?.search : ''
    const location = searchParams?.location ? searchParams?.location : ''
    const category1 = searchParams?.category1 ? searchParams?.category1 : ''
    const category2 = searchParams?.category2 ? searchParams?.category2 : ''
    const type1 = searchParams?.type1
    const type2 = searchParams?.type2


    const renderJobs = jobs?.filter(job => {
        // Check if the title includes the search query (case-insensitive)
        const titleMatch = job.title.toLowerCase().includes(search?.toLowerCase());

        // Check if the location includes the location query (case-insensitive)
        const locationMatch = job.location.toLowerCase().includes(location?.toLowerCase());

        // Return true if both conditions are met
        return titleMatch && locationMatch;
    });


    return (
        <div>
            <SeekerNavbar user={user} />
            <div className="flex flex-col items-center py-10 lg:pb-20">
                <div className="flex flex-col w-full items-center px-4 py-20 ">
                    <h1 className="text-xl font-semibold lg:text-5xl">Find your <span className="Apprentice pb-3 lg:pb-3">dream Job</span></h1>
                    <h2 className="text-sm my-10 font-medium lg:text-lg lg:font-light">Find your next career</h2>
                    <Search />
                </div>

                {/* Mobile view starts */}
                <div className="py-10 flex flex-col w-full px-4 lg:hidden">
                    <div className="flex justify-between w-full items-center">
                        <h1 className="text-xl">All Jobs</h1>
                        {/* <p className="text-sm">Most relevant</p> */}
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-left my-2 font-light text-sm text-[#7C8493]">Showing {renderJobs?.length} results</p>
                        <ShowFilters />
                    </div>

                    {/* Cards */}

                    <div className="flex flex-col lg:hidden my-6">
                        {renderJobs?.map((job: JobProps) => {
                            if (job.type.toLowerCase().includes(type1?.toLowerCase()) || job.type.toLowerCase().includes(type2?.toLowerCase()) || (type1 == undefined && type2 == undefined))
                                return <MobileCard
                                    id={job.uid}
                                    title={job.title}
                                    category={job.category}
                                    location={job.location}
                                    salary={job.salary}
                                    type={job.type}
                                    description={job.description}
                                    extras={job.extras}
                                    responsibilities={job.responsibilities}
                                    who_you_are={job.who_you_are}
                                />
                        })}
                    </div>
                </div>
                <div className="px-4 lg:hidden"><GetStarted /></div>
                {/* Mobile view ends */}

                {/* Desktop view starts */}

                <DesktopViewJobs search={search} location={location} renderjobs={await renderJobs} />

            </div>
            <Footer />
        </div>
    )
}
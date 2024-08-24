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
import MobileViewJobs from "./MobileViewJobs";

export const metadata: Metadata = {
    title: 'All Jobs | Bloom'
}

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
                    <h1 className="text-xl font-semibold lg:text-5xl">Bloom your <span className="Apprentice pb-3 lg:pb-3">Career</span></h1>
                    <h2 className="text-sm my-10 font-medium lg:text-lg lg:font-light">Find your next career</h2>
                    <Search />
                </div>

                {/* Mobile view starts */}
                <MobileViewJobs search={search} location={location} renderjobs={renderJobs} />
                {/* Mobile view ends */}

                {/* Desktop view starts */}

                <DesktopViewJobs search={search} location={location} renderjobs={renderJobs} />

            </div>
            <Footer />
        </div>
    )
}
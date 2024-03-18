import Footer from "@/components/Footer/Footer";
import GetStarted from "@/components/GetStartedBanner/GetStarted";
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar";
import JobCard from "@/components/Jobs/JobCard/JobCard";
import MobileCard from "@/components/Jobs/MobileCard/MobileCard";
import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { FaLocationArrow, FaSearch, FaSearchLocation } from "react-icons/fa";
import { FaLocationPin, FaLocationPinLock, FaSearchengin } from "react-icons/fa6";
import getUser from "@/lib/getUser/getUser";
import { useEffect, useState } from "react";
import getJobs from "@/lib/getJobs/getJobs";

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
}

export default async function AllJobs() {

    const jobs = await getJobs('')

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center py-10 lg:pb-20">
                <div className="flex flex-col w-full items-center px-4 py-20 ">
                    <h1 className="text-xl font-semibold lg:text-5xl">Find your <span className="Apprentice pb-3 lg:pb-3">dream Job</span></h1>
                    <h2 className="text-sm my-10 font-medium lg:text-lg lg:font-light">Find your next career</h2>
                    <div className="lg:flex items-center box_shadow x lg:p-2 lg:pl-8 lg:rounded-3xl max-lg:shadow-none">
                        <div className="hidden lg:block"><FaSearch /></div>
                        <input type="text" className="px-4 py-4 rounded-3xl placeholder:text-xs placeholder:font-medium mb-4 w-full text-sm box_shadow lg:shadow-none lg:mb-0 lg:rounded-r-none lg:placeholder:font-light lg:placeholder:text-sm lg:w-auto outline-none" placeholder="Job title or keywords" />
                        <div className="hidden lg:block"><FaSearchLocation /></div>
                        <input type="text" className="px-4 py-4 rounded-3xl outline-none placeholder:text-xs placeholder:font-medium mb-4 w-full text-sm box_shadow lg:shadow-none lg:mb-0 lg:rounded-l-none lg:rounded-r-none lg:placeholder:font-light lg:placeholder:text-sm lg:w-auto" placeholder="Lagos, Nigeria" />
                        <button className=" text-white py-3 text-center bg-[#4A2C84] w-full rounded-3xl font-semibold text-xs lg:text-sm lg:py-4 lg:px-10" >Search Job</button>
                    </div>
                </div>

                {/* Mobile view starts */}
                <div className="py-10 flex flex-col w-full px-4 lg:hidden">
                    <p className="text-center tex-sm">More filters</p>
                    <div className="flex justify-between w-full items-center">
                        <h1 className="text-xl">All Jobs</h1>
                        <p className="text-sm">Most relevant</p>
                    </div>
                    <p className="text-left my-2 font-light text-sm text-[#7C8493]">Showing 73 results</p>

                    {/* Cards */}

                    <div className="flex flex-col lg:hidden">
                        {/* <MobileCard handleClick={handleJobCardClick} /> */}
                    </div>
                </div>
                <div className="px-4 lg:hidden"><GetStarted /></div>
                {/* Mobile view ends */}

                {/* Desktop view starts */}

                <div className="hidden lg:block w-full border-t">
                    <div className="flex justify-between py-10 px-10 font-medium">
                        <p>Showing 1-9 of 10 results</p>
                        <div className="flex text-[#979ca6] font-light gap-2">
                            <p className="text-xs rounded-3xl px-10 py-3 border border-[#D6DDEB]">Default</p>
                            <p className="text-xs rounded-3xl px-10 py-3 border border-[#D6DDEB]">9 per page</p>
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className=" w-[20%]">
                            <FilterSidebar />
                        </div>
                        <div className=" w-[80%] pl-6 pr-20">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-semibold">All Jobs</h1>
                                    <p className="my-2 text-[#7C8493]">Showing 73 results</p>
                                </div>
                                <div><span className="text-[#7C8493]">Sort by:</span> Most relevant</div>
                            </div>
                            <div className="my-8">
                                {jobs?.map((job: JobProps) => {
                                    return <JobCard
                                        id={job.uid}
                                        title={job.title}
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
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
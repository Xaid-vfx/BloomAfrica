import FeaturedCard from "./FeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";

export default function FeaturedJobs() {
    return (
        <div className="bg-[#F8F8FD] py-10 px-4 relative lg:py-16">
            <div className="text-center">
                <h1 className="text-xl font-semibold lg:text-2xl lg:font-semibold">Featured Apprenticeship Jobs</h1>
                <p className="text-sm my-2 lg:text-base lg:my-4">
                    Find your career, you deserve it
                </p>
            </div>
            <div className="my-12">
                <p className="flex items-center gap-2 justify-end text-[#4A2C84] text-sm text-right  lg:px-8"><a href="/all-jobs" className="hover:underline cursor-pointer">Show all Jobs </a><FaArrowRightLong /></p>
                <div className="hidden lg:grid grid-cols-4 justify-center px-8">
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8].map(e => {
                            return (
                                <FeaturedCard
                                    id="1"
                                    title="Software Engineer"
                                    location="Nigeria"
                                    salary="$10000"
                                    type="Full Time"
                                    description="Browse our extensive collection of apprenticeship opportunities across me.
                                    I need a job now but a good designer..."
                                    extras=""
                                    responsibilities=""
                                    who_you_are=""
                                />
                            )
                        })
                    }
                </div>
                <div className="my-4 lg:hidden">
                    {
                        [1, 2].map(e => {
                            return (
                                <FeaturedCard
                                    id="1"
                                    title="Software Engineer"
                                    location="Nigeria"
                                    salary="$10000"
                                    type="Full Time"
                                    description="Browse our extensive collection of apprenticeship opportunities across me.
                                    I need a job now but a good designer..."
                                    extras=""
                                    responsibilities=""
                                    who_you_are=""
                                />
                            )
                        })
                    }

                </div>
            </div>

        </div>
    )
}
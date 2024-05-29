import CategoryCard from "./CategoryCard";
import FeaturedCard from "./FeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";

export default function ExploreCategory() {
    return (
        <div className="hidden lg:block py-10 px-4 relative lg:py-16">
            <div className="text-center">
                <h1 className="text-2xl font-semibold lg:text-2xl lg:font-semibold">Explore by Category</h1>
                <p className="text-sm my-2 lg:text-base lg:my-4">
                    Find your career, you deserve it
                </p>
            </div>
            <div className="my-12">
                <p className="flex items-center gap-2 justify-end text-[#4A2C84] text-sm text-right  px-8"><a href="/all-jobs" className="hover:underline cursor-pointer">Show all Jobs </a><FaArrowRightLong /></p>
                <div className="hidden lg:grid grid-cols-4 justify-center px-8">
                    {
                        ["Mechanical Engineering", "Electrical Engineering", "Construction & Civil Engineering", "Business & Entrepreneurship", "Fashion", "Cosmetology", "Hospitality", "Food & Culnilary"].map(e => {
                            return (
                                <CategoryCard
                                    id="1"
                                    title={e}
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
                                <CategoryCard
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
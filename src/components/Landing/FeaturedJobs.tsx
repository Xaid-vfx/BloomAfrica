import FeaturedCard from "./FeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";

export default function FeaturedJobs() {
    const jobs = [
        {
            title: "Auto Mechanic",
            location: "Abuja",
            type: "Full Time",
            company: "Gear Master Garage",
            diploma: "Certificate in Mechanical Engineering",
            description: "Auto Mechanic Apprentice needed in Abuja. Learn under experienced mentors, gain..."
        },
        {
            title: "Electrical Engineer",
            location: "Ibadan",
            type: "Full Time",
            company: "Olu Electroniks",
            diploma: "Certificate in Electrical Engineering ",
            description: "Become an Electrical Engineering apprentice in Ibadan. Gain practical experience..."
        },
        {
            title: "Barber",
            location: "Lagos",
            type: "Full Time",
            company: "ClipperCraft Studio",
            diploma: "Certificate in Cosmetology ",
            description: "Join our barbering team in Lagos! Apprentice under master barbers, refine your skills."
        },
        {
            title: "Tailoring",
            location: "Port Harcourt",
            type: "Full Time",
            company: "Yemi’s Boutique",
            diploma: "Certificate in Fashion Design & Tailoring ",
            description: "Launch your fashion career in Port Harcourt! Learn Textiles, Tailoring & Sewing from..."
        },
        {
            title: "Caterer / Chef",
            location: "Enugu",
            type: "Full Time",
            company: "Flavor Fusion",
            diploma: "Certificate in Food & Culinary ",
            description: "Caterer/Cook apprentice needed. Gain kitchen experience, cooking skills, and learn food ..."
        },
        {
            title: "Builder / Construction",
            location: "Lagos",
            type: "Full Time",
            company: "Foundation-Forge Builders",
            diploma: "Certificate in Construction & Civil Engineering ",
            description: "Seeking a Builder/Construction Apprentice in Lagos. Gain hands-on..."
        },
        {
            title: "Mechanic",
            location: "Ibadan",
            type: "Full Time",
            company: "Apex Mechanics",
            diploma: "Certificate in Mechanical Engineering ",
            description: "Become a skilled mechanic. Seeking a Mechanic Apprentice in Ibadan, Oyo State. Learn from seasoned..."
        },
        {
            title: "Carpenter",
            location: "Ibadan",
            type: "Full Time",
            company: "WoodWise Carpentry",
            diploma: "Certificate in Construction & Civil Engineering",
            description: "Seeking a Carpenter Apprentice in Ibadan. Learn woodworking skills, from crafting furniture to building structures."
        }
    ];
    return (
        <div className="bg-[#F8F8FD] py-10 px-4 relative lg:py-16 ">
            <div className="text-center ">
                <h1 className="text-xl font-semibold lg:text-2xl lg:font-semibold">Featured Apprenticeships </h1>
                <p className="text-sm my-2 lg:text-base lg:my-4">
                    Find your career, you deserve it
                </p>
            </div>
            <div className="my-12 ms-auto me-auto max-w-[1500px]">
                <p className="flex items-center gap-2 justify-end text-[#4A2C84] text-sm text-right  lg:px-8"><a href="/all-jobs" className="hover:underline cursor-pointer">Show all Jobs </a><FaArrowRightLong /></p>
                <div className="hidden lg:grid grid-cols-4 justify-center px-8">
                    {
                        jobs.map(job => {
                            return (
                                <FeaturedCard
                                    id="1"
                                    title={job.title}
                                    location={job.location}
                                    type={job.type}
                                    description={job.description}
                                    diploma={job.diploma}
                                    company={job.company}
                                />
                            )
                        })
                    }
                </div>
                <div className="my-4 lg:hidden">
                    {
                        jobs.slice(0, 2).map(job => {
                            return (
                                <FeaturedCard
                                    id="1"
                                    title={job.title}
                                    location={job.location}
                                    type={job.type}
                                    description={job.description}
                                    diploma={job.diploma}
                                    company={job.company}
                                />
                            )
                        })
                    }

                </div>
            </div>

        </div>
    )
}
import FeaturedCard from "./FeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";

export default function FeaturedJobs() {
    const jobs = [
        {
            title: "Auto Mechanic",
            location: "Abuja, FCT",
            type: "Full Time",
            company: "Gear Master Garage",
            diploma: "Diploma in Mechanical Engineering",
            description: "Auto Mechanic Apprentice needed in Abuja. Learn under experienced mentors, gain hands-on experience in vehicle repair and maintenance."
        },
        {
            title: "Electrical Engineer",
            location: "Ibadan, Oyo State",
            type: "Full Time",
            company: "Olu Electroniks",
            diploma: "Diploma in Electrical Engineering (Level 7)",
            description: "Become an Electrical Engineering apprentice in Ibadan. Gain practical experience, work on diverse projects, and develop skills under expert guidance."
        },
        {
            title: "Barber",
            location: "Lagos, Lagos State",
            type: "Full Time",
            company: "ClipperCraft Studio",
            diploma: "Diploma in Cosmetology (Level 7)",
            description: "Join our barbering team in Lagos! Apprentice under master barbers, refine your skills."
        },
        {
            title: "Tailoring",
            location: "Port Harcourt, Rivers State",
            type: "Full Time",
            company: "Yemi’s Boutique",
            diploma: "Diploma in Fashion Design, Textiles, and Apparel (Level 7)",
            description: "Launch your fashion career in Port Harcourt! Learn Textiles, Tailoring & Sewing from experienced professionals. Join us to refine your skill."
        },
        {
            title: "Caterer / Chef",
            location: "Enugu, Enugu State",
            type: "Full Time",
            company: "Flavor Fusion",
            diploma: "Diploma in Food & Culinary (Level 7)",
            description: "Caterer/Cook apprentice needed. Gain kitchen experience, cooking skills, and learn food preparation techniques in Enugu."
        },
        {
            title: "Builder / Construction",
            location: "Lagos, Lagos State",
            type: "Full Time",
            company: "Foundation-Forge Builders",
            diploma: "Diploma in Construction & Civil Engineering (Level 7)",
            description: "Seeking a Builder/Construction Apprentice in Lagos. Gain hands-on experience in construction projects, learn from skilled professionals."
        },
        {
            title: "Mechanic",
            location: "Ibadan, Oyo State",
            type: "Full Time",
            company: "Apex Mechanics",
            diploma: "Diploma in Mechanical Engineering (Level 7)",
            description: "Become a skilled mechanic. Seeking a Mechanic Apprentice in Ibadan, Oyo State. Learn from seasoned professionals, gain practical skills in vehicle maintenance and repair."
        },
        {
            title: "Carpenter",
            location: "Ibadan, Oyo State",
            type: "Full Time",
            company: "WoodWise Carpentry",
            diploma: "Diploma in Construction & Civil Engineering (Level 7)",
            description: "Seeking a Carpenter Apprentice in Ibadan. Learn woodworking skills, from crafting furniture to building structures."
        }
    ];
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
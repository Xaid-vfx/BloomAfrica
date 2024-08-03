import FeaturedCard from "./FeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";
import Image1 from '../../assets/images/LandingIcons/Group 317.png';
import Image2 from '../../assets/images/LandingIcons/Group 316.png';
import Image3 from '../../assets/images/LandingIcons/Group 315.png';
import Image4 from '../../assets/images/LandingIcons/Group 314.png';
import Image from "next/image";

export default function ForSeekersRecruiters() {
    return (
        <div className="flex lg:flex-row flex-col relative">
            <div className="lg:w-1/2 flex flex-col justify-between py-10 lg:py-20 px-6 lg:px-16 bg-[#F8F8FD]">
                <div>
                    <div className="text-base font-semibold text-[#4A2C84]">For Job Seekers</div>
                    <div className="text-3xl font-semibold my-4">Your Path to Success Starts Here</div>

                    <div className="text-sm lg:text-base mb-12">
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image1} alt="1" width={38} />
                            Bloom offers a platform tailored to help you find apprenticeship opportunities that match your skills and interests.
                        </p>
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image2} alt="1" width={38} />
                            Bloom has a zero-tolerance policy for abuse. We take strong measures to ensure that all mentors treat their apprentices with respect.
                        </p>
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image3} alt="1" width={38} />
                            After successfully finishing your apprenticeship, you will be awarded a professional qualification, a prestigious credential that will distinguish you in the rapidly evolving, competitive job market.
                        </p>
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image4} alt="1" width={38} />
                            Start your journey towards professional growth and advancement today with Bloom.
                        </p>
                    </div>
                </div>
                <div><a href="/all-jobs" className="border border-[#4A2C84] text-white py-3 px-4 text-center bg-[#4A2C84] rounded-3xl font-medium text-xs lg:text-sm lg:py-3 lg:px-8" >Find Apprenticeships</a>
                    <a href="/about" className=" border border-black py-3 px-4 text-center rounded-3xl font-medium text-xs lg:text-sm lg:py-3 ml-2 lg:px-8" >Learn More</a></div>
            </div>
            <div className="lg:w-1/2 flex flex-col justify-between py-10 lg:py-20 px-6 lg:px-16">
                <div>
                    <div className="text-base font-semibold text-[#4A2C84]">For Job Recruiters</div>
                    <div className="text-3xl font-semibold my-4">Connect with Top Talent on Bloom</div>

                    <div className="text-sm lg:text-base mb-12">
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image1} alt="1" width={38} />
                            Are you looking to attract bright young talent to your business? Look no further than Bloom's platform for posting your local job openings.
                        </p>
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image2} alt="1" width={38} />
                            No business is too small to hire. We encourage businesses of all sizes to bring in fresh talent from our platform, providing you with more manpower to scale your operation.
                        </p>
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image3} alt="1" width={38} />
                            Worried about background checks? Don't be. We verify and vet all our users before they can apply. Bloom has a zero-tolerance policy for abuse and takes strong measures to protect mentors from bad apprentices.
                        </p>
                        <p className="my-8 flex font-[350] items-start gap-4">
                            <Image src={Image4} alt="1" width={38} />
                            Create job listings that stand out, highlight your company culture and growth opportunities, and reach thousands of trustworthy, eager apprentices.
                        </p>
                    </div>
                </div>
                <div><a href="/signup" className="border border-[#4A2C84] text-white py-3 px-4 text-center bg-[#4A2C84] rounded-3xl font-medium text-xs lg:text-sm lg:py-3 lg:px-8" >Post a Job</a>
                    <a href="/about" className=" border border-black py-3 px-4 text-center rounded-3xl font-medium text-xs lg:text-sm lg:py-3 ml-2 lg:px-8" >Learn More</a></div>
            </div>

        </div>
    )
}
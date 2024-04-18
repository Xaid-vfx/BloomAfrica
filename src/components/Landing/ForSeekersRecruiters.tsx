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
            <div className="lg:w-1/2 py-10 lg:py-20 px-6 lg:px-16 bg-[#F8F8FD]">
                <div className="text-base font-semibold text-[#4A2C84]">For Job Seekers</div>
                <div className="text-3xl font-semibold my-4">Your Path to Success Starts Here</div>
                <div className="text-sm lg:text-base mb-12">
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image1} alt="1" width={38} />
                        Bloom offers a platform tailored to help you find apprenticeship opportunities that match your skills and interests.
                    </p>
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image2} alt="1" width={38} />
                        Learn how to craft a winning application, ace interviews, and make the most of your apprenticeship experience with our expert tips and resources.
                    </p>
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image3} alt="1" width={38} />
                        Join the Bloom community of job seekers and unlock access to exclusive job listings, networking events, and career development opportunities.
                    </p>
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image4} alt="1" width={38} />
                        Start your journey towards professional growth and advancement today with Bloom.
                    </p>
                </div>

                <a href="/all-jobs" className="border border-[#4A2C84] text-white py-3 px-4 text-center bg-[#4A2C84] rounded-3xl font-medium text-xs lg:text-sm lg:py-3 lg:px-8" >Find Jobs</a>
                <a href="/about" className=" border border-black py-3 px-4 text-center rounded-3xl font-medium text-xs lg:text-sm lg:py-3 ml-2 lg:px-8" >Learn More</a>
            </div>
            <div className="lg:w-1/2 py-10 lg:py-20 px-6 lg:px-16">
                <div className="text-base font-semibold text-[#4A2C84]">For Job Recruiters</div>
                <div className="text-3xl font-semibold my-4">Connect with Top Talent on Bloom</div>
                <div className="text-sm lg:text-base mb-12">
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image1} alt="1" width={38} />
                        Are you looking to attract bright young talent to your organization? Look no further than Bloom's platform for posting apprenticeship opportunities.
                    </p>
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image2} alt="1" width={38} />
                        Reach thousands of eager job seekers across Nigeria by posting your apprenticeship opportunities on Bloom's job board.
                    </p>
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image3} alt="1" width={38} />
                        Learn how to create compelling job listings that stand out and effectively showcase your company culture and growth opportunities.
                    </p>
                    <p className="my-8 flex font-light items-start gap-4">
                        <Image src={Image4} alt="1" width={38} />
                        Join the ranks of leading organizations already leveraging Bloom to recruit the next generation of talent and drive success.
                    </p>
                </div>

                <a href="/signup" className="border border-[#4A2C84] text-white py-3 px-4 text-center bg-[#4A2C84] rounded-3xl font-medium text-xs lg:text-sm lg:py-3 lg:px-8" >Post a Job</a>
                <a href="/about" className=" border border-black py-3 px-4 text-center rounded-3xl font-medium text-xs lg:text-sm lg:py-3 ml-2 lg:px-8" >Learn More</a>
            </div>

        </div>
    )
}
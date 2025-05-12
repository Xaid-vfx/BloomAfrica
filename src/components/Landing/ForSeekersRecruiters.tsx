import FeaturedCard from "./FeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";
import Image1 from '../../assets/images/LandingIcons/Group 317.png';
import Image2 from '../../assets/images/LandingIcons/Group 316.png';
import Image3 from '../../assets/images/LandingIcons/Group 315.png';
import Image4 from '../../assets/images/LandingIcons/Group 314.png';
import Image from "next/image";

export default function ForSeekersRecruiters() {
    return (
        <div className="flex lg:flex-row flex-col relative ">
            <div className="lg:w-1/2 flex flex-col justify-between py-10 lg:py-20 px-6 lg:px-16 bg-[#F8F8FD] ">
                <div className=" lg:ms-auto max-lg:mx-auto max-w-[640px]">
                    <div className="lg:ms-auto max-lg:mx-auto max-w-[640px]">
                        <div className="text-base font-semibold text-[#4A2C84]">For Apprentices</div>
                        <div className="text-3xl font-semibold my-4">Go from Apprentice to Entreprenuer</div>

                        <div className="text-sm lg:text-base mb-12">
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image1} alt="1" width={38} />
                                Discover affordable and flexible learning programs designed to fit your needs. Whether you’re looking for a short-term or long-term apprenticeship, or even one with a salary or settlement, you’ll find options that suit you perfectly.
                            </p>
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image2} alt="1" width={38} />
                                Recieve expert guidance and Learn directly from experienced Ogas & mentors who understand the ins and outs of your chosen industry, giving you real-world knowledge and skills.
                            </p>
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image3} alt="1" width={38} />
                                Unlock diverse career opportunities, from landing your dream job to starting your own business, our official certifications and real world experience from the program will prepare you for both employment and entrepreneurship.
                            </p>
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image4} alt="1" width={38} />
                                Expand your professional network by connecting with mentors, fellow apprentices, and industry professionals, opening doors to future opportunities.
                            </p>
                        </div>
                        
                    </div>
                    <div> 
                        <div className="ms-auto max-w-[640px] align-bottom"><a href="/all-trainings" className="border border-[#4A2C84] text-white py-3 px-4 text-center bg-[#4A2C84] rounded-2xl font-medium text-xs lg:text-sm lg:py-3 lg:px-8" >Find Apprenticeships</a>
                        <a href="/about" className=" border border-black py-3 px-4 text-center rounded-2xl font-medium text-xs lg:text-sm lg:py-3 ml-2 lg:px-8" >Learn More</a></div>
                </div>
            </div>      
            </div>
            <div className="lg:w-1/2 flex flex-col justify-between py-10 lg:py-20 px-6 lg:px-16">
                <div className=" lg:me-auto max-lg:mx-auto max-w-[640px]  ">
                    <div className="lg:me-auto max-lg:mx-auto max-w-[640px]">
                        <div className="text-base font-semibold text-[#4A2C84]">For Ogas & Mentors</div>
                        <div className="text-3xl font-semibold my-4">Connect with Hardworking Apprentices</div>

                        <div className="text-sm lg:text-base mb-12">
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image1} alt="1" width={38} />
                                Earn while you mentor and Gain additional income as apprentices pay fees to learn from your expertise. Turn your knowledge into a valuable and rewarding asset.
                            </p>
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image2} alt="1" width={38} />
                                Our platform will attract more apprentices promote your apprenticeship offerings, bringing in a steady stream of learners eager to pay and learn from you.
 
                            </p>
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image3} alt="1" width={38} />
                                Grow your business through apprenticeship by strategically training apprentices to contribute to your business operations and in return they learn real world experience. With their support, you’ll boost productivity, increase manpower, and ultimately drive higher profits.
                            </p>
                            <p className="my-8 flex font-[350] items-start gap-4">
                                <Image src={Image4} alt="1" width={38} />
                                Bloom is very easy to use, you can set your own fees, customize schedules, and manage everything effortlessly, giving you complete control over your apprenticeship program. 
                                <br /> <br /> 
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="me-auto max-w-[640px] "><a href="/signup" className="border border-[#4A2C84] text-white py-3 px-4 text-center bg-[#4A2C84] rounded-2xl font-medium text-xs lg:text-sm lg:py-3 lg:px-8" >Become a Trainer</a>
                        <a href="/about" className=" border border-black py-3 px-4 text-center rounded-2xl font-medium text-xs lg:text-sm lg:py-3 ml-2 lg:px-8" >Learn More</a></div>
                    </div>
                </div>
                
            </div>

        </div>
    )
}
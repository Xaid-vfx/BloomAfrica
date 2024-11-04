import Image from "next/image";
import step1 from '../../assets/images/step1.png'
import step2 from '../../assets/images/step2.png'
import step3 from '../../assets/images/step3.png'
import balls from '../../assets/images/BallsLanding.png'
import quarter from '../../assets/images/SideCircle.png'
import star from '../../assets/images/4SidedStar.png'
import goal from '../../assets/images/Goal.png'

export default function HowItWorks() {
    return (
        <div className="bg-[#ffffff] py-10 px-4 relative lg:py-24">
            <div className="text-center">
                <h1 className="text-2xl font-semibold lg:text-3xl lg:font-semibold">How Bloom Works</h1>
                <p className="text-sm my-2 leading-6 px-6 lg:text-lg lg:my-4">
                    Explore our handpicked selection of featured apprenticeship opportunities below.
                </p>
            </div>
            <Image src={balls} alt="balls" width={30} className="absolute right-0 top-0 lg:hidden" />
            <Image src={star} alt="star" width={40} className="absolute left-14 top-14 hidden lg:block" />
            <Image src={star} alt="star" width={30} className="absolute left-60 top-28 hidden lg:block" />
            <Image src={quarter} alt="quarter" width={200} className="absolute right-0 top-0 hidden lg:block" />
            <div className="lg:flex lg:px-10 pt-10">
                <div className="text-center my-6 flex flex-col items-center py-10 px-6 lg:w-1/3 lg:mx-4 box_shadow rounded-2xl">
                    <Image src={goal} alt="" width={80} className="hidden lg:block" />
                    <Image src={goal} alt="" width={60} className="lg:hidden" />

                    <h2 className="my-3 font-medium text-xl lg:font-semibold">
                        Explore Our Opportunities
                    </h2>
                    <p className="text-xs leading-6 mt-3 text-[#515B6F]">
                        Browse our extensive collection of apprenticeship opportunities across various industries and locations. Use our search filters to narrow down your options based on your preferences.
                    </p>
                </div>
                <div className="text-center my-6 flex flex-col items-center py-10 px-6 lg:w-1/3 lg:mx-4 box_shadow rounded-2xl">
                    <Image src={goal} alt="" width={80} className="hidden lg:block" />
                    <Image src={goal} alt="" width={60} className="lg:hidden" />
                    
                    <h2 className="my-3 font-medium text-xl lg:font-semibold">
                        Accelerated Learning
                    </h2>
                    <p className="text-xs leading-6 mt-3 text-[#515B6F]">
                        While working on-site with your mentor to gain <span className="whitespace-nowrap">hands-on</span> experience, you will also participate in our accelerated curriculum program designed to make you an expert in your field.
                    </p>
                </div>
                <div className="text-center my-6 flex flex-col items-center py-10 px-6 lg:w-1/3 lg:mx-4 box_shadow rounded-2xl">
                    <Image src={goal} alt="" width={80} className="hidden lg:block" />
                    <Image src={goal} alt="" width={60} className="lg:hidden" />

                    <h2 className="my-3 font-medium text-xl lg:font-semibold">
                        Get Certified
                    </h2>
                    <p className="text-xs leading-6 mt-3 text-[#515B6F]">
                        After successfully finishing your apprenticeship, you will attain a professional certificate, a prestigious credential that will distinguish you in the competitive job market.
                    </p>
                </div>
            </div>
        </div>
    )
}
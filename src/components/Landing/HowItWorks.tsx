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
                    {/* <h3 className="font-medium  text-sm text-[#4A2C84] lg:text-lg lg:font-semibold my-4">Step 1</h3> */}
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
                    {/* <h3 className="font-medium  text-sm text-[#4A2C84] lg:text-lg lg:font-semibold my-4">Step 1</h3> */}
                    <h2 className="my-3 font-medium text-xl lg:font-semibold">
                        Apply for Jobs
                    </h2>
                    <p className="text-xs leading-6 mt-3 text-[#515B6F]">
                        Once you've found a job listing that interests you, simply click to view more details and follow the instructions provided to submit your application. You can upload your resume/CV and any additional materials directly through Bloom.
                    </p>
                </div>
                <div className="text-center my-6 flex flex-col items-center py-10 px-6 lg:w-1/3 lg:mx-4 box_shadow rounded-2xl">
                    <Image src={goal} alt="" width={80} className="hidden lg:block" />
                    <Image src={goal} alt="" width={60} className="lg:hidden" />
                    {/* <h3 className="font-medium  text-sm text-[#4A2C84] lg:text-lg lg:font-semibold my-4">Step 1</h3> */}
                    <h2 className="my-3 font-medium text-xl lg:font-semibold">
                        Get Hired
                    </h2>
                    <p className="text-xs leading-6 mt-3 text-[#515B6F]">
                        Stay updated on the status of your applications through your Bloom account. If selected, you'll be contacted by the hiring organization to schedule interviews and discuss next steps. Congratulations on your journey to success!
                    </p>
                </div>
                {/* <div className="text-center flex px-10 flex-col items-center py-10 pt-10 lg:w-1/3 lg:mx-4 box_shadow rounded-2xl">
                    <Image src={step2} alt="" width={150} className="hidden lg:block" />
                    <Image src={step2} alt="" width={100} className="lg:hidden" />
                    <h3 className="font-medium text-sm text-[#4A2C84] lg:text-lg lg:font-semibold">Step 2</h3>
                    <h2 className="my-3 font-medium text-base lg:font-semibold">
                        Apply for Jobs
                    </h2>
                    <p className="text-xs text-[#515B6F] leading-6">
                        Once you've found a job listing that interests you, simply click to view more details and follow the instructions provided to submit your application. You can upload your resume/CV and any additional materials directly through Bloom.
                    </p>
                </div>
                <div className="text-center flex flex-col items-center py-2 pt-10 lg:w-1/3 lg:mx-4 box_shadow rounded-2xl">
                    <Image src={step3} alt="" width={150} className="hidden lg:block" />
                    <Image src={step3} alt="" width={100} className="lg:hidden" />
                    <h3 className="font-medium text-sm text-[#4A2C84] lg:text-lg lg:font-semibold">Step 3</h3>
                    <h2 className="my-3 font-medium text-base lg:font-semibold">Get Hired </h2>
                    <p className="text-xs leading-6">
                        Stay updated on the status of your applications through your Bloom account. If selected, you'll be contacted by the hiring organization to schedule interviews and discuss next steps. Congratulations on your journey to success!
                    </p>
                </div> */}
            </div>
        </div>
    )
}
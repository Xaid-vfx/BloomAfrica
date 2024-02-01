import Image from "next/image";
import step1 from '../../assets/images/step1.png'
import step2 from '../../assets/images/step2.png'
import step3 from '../../assets/images/step3.png'
import balls from '../../assets/images/BallsLanding.png'
import quarter from '../../assets/images/SideCircle.png'
import star from '../../assets/images/4SidedStar.png'

export default function HowItWorks() {
    return (
        <div className="bg-[#F0F0FB] py-10 px-4 relative lg:py-20">
            <div className="text-center">
                <h1 className="text-xl font-medium lg:text-2xl lg:font-semibold">How It Works</h1>
                <p className="text-xs my-2 lg:text-base lg:my-4">
                    Connect your job, explore qualifications, and accelerate your career.
                </p>
            </div>
            <Image src={balls} alt="balls" width={30} className="absolute right-0 top-0 lg:hidden" />
            <Image src={star} alt="star" width={40} className="absolute left-14 top-14 hidden lg:block" />
            <Image src={star} alt="star" width={30} className="absolute left-60 top-28 hidden lg:block" />
            <Image src={quarter} alt="quarter" width={200} className="absolute right-0 top-0 hidden lg:block" />
            <div className="lg:flex lg:px-10">
                <div className="text-center flex flex-col items-center py-2 pt-10 lg:w-1/3 lg:mx-4">
                    <Image src={step1} alt="" width={150} className="hidden lg:block" />
                    <Image src={step1} alt="" width={100} className="lg:hidden" />
                    <h3 className="font-medium text-sm text-[#4A2C84] lg:text-lg lg:font-semibold">Step 1</h3>
                    <h2 className="my-3 font-medium text-base lg:font-semibold">Find Your Perfect Match</h2>
                    <p className="text-xs leading-6">
                        Explore a comprehensive selection of job listings and tailored courses to accelerate your career journey. Our platform seamlessly integrates job opportunities with relevant learning pathways, empowering you to make informed decisions about your professional development.
                    </p>
                </div>
                <div className="text-center flex flex-col items-center py-2 pt-10 lg:w-1/3 lg:mx-4">
                    <Image src={step2} alt="" width={150} className="hidden lg:block" />
                    <Image src={step2} alt="" width={100} className="lg:hidden" />
                    <h3 className="font-medium text-sm text-[#4A2C84] lg:text-lg lg:font-semibold">Step 2</h3>
                    <h2 className="my-3 font-medium text-base lg:font-semibold">
                        Explore Our Opportunities Learning
                    </h2>
                    <p className="text-xs leading-6">
                        Simply browse our expansive job listings and carefully review each opportunity's description. When you discover a position that aligns with your aspirations, seamlessly apply through our user-friendly platform.
                    </p>
                </div>
                <div className="text-center flex flex-col items-center py-2 pt-10 lg:w-1/3 lg:mx-4">
                    <Image src={step3} alt="" width={150} className="hidden lg:block" />
                    <Image src={step3} alt="" width={100} className="lg:hidden" />
                    <h3 className="font-medium text-sm text-[#4A2C84] lg:text-lg lg:font-semibold">Step 3</h3>
                    <h2 className="my-3 font-medium text-base lg:font-semibold">Job-integrated learning </h2>
                    <p className="text-xs leading-6">
                        Upon securing employment, our services don't end there. We offer a unique apprenticeship program that allows you to continue learning and growing alongside your professional development. This structured program seamlessly integrates theoretical knowledge with practical experience, leading to the completion of a diploma or lower degree.
                    </p>
                </div>
            </div>
        </div>
    )
}
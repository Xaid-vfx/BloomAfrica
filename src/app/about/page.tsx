import Navbar from "@/components/navbar/Navbar"
import Image from "next/image"
import UserImage from "../../assets/images/user.jpg"
import Milestones from "@/components/About/Milestones"
import Footer from "@/components/Footer/Footer"
import { Metadata } from "next"
import AboutHero from "@/components/About/AboutHero"
import Beliefs from "@/components/About/Beliefs"
import FoundingTeam from "@/components/About/FoundingTeam"
import Poverty from '../../assets/images/sdg/Poverty.png'
import Climate from '../../assets/images/sdg/Climate.png'
import Education from '../../assets/images/sdg/Education.png'
import Energy from '../../assets/images/sdg/Energy.png'
import Gender from '../../assets/images/sdg/Gender.png'
import Balls from '../../assets/images/sdg/sgdballs.png'
import Industry from '../../assets/images/sdg/Industry.png'
import Inequality from '../../assets/images/sdg/Reduced.png'
import Peace from '../../assets/images/sdg/Peace.png'
import Economic from '../../assets/images/sdg/Economic.png'
import GetStarted from "@/components/GetStartedBanner/GetStarted"
import { Economica } from "next/font/google"
import { SchoolIcon, WorkflowIcon } from "lucide-react"
import Timeline from "./TImeline"

export const metadata: Metadata = {
    title: 'About | Bloom'
}

export default function About() {
    return (
        <div className="bg-[#F0F0FB]">
            <Navbar color="white" />
            <div className="">
                <AboutHero />
            </div>
            <Beliefs />
            {/* sdgs */}
            <div className="lg:py-16 py-20 relative">
                <Image src={Balls} alt="user" className="hidden lg:block absolute top-0 left-0" width={100} />
                <Image src={Balls} alt="user" className="lg:hidden absolute top-0 left-0" width={50} />
                <Image src={Balls} alt="user" className="hidden lg:block absolute bottom-0 right-0" width={100} />
                <Image src={Balls} alt="user" className="lg:hidden absolute bottom-0 right-0" width={50} />
                <h1 className="flex justify-center items-center gap-2 lg:gap-3">
                    <span className="text-xl lg:text-2xl font-semibold text-[#4A2C84]">OUR</span>
                    <span className="text-xl lg:text-2xl font-semibold leading-5">SUSTAINABLE <br /> DEVELOPMENT</span>
                    <span className="text-4xl lg:text-6xl font-semibold text-[#4A2C84]">GOALS</span>
                </h1>
                <div className="lg:px-14 px-4 flex flex-wrap mt-10 gap-x-3 gap-y-8">
                    <div className="bg-[#E5243B] p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">NO <br /> POVERTY</p>
                        <Image src={Poverty} alt="sdg" width={100} className="hidden lg:block" />
                        <Image src={Poverty} alt="sdg" width={40} className=" lg:hidden" />
                    </div>
                    <div className="bg-[#FF3A21] p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">GENDER <br /> EQUALITY</p>
                        <Image src={Gender} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Gender} alt="sdg" width={20} className=" lg:hidden" />
                    </div>
                    <div className="bg-[#C5192D] min-w-max p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">QUALITY <br /> EDUCATION</p>
                        <Image src={Education} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Education} alt="sdg" width={30} className=" lg:hidden" />
                    </div>

                    <div className="bg-[#FCC30B] min-w-fit p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">AFFORDABLE & <br /> CLEAN ENERGY</p>
                        <Image src={Energy} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Energy} alt="sdg" width={30} className=" lg:hidden" />
                    </div>
                    <div className="bg-[#A21942] p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">DECENT WORK AND  ECONOMIC GROWTH</p>
                        <Image src={Economic} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Economic} alt="sdg" width={30} className=" lg:hidden" />
                    </div>
                    <div className="bg-[#FD6925] p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">INDUSTRY  INNOVATION & INFRASTRUCTURE</p>
                        <Image src={Industry} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Industry} alt="sdg" width={30} className=" lg:hidden" />
                    </div>
                    <div className="bg-[#DD1367] p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">REDUCED <br /> INEQUALITIES</p>
                        <Image src={Inequality} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Inequality} alt="sdg" width={30} className=" lg:hidden" />
                    </div>
                    <div className="bg-[#3F7E44] p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">CLIMATE <br /> ACTIONS</p>
                        <Image src={Climate} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Climate} alt="sdg" width={30} className=" lg:hidden" />
                    </div>
                    <div className="bg-[#00689D] p-2 lg:text-sm text-[0.45rem]  lg:w-[190px] w-[80px]  rounded-lg">
                        <p className="text-white mb-2">PEACE JUSTICE & <br /> STRONG INSTITUTIONS</p>
                        <Image src={Peace} alt="sdg" width={50} className="hidden lg:block" />
                        <Image src={Peace} alt="sdg" width={30} className=" lg:hidden" />
                    </div>
                </div>
            </div>
            <div className="lg:px-12 px-4">
                <div className="flex gap-2 items-center">
                    <p className="h-[50px] border-l-8 border-[#4A2C84] rounded-lg"></p>
                    <h1 className="text-2xl font-semibold ">Timeline</h1>
                </div>
                <Timeline />
            </div>

            <div>
                <FoundingTeam />
            </div>
            <div className="px-4 bg-[#f0f0fb]"><GetStarted /></div>
            <Footer />
        </div>
    )
} 
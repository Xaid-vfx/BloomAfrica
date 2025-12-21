import Navbar from "@/components/navbar/Navbar"
import Image from "next/image"
import UserImage from "../../assets/images/user.jpg"
import Milestones from "@/components/About/Milestones"
import Footer from "@/components/Footer/Footer"
import { Metadata } from "next"
import AboutHero from "@/components/About/AboutHero"
import Beliefs from "@/components/About/Beliefs"
import TeamMembers from "@/components/About/TeamMembers"
import Balls from '../../assets/images/sdg/sgdballs.png'
import GetStarted from "@/components/GetStartedBanner/GetStarted"
import sdg1 from '../../assets/images/sdg/sdg1.svg'
import sdg5 from '../../assets/images/sdg/sdg5.svg'
import sdg7 from '../../assets/images/sdg/sdg7.svg'
import sdg8 from '../../assets/images/sdg/sdg8.svg'
import sdg9 from '../../assets/images/sdg/sdg9.svg'
import sdg10 from '../../assets/images/sdg/sdg10.svg'
import sdg13 from '../../assets/images/sdg/sdg13.svg'
import sdg16 from '../../assets/images/sdg/sdg16.svg'
import sdg4 from '../../assets/images/sdg/sdg4.svg'
import { Economica } from "next/font/google"
import { SchoolIcon, WorkflowIcon } from "lucide-react"
import Timeline from "./TImeline"

export const metadata: Metadata = {
    title: 'About | Prentis'
}

export default function About() {
    return (
        <div className="bg-[#F0F0FB]">
            <Navbar color="white" />
            <div>
                <AboutHero />
            </div>
            
            {/* sdgs
            <div className="lg:py-16 py-20 relative z-0">
                <Image src={Balls} alt="user" className="hidden lg:block absolute top-0 left-0" width={100} />
                <Image src={Balls} alt="user" className="lg:hidden absolute top-0 left-0" width={50} />
                <Image src={Balls} alt="user" className="hidden lg:block absolute bottom-0 right-0" width={100} />
                <Image src={Balls} alt="user" className="lg:hidden absolute bottom-0 right-0" width={50} />
                <h1 className="flex justify-center items-center gap-2 lg:gap-3">
                    <span className="text-xl lg:text-2xl max-sm:text-[17px] font-semibold text-[#4A2C84]">OUR</span>
                    <span className="text-xl lg:text-2xl max-sm:text-[17px] font-semibold leading-5">SUSTAINABLE <br /> DEVELOPMENT</span>
                    <span className="text-4xl lg:text-6xl max-sm:text-[30px] font-semibold text-[#4A2C84]">GOALS</span>
                </h1>
                <div className="lg:px-14 px-4 flex flex-wrap mt-10 gap-x-3 gap-y-8 ms-auto me-auto max-w-[1500px] justify-center ">
                    
                    <div className="lg:w-[190px] w-[120px]">
                        <Image src={sdg8} alt="sdg"  className="hidden lg:block" />
                        <Image src={sdg8} alt="sdg"  className=" lg:hidden" />
                    </div>
                    <div className="lg:w-[190px] w-[120px]">
                        <Image src={sdg4} alt="sdg"  className="hidden lg:block" />
                        <Image src={sdg4} alt="sdg"  className=" lg:hidden" />
                    </div>
                
                    <div className="lg:w-[190px] w-[120px]">
                        <Image src={sdg9} alt="sdg"  className="hidden lg:block" />
                        <Image src={sdg9} alt="sdg"  className=" lg:hidden" />
                    </div>

                    <div className="lg:w-[190px] w-[120px]">
                        <Image src={sdg5} alt="sdg"  className="hidden lg:block" />
                        <Image src={sdg5} alt="sdg"  className=" lg:hidden" />
                    </div>
                    
                    <div className="lg:w-[190px] w-[120px]">
                        <Image src={sdg10} alt="sdg"  className="hidden lg:block" />
                        <Image src={sdg10} alt="sdg"  className=" lg:hidden" />
                    </div>

                    <div className="lg:w-[190px] w-[120px]">
                        <Image src={sdg7} alt="sdg"  className="hidden lg:block" />
                        <Image src={sdg7} alt="sdg"  className=" lg:hidden" />
                    </div>

                    

                </div>
            </div>
            

            <div>
                <TeamMembers />
            </div>
            <div className="px-4 bg-[#f0f0fb]"><GetStarted /></div> */}
            <Footer />
        </div>
    )
} 
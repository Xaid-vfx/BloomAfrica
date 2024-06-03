import Navbar from "@/components/navbar/Navbar"
import { Metadata } from "next"
import Image from "next/image"
import Woman from '../../assets/images/SmilingWoman2.png'
import WomanMobile from '../../assets/images/Smilingwomanmobile.png'
import Accreditors from "./Accreditors"
import GetStarted from "@/components/GetStartedBanner/GetStarted"
import Footer from "@/components/Footer/Footer"
import Qualifications from "./Qualifications"

export const metadata: Metadata = {
    title: 'Get Certified | Bloom'
}

export default function About() {
    return (
        <div className="bg-[#F0F0FB]">
            <Navbar color="white" />
            <div className="flex flex-col-reverse lg:flex-row">
                <div className="lg:w-[60%] flex flex-col items-start lg:py-20 py-10 lg:px-16 px-6">
                    <h1 className="hidden lg:block text-4xl font-semibold">
                        Earn a degree-level <br /> certification.
                    </h1>
                    <h1 className="lg:hidden text-2xl font-semibold leading-10">
                        Unlock Your Career Potential with Industry-Recognized Certifications
                    </h1>
                    <p className="text-sm leading-6 my-6">
                        Created by Africans, for Africans. Our program offers a decolonized curriculum tailored for immediate practical application. Learn the tools you need to become a master in your industry - from from an apprentice to founder and beyond. Bring your career to the next level with real-world growth strategies that actually work in Africa. Our programs are built for the future, packed with cutting-edge techniques and real-world applications.
                    </p>
                    <div className="bg-[#4A2C84] font-semibold text-sm text-white rounded-full px-6 py-4">Explore courses</div>
                </div>
                <div className="hidden lg:block lg:w-[40%] justify-center py-6 bg-[#C8AFEC]">
                    <Image src={Woman} alt="woman" width={400} />
                </div>
                <Image src={WomanMobile} alt="woman" className=" lg:hidden" />
            </div>
            <Accreditors />
            <Qualifications />
            <GetStarted />
            <Footer />
        </div>)
}
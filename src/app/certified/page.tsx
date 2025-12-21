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
    title: 'Get Certified | Prentis'
}

export default function About() {
    return (
        <div className="bg-[#F0F0FB]">
            <Navbar color="white" />
            <div className="flex flex-col-reverse lg:flex-row ms-auto me-auto max-w-[1500px]">
                <div className="lg:w-[60%] flex flex-col items-start lg:py-20 py-10 lg:px-16 px-6 ">
                    <h1 className="hidden lg:block text-4xl font-semibold">
                        Earn a degree-level <br /> certification.
                    </h1>
                    <h1 className="lg:hidden text-2xl font-semibold leading-10">
                        Unlock Your Career with Industry-Recognized Certifications
                    </h1>
                    <p className="text-lg leading-6 my-6">
                        We make it easier than ever for learners to earn qualifications and certifications. Simply enroll in a Bloom apprenticeship that aligns with your desired qualification level, complete the program, and achieve your goals!
                    </p>
                    <div className="bg-[#4A2C84] font-semibold text-sm text-white rounded-full px-6 py-4">Explore courses</div>
                </div>
                <div className="hidden lg:flex lg:w-[40%] justify-center py-6 bg-[#C8AFEC]">
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
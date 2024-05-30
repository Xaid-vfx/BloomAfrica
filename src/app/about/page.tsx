import Navbar from "@/components/navbar/Navbar"
import Image from "next/image"
import UserImage from "../../assets/images/user.jpg"
import Milestones from "@/components/About/Milestones"
import Footer from "@/components/Footer/Footer"
import { Metadata } from "next"
import AboutHero from "@/components/About/AboutHero"
import Beliefs from "@/components/About/Beliefs"
import FoundingTeam from "@/components/About/FoundingTeam"
import gray from '../../assets/images/gray.png'
import GetStarted from "@/components/GetStartedBanner/GetStarted"

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
            <div className="py-16 px-4 lg:hidden">
                <h2 className="font-semibold text-lg my-2">What we do</h2>
                <p className="font-light text-sm leading-6">Explore job opportunities on the platform that align with your current job and chosen qualification. Explore job opportunities on the platform that align with your current job and chosen qualification. Explore job opportunities on the platform that align with your current job and chosen qualification.
                </p>
                <Image src={gray} alt="gray" width={100} className="w-full mt-10" />
            </div>
            <div>
                <FoundingTeam />
            </div>
            <div className="px-4 pb-16 bg-[#f0f0fb]"><GetStarted /></div>
            <Footer />
        </div>
    )
} 
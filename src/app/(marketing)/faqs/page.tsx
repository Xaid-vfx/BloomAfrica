import Footer from "@/components/Footer/Footer";
import GetStarted from "@/components/GetStartedBanner/GetStarted";
import EYNTK from "@/components/Landing/EYNTK";
import Navbar from "@/components/Navbar/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'FAQs | Prentis',
    description: 'Frequently asked questions about Prentis apprenticeship programs in Nigeria. Learn about HND, ND, NABTEB qualifications, program locations, trainer requirements, and how to get started.',
}

export default function Faqs() {
    return (
        <div>
            <Navbar />
            <EYNTK />
            <div className="px-4 pb-16 bg-[#f0f0fb]"><GetStarted /></div>
            <Footer />
        </div>
    )
}
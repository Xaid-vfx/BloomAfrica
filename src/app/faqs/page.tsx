import Footer from "@/components/Footer/Footer";
import GetStarted from "@/components/GetStartedBanner/GetStarted";
import EYNTK from "@/components/Landing/EYNTK";
import Navbar from "@/components/navbar/Navbar";

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
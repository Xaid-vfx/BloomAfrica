import Image from "next/image";
import ReasonCard from "./ReasonCard";
import star from '../../assets/images/4SidedStar.png'
import r1 from "../../assets/images/r1.png"
import r2 from "../../assets/images/r2.png"
import r3 from "../../assets/images/r3.png"
import Dots from "../../assets/images/Dots.png"

export default function MoreReasons() {
    return (
        <div className="py-10 px-4 relative bg-white">
            <h1 className="text-center font-semibold text-xl mb-8 lg:text-3xl lg:mb-4">More reasons to choose <br /> Prentis</h1>
            <Image src={star} alt="" width={25} className="absolute top-8 left-5 lg:hidden" />
            <Image src={Dots} alt="" width={90} className="absolute top-0 left-0" />
            <Image src={Dots} alt="" width={70} className="absolute bottom-0 right-0 rotate-180" />
            <Image src={star} alt="" width={35} className="absolute top-8 right-96 rotate-[65deg] hidden lg:block" />
            <Image src={star} alt="" width={25} className="absolute top-20 right-52 rotate-[65deg] hidden lg:block" />
            <div className="lg:flex lg:px-10">
                <ReasonCard image={r1} title="Earn a Professional Qualification" content="Our rigorous apprenticeship program is  designed to equip you with the skills and knowledge you need to excel in your chosen field. Upon successful completion of your apprenticeship, you will be awarded a recognized diploma qualification, a valuable asset that will set you apart in the competitive job market." />
                <ReasonCard image={r2} title="Gain Real-World Experience" content="In contrast to traditional schooling, Prentis's apprenticeships prioritise hands-on learning. You will gain practical experience through carefully curated work placements in reputable businesses that align with your career aspirations. " />
                <ReasonCard image={r3} title="Guaranteed Settlement" content="Unlike traditional apprenticeships where apprentices are often left vulnerable to exploitation, Prentis protects your interests by guaranteeing your starting capital in full. Upon successful completion of your apprenticeship, we ensure that the full balance is transferred to your chosen account, directly from your employer " />
            </div>
        </div>
    )
}
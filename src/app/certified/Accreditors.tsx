import Image from "next/image";
import AfricanUnion from '../../assets/images/AfricanUnion.png'
import Pearson from '../../assets/images/Pearson.png'
import EduQual from '../../assets/images/EduQual.png'
import ofqual from '../../assets/images/ofqual.png'
import cityguilds from '../../assets/images/cityguilds.png'
import Marquee from "react-fast-marquee";

export default function Accreditors() {
    return (
        <div className="lg:my-16 my-10">
            <h1 className="text-center font-semibold">
                Prospective Accreditors
            </h1>
            <div className="hidden lg:flex my-4 w-full gap-14 justify-center items-center">
                <Image src={AfricanUnion} alt="" width={150} />
                <Image src={Pearson} alt="" width={150} />
                <Image src={EduQual} alt="" width={150} />
                <Image src={ofqual} alt="" width={150} />
                <Image src={cityguilds} alt="" width={120} />
            </div>
            <div className="lg:hidden my-6">
                <Marquee gradient={false} speed={40} pauseOnClick={true} autoFill={true} className="mt-4 mb-8">
                    <Image src={AfricanUnion} alt="" width={90} className="mx-4" />
                    <Image src={Pearson} alt="" width={90} className="mx-4" />
                    <Image src={EduQual} alt="" width={90} className="mx-4" />
                    <Image src={ofqual} alt="" width={90} className="mx-4" />
                    <Image src={cityguilds} alt="" width={70} className="mx-4" />
                </Marquee>
            </div>
        </div>
    )
}
import Image from "next/image";
import Harvard from '../../assets/images/harvard.png'
import Oxford from '../../assets/images/oxford.png'
import Lagos from '../../assets/images/lagos.png'
import Bank from '../../assets/images/Bank.png'
import UN from '../../assets/images/un-logo.png'
import Marquee from "react-fast-marquee";

export default function Banner() {
    return (
        <div className="">
            <h1 className="hidden lg:block text-center font-semibold">
                Supported by Researchers at
            </h1>
            <h1 className="lg:hidden text-[#7C8493] text-sm text-center font-medium">
                Supported by Researchers at
            </h1>
            <div className="hidden lg:flex  my-6  w-full gap-14 justify-center items-center">
                <Image src={Harvard} alt="" width={200} />
                <div className="flex items-center gap-2">
                    <Image src={UN} alt="" width={50} />
                    <div className="text-2xl font-medium leading-7">
                        UNITED <br /> NATIONS
                    </div>
                </div>
                <Image src={Oxford} alt="" width={200} />
                <Image src={Bank} alt="" width={200} />
                <Image src={Lagos} alt="" width={200} />
            </div>
            <div className="lg:hidden">
                <Marquee gradient={false} speed={40} pauseOnClick={true} autoFill={true} className="mt-4 mb-8">
                    <Image src={Harvard} alt="" width={150} className="px-4" />
                    <div className="flex items-center gap-2 px-4">
                        <Image src={UN} alt="" width={40} />
                        <div className="text-base font-medium leading-5">
                            UNITED <br /> NATIONS
                        </div>
                    </div>
                    <Image src={Oxford} alt="" width={150} className="px-4" />
                    <Image src={Bank} alt="" width={150} className="px-4" />
                    <Image src={Lagos} alt="" width={150} className="px-4" />
                </Marquee>
            </div>
        </div>
    )
}
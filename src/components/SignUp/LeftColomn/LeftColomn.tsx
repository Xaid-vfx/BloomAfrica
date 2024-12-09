import Image from "next/image";
import SideImage from '../../../assets/images/SignIn/LeftIllustration.png'
import Logo from '../../../assets/images/Logo.png'

export default function LeftColomn() {
    return (
        <div className="hidden lg:flex overflow-hidden py-8 px-10 bg-[#F5F5F5] w-[45%] flex-col">
            <div className="w-full max-w-[640px] mx-auto">
                <div className="flex items-center">
                    <Image src={Logo} alt="" width={60} />
                    <p className="text-3xl">Bloom</p>
                </div>
                <div className="py-10 flex justify-center">
                    <Image src={SideImage} alt="" width={500} />
                </div>
            </div>
        </div>
    )
}
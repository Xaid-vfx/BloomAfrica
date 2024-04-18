import Image from "next/image";
import Harvard from '../../assets/images/harvard.png'
import Oxford from '../../assets/images/oxford.png'
import Lagos from '../../assets/images/lagos.png'
import UN from '../../assets/images/un-logo.png'

export default function Banner() {
    return (
        <div className="hidden lg:block">
            <h1 className="text-center font-semibold">
                Endorsed by experts in leading Institutions & Organizations
            </h1>
            <div className="my-6 flex w-full gap-14 justify-center items-center">
                <Image src={Harvard} alt="" width={200} />
                <Image src={Oxford} alt="" width={200} />
                <Image src={Lagos} alt="" width={200} />
                <div className="flex items-center gap-2">
                    <Image src={UN} alt="" width={50} />
                    <div className="text-2xl font-medium leading-7">
                        UNITED <br /> NATIONS
                    </div>
                </div>

            </div>
        </div>
    )
}
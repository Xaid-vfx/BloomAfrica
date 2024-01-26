import Image from "next/image";
import User from '../../assets/images/user.jpg'
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

type Props = {
    name: string;
    designation: string;
    twitter: string;
    linkedin: string;
    image: any;
}

export default function FoundingCard(props: Props) {
    return (
        <div className="bg-white my-3 lg:my-10 mx-2 flex flex-col justify-center items-center py-10 rounded-xl box_shadow lg:px-24 lg:py-12 lg:w-1/3">
            <Image src={props.image} alt="" width={120} className="border rounded-full mb-4" />
            <h2 className="font-medium text-xl lg:text-2xl lg:mb-3">{props.name}</h2>
            <p className="text-sm mt-1 text-[#97999B]">{props.designation}</p>
            <div className="mt-5 flex gap-2 text-white lg:mt-2">
                <a href={props.twitter} className="bg-black p-3 text-xs rounded cursor-pointer"><FaXTwitter /></a>
                <a href={props.linkedin} className="bg-black p-3 text-xs rounded cursor-pointer"><FaLinkedinIn /></a>

            </div>
        </div>
    )
}
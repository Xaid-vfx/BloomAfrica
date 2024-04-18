'use client'
import Image from "next/image";
import Logo from '../../assets/images/stack-line.png';
import { FaArrowRightLong } from "react-icons/fa6";

type Props = {
    id: string;
    title: string;
    type: string;
    location: string;
    salary: string;
    description: string;
    responsibilities: string;
    who_you_are: string;
    extras: string;
}

export default function CategoryCard(props: Props) {
    return (
        <div className="py-8 px-6 my-4 mx-2 box_shadow bg-white rounded-lg cursor-pointer">
            <div className="flex justify-between items-center">
                <Image src={Logo} alt=" " width={50} />
            </div>
            <h1 className="text-lg font-medium mt-4">{props.title}</h1>

            <p className="w-full flex items-center gap-2 hover:underline text-xs my-3 leading-6 text-[#515B6F]">
                200 Jobs Available <FaArrowRightLong />
            </p>



        </div>
    )
}
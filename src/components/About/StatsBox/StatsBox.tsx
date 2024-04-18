import Image from "next/image";
import { type } from "os"
import { FiAward } from "react-icons/fi";

type Props = {
    content: string;
    image: any;
}

export default function StatsBox(props: Props) {
    return (
        <div className="flex items-center justify-between gap-1 bg-white text-purple-800 px-2 py-2 font-semibold text-[.50rem] rounded-md box_shadow lg:text-sm lg:py-4 cursor-pointer hover:scale-105 duration-200 lg:px-4 lg:rounded-xl">
            {props.image ? <><Image src={props.image} alt="" width={16} className="lg:hidden" />
                <Image src={props.image} alt="" width={25} className="hidden lg:block" /></> : ""}
            {props.com}
            <span>{props.content}</span>
        </div>
    )
}
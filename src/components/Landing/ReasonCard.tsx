import Image from "next/image";

type Props = {
    image: any;
    title: string;
    content: string;
}

export default function ReasonCard(props: Props) {
    return (
        <div className="p-7 box_shadow my-8 rounded-2xl box_shadow2 lg:mx-2 lg:w-1/3">
            <div className="lg:flex lg:justify-between lg:items-start">
                <h2 className="font-semibold mb-4 text-lg w-1/2">{props.title}</h2>
                <Image src={props.image} alt="" width={50} className="hidden lg:block" />
            </div>
            <p className="text-sm leading-6">{props.content}</p>
        </div>
    )
}
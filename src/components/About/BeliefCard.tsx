import Image from "next/image";

type Props = {
    name: string;
    para: string;
    image: any;
}

export default function BeliefCard(props: Props) {
    return (
        <div className="bg-white text-black rounded-xl py-10 px-8 my-4 flex flex-col justify-center items-center lg:mx-2 lg:py-12 lg:w-1/3">
            <Image src={props.image} alt="Mission" width={80}></Image>
            <h2 className="font-semibold text-lg text-center my-5 lg:text-2xl">Our {props.name}</h2>
            <p className="font-light text-sm text-center">{props.para}</p>
        </div>
    )
}
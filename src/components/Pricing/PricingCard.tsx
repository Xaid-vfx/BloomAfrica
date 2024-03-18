import Image from "next/image";
import check from '../../assets/images/check.png'

type Props = {
    color: string;
    name: string;
    description: string;
}


export default function PricingCard(props: Props) {

    function planColor() {
        if (props.name == "Basic") return "bg-[#897DD3]";
        else if (props.name == "Silver") return "bg-[#1B2124]";
        else if (props.name == "Gold") return "bg-[#84BBCF]";
    }

    return (
        <div className="my-8 rounded-xl text-left text-[#97999B] box_shadow lg:w-1/3 lg:mx-6">
            <div className={`rounded-t-xl px-10 py-6 ${planColor()} text-white`}>
                <p className="pb-4 text-lg lg:text-2xl lg:font-medium">{props.name}</p>
                <p className="lg:text-xl">{props.description}</p>
            </div>
            <div className="px-10 py-6">
                <p className="text-xl blur-sm"><span className="text-black">$0/ </span> month</p>
                <div className="mt-6 blur-sm">
                    <p className="flex items-center gap-2 text-sm my-3"><Image src={check} alt="" width={12} />Job board access</p>
                    <p className="flex items-center gap-2 text-sm my-3"><Image src={check} alt="" width={12} />Job board access</p>
                    <p className="flex items-center gap-2 text-sm my-3"><Image src={check} alt="" width={12} />Job board access</p>
                    <p className="flex items-center gap-2 text-sm my-3"><Image src={check} alt="" width={12} />Job board access</p>
                    <p className="flex items-center gap-2 text-sm my-3"><Image src={check} alt="" width={12} />Job board access</p>
                    <p className="flex items-center gap-2 text-sm my-3"><Image src={check} alt="" width={12} />Job board access</p>
                    <p className="flex items-center gap-2 text-sm my-3"><Image src={check} alt="" width={12} />Job board access</p>
                </div>
                <a href="/">
                    <button className="text-white bg-[#4A2C84] rounded-3xl py-3 w-full mt-4 mb-2">Get Started</button>
                </a>

            </div>
        </div>
    )
}
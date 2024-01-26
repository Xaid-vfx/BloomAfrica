import FoundingCard from "./FoundingCard";
import Balls from "../../assets/images/Group 18.png"
import Image from "next/image";
import Zaid from "../../assets/images/team/Zaid.jpeg";
import Ernest from "../../assets/images/team/Ernest.jpeg";
import David from "../../assets/images/team/David.jpg";

export default function FoundingTeam() {
    return (
        <div className="lg:h-[90vh] lg:bg-[#f0f0fb] relative">
            <Image src={Balls} alt="balls" width={80} className="absolute right-0 top-0 hidden lg:block" />
            <h2 className="text-center text-lg font-semibold lg:text-5xl lg:pt-24">Our  Team</h2>
            <div className="flex flex-col justify-center lg:px-24 lg:flex-row lg:my-6">
                <FoundingCard image={David} name="David Onadipe" designation="Founder/ CEO" twitter="https://twitter.com/DavidBL8M" linkedin="https://www.linkedin.com/in/davidonadipe/" />
                <FoundingCard image={Zaid} name="Mohd Zaid" designation="Co-founder/ CTO" twitter="https://twitter.com/okzaid" linkedin="https://www.linkedin.com/in/mohd-zaid-3889801b7/" />
                <FoundingCard image={Ernest} name="Ernest Ikeh" designation="Product Designer" twitter="https://x.com/ernestikeh4" linkedin="Linkedin: https://www.linkedin.com/in/ernest-ikeh" />
            </div>
        </div>
    )
}
import TeamMemberCard from "./TeamMember";
import Balls from "../../assets/images/Group 18.png"
import Image from "next/image";
import Zaid from "../../assets/images/team/Zaid.jpeg";
import Ernest from "../../assets/images/team/Ernest.jpeg";
import David from "../../assets/images/team/David.jpg";


export default function TeamMembers() {
    return (
        <div className="lg:bg-[#f0f0fb] relative lg:pb-10">
            <div className="ms-auto me-auto max-w-[1500px]">
                <Image src={Balls} alt="balls" width={80} className="absolute right-0 top-0 hidden lg:block" />
                <h2 className="text-center text-xl font-semibold lg:text-5xl lg:pt-24">Our Team</h2>
                <div className="lg:flex py-6 lg:py-0 px-4 grid grid-cols-2 flex-col lg:px-24 lg:flex-row lg:my-6 lg:flex-wrap justify-center">
                    <TeamMemberCard image={David} name="David Onadipe" designation="Founder/ CEO" twitter="https://twitter.com/DavidBL8M" linkedin="https://www.linkedin.com/in/davidonadipe/" />
                    <TeamMemberCard image={Zaid} name="Mohd zaid" designation="Co-founder/ CTO" twitter="https://twitter.com/okzaid" linkedin="https://www.linkedin.com/in/mohd-zaid-3889801b7/" />
                    <TeamMemberCard image={Ernest} name="Ernest Ikeh" designation="Product Designer" twitter="https://x.com/ernestikeh4" linkedin="https://www.linkedin.com/in/ernest-ikeh" />
                </div>
            </div>
        </div>
    )
}
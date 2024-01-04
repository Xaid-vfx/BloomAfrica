import Navbar from "@/components/navbar/Navbar"
import Image from "next/image"
import UserImage from "../../assets/images/user.jpg"
import Milestones from "@/components/About/Milestones"
import Footer from "@/components/Footer/Footer"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'About | Bloom'
}

export default function About() {
    return (
        <div>
            <Navbar />
            <div className="">
                <div className="px-7 py-8 w-full xl:my-40 xl:flex xl:px-32 xl:items-stretch xl:justify-between">
                    <h1 className="text-4xl font-bold my-2 xl:text-5xl xl:text-[56px] xl:px-10 xl:w-1/2 xl:pt-2">Bloom is Africa&apos;s <br className="hidden xl:block" /> new frontier of Education.</h1>
                    <p className="my-6 opacity-70 text-base xl:px-10 xl:text-xl xl:w-1/2">
                        At Bloom, our mission is to empower Africans by creating accessible local opportunities for personal and economic growth.
                        <br /> <br />
                        We are committed to fostering stable development, skill enhancement, and entrepreneurship, enabling individuals to shape a brighter future for themselves and their communities.
                        <br /> <br />
                        We envision a world where the informal economy becomes a vibrant and sustainable engine of growth.
                    </p>
                </div>
                <div className="bg-[#eeeded] min-h-screen px-7 py-16 w-full xl:px-52 xl:items-stretch xl:py-20">
                    <div>
                        <h1 className="text-4xl xl:text-5xl text-[#000000] font-bold">
                            <span className="text-[#725998]">Who</span> we are?
                        </h1>
                        <p className="my-5 text-base font-light lg:text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore illo saepe veniam! Deserunt, eaque dolorem magni exercitationem consequatur adipisci aliquam odit possimus, cumque, dolore eveniet inventore facilis recusandae incidunt quaerat.</p>
                    </div>
                    <div className="mt-20">
                        <h1 className=" text-4xl xl:text-5xl text-[#000000] font-bold">
                            <span className="text-[#a98eba]">What</span> we do?
                        </h1>
                        <p className="my-5 text-base font-light lg:text-lg">Bloom is an online platform that allows workers to turn any ordinary job opportunity into an valuable and exciting apprenticeship that leads to recognized qualification, accelerating career growth and fostering skilled professionals.</p>
                    </div>
                    <div className="mt-20">
                        <h1 className="text-4xl xl:text-5xl text-[#000000] font-bold">
                            <span className="text-[#5baaa7]">How</span> we do?
                        </h1>
                        <p className="my-5 text-base font-light lg:text-lg">By partnering with Africa's top universities and global education and tech leaders, we create the best education programs available, even on the global standard. We then merge these programs with our job board platform to provide informal workers and MSME owners with easy access to the best education, empowering them to upskill themselves, grow their businesses, and connect with a world of employment opportunities</p>
                    </div>
                </div>
                <div className="bg-[#] py-16 xl:py-20">
                    <div className="px-7 pb-8 w-full xl:flex xl:px-32 xl:items-center xl:justify-center text-justify">
                        <h1 className="text-4xl font-bold my-2 xl:text-5xl xl:px-10 xl:w-1/2 xl:pt-2 xl:text-right">
                            <span className="text-[#725998]">O</span>
                            <span className="text-[#a98eba]">u</span>
                            <span className="text-[#5baaa7]">r </span>
                            Vision</h1>
                        <p className="my-6 opacity-70 text-base xl:px-10 xl:text-xl xl:w-1/2 font-light ">
                            At Bloom, our vision is to become the global leader in providing innovative education solutions that empower informal workers and MSME owners in emerging economies to unlock their full potential. Our platform will serve as the catalyst for change, enabling users to upskill themselves, grow their businesses, and connect with a world of employment opportunities.
                        </p>
                    </div>
                    <div className="px-7 w-full xl:flex xl:px-32 xl:items-center xl:justify-between text-justify">
                        <h1 className="text-4xl font-bold my-2 xl:text-5xl xl:px-10 xl:w-1/2 xl:pt-2 xl:text-right">
                            <span className="text-[#725998]">O</span>
                            <span className="text-[#a98eba]">u</span>
                            <span className="text-[#5baaa7]">r </span> Mission</h1>
                        <p className="my-6 opacity-70 text-base font-light xl:px-10 xl:text-xl xl:w-1/2">
                            At Bloom, our mission is to empower Africans by creating accessible local opportunities for personal and economic growth.

                            We are committed to fostering stable development, skill enhancement, and entrepreneurship, enabling individuals to shape a brighter future for themselves and their communities.

                            We envision a world where the informal economy becomes a vibrant and sustainable engine of growth.

                        </p>
                    </div>
                    <div className="px-7 w-full xl:flex xl:px-32 xl:items-center xl:justify-between text-justify">
                        <h1 className="text-4xl font-bold my-2 xl:text-5xl xl:px-10 xl:w-1/2 xl:pt-2 xl:text-right">
                            <span className="text-[#725998]">O</span>
                            <span className="text-[#a98eba]">u</span>
                            <span className="text-[#5baaa7]">r </span> Values</h1>
                        <p className="my-6 opacity-70 font-light text-base xl:px-10 xl:text-xl xl:w-1/2">
                            Our team at Bloom are convinced that we can harness Africa's informal economy to entirely reshape the global narrative. Our company's growth presents an exciting opportunity, but it also requires our commitment. To ensure we remain true to our mission, we have established five enduring values that shape our work culture and influence our daily choices.
                        </p>
                    </div>
                </div>
                <div className="bg-[#2E3238] min-h-screen px-7 py-28 w-full xl:px-52 xl:items-stretch">
                    <h1 className="text-4xl xl:text-5xl text-[#F3F4F6] font-semibold">
                        Our Team.
                        <span className="text-slate-400"> Meet our amazing
                            <br className="hidden xl:block" /> Founding Team at Bloom</span>
                    </h1>
                    <div className="xl:flex xl:gap-28 xl:justify-between text-slate-200 tracking-wider">
                        <div className="py-2 my-14">
                            <Image src={UserImage} height={100} width={100} alt="David" className="mb-6 w-full xl:w-auto rounded-xl" />
                            <div>
                                <h2 className="text-xl font-semibold">David</h2>
                                <p className="font-light text-lg my-2">Founder</p>
                                <p className="text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus eos similique rem sit aperiam dolore eaque, consequatur odio repudiandae, quibusdam eveniet fuga placeat corporis mollitia sapiente harum. Iure, cumque exercitationem.</p>
                            </div>
                        </div>
                        <div className="pt-2 mt-14">
                            <Image src={UserImage} height={100} width={100} alt="David" className="mb-6 w-full xl:w-auto  rounded-xl" />
                            <div>
                                <h2 className="text-xl font-semibold">Zaid</h2>
                                <p className="font-light text-lg my-2">Technical Co-founder</p>
                                <p className="text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus eos similique rem sit aperiam dolore eaque, consequatur odio repudiandae, quibusdam eveniet fuga placeat corporis mollitia sapiente harum. Iure, cumque exercitationem.</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="bg-[#1c1e29] min-h-screen px-7 py-28 w-full xl:px-52 xl:items-stretch">
                    <h1 className="text-4xl xl:text-5xl text-[#cecece] font-semibold">
                        Milestones.<span className="text-[#78797e]"> Check our Progress<br />
                            over time</span>
                    </h1>
                    <Milestones />
                </div>
            </div>
            <Footer />
        </div>
    )
}
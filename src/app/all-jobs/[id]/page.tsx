import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import Logo from '../../../assets/images/Jobs/Company Logo.png'
import getAJob from "@/lib/getAJob/getAJob";
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Button from "@/components/Button/Button";
import getUser from "@/lib/getUser/getUser";


export default async function Page({ params,
    searchParams,
}: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) {

    const job = await getAJob(searchParams?.id)
    const user = await getUser()
    const supabase = createClientComponentClient()

    return (
        <div>
            <Navbar />
            {job != null ? <div>
                <div className="flex items-center justify-between border-2 px-6 py-4 my-6 mt-20 mx-20">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-6">
                            <Image src={Logo} alt="logo" width={70} />
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-xl font-semibold">{job != null && job[0]?.title}</h1>
                                <div className="flex text-sm text-[#515B6F] gap-2 items-baseline">
                                    <p>TechMe</p>
                                    <p>. {job != null && job[0]?.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex gap-2">
                            <button className=" text-black border border-black py-3 text-center font-medium rounded-3xl px-14" >Save</button>
                            <Button user={user?.id} id={searchParams?.id}></Button>
                        </div>
                    </div>

                </div>
                <div className="flex justify-between px-20 pb-20">
                    <div className="w-[60%]">
                        <div className="mt-10">
                            <h1 className="text-2xl font-semibold">Description</h1>
                            <p className="mb-7 mt-2 text-[#7C8493] text-sm">{job != null && job[0]?.description}</p>
                        </div>
                        <div className="">
                            <h1 className="text-2xl font-semibold">Responsibilities</h1>
                            <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null && job[0]?.responsibilities.replace("\n", "<br/>")}</p>
                        </div>
                        <div className="">
                            <h1 className="text-2xl font-semibold">Who You Are</h1>
                            <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null && job[0]?.who_you_are}</p>
                        </div>
                        <div className="">
                            <h1 className="text-2xl font-semibold">Nice-To-Haves</h1>
                            <p className="mb-7 my-2 text-[#7C8493] text-sm">{job != null && job[0]?.extras}</p>
                        </div>
                    </div>
                    <div className="w-[30%] mt-10">
                        <h1 className="text-2xl font-medium">About this Role</h1>
                        <div className="w-full bg-gray-200 h-1.5 mt-4 mb-2">
                            <div className=" bg-green-500 h-1.5 rounded-full w-1/2"></div>
                        </div>
                        <p className="text-sm text-[#7C8493]"><span className="text-black font-semibold">5 Applied</span> of 10 capacity</p>
                        <div className="flex justify-between mt-10">
                            <p className="text-sm text-[#515B6F]">Job Type</p>
                            <p className="text-sm font-semibold">{job != null && job[0]?.type}</p>
                        </div>
                        <div className="flex justify-between my-4">
                            <p className="text-sm text-[#515B6F]">Compensation</p>
                            <p className="text-sm font-semibold">{job != null && job[0]?.salary}</p>
                        </div>

                    </div>
                </div>
            </div> : ""}
            <Footer />
        </div>
    )

}
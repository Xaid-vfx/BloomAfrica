import Image from "next/image";
import Bloom from '../../../assets/images/BloomLogo.png'
import { useState } from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { LuClipboardList } from "react-icons/lu";
import { TbMessage } from "react-icons/tb";
import { PiBuildings } from "react-icons/pi";
import { SignOut } from "@/lib/Signout/Signout";
import { useRouter } from "next/navigation";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

type Props = {
    handleChangeTabIndex: any;
    currTabIndex: number;
}


export default function Sidebar(props: Props) {
    const router = useRouter()
    function handleClickLogout() {
        SignOut()
        router.push('/signup')
    }

    return (
        <div className="w-[20%] h-screen bg-[#F8F8FD] hidden lg:flex justify-between">
            <div className=" py-10 px-5 w-full">
                <Image src={Bloom} width={120} height={100} />

                <div className="flex flex-col justify-center my-6">
                    <div onClick={() => { props.handleChangeTabIndex(0) }} className={`my-2 font-medium py-3 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 0 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                        <BiHomeAlt2 className="text-xl" />
                        <p className="text-sm ">Dashboard</p>
                    </div>
                    {/* <div onClick={() => { props.handleChangeTabIndex(1) }} className={`my-2 font-medium py-3 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 1 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                        <TbMessage className="text-xl" />
                        <p className="text-sm ">Messages</p>
                    </div> */}
                    <div onClick={() => { props.handleChangeTabIndex(2) }} className={`my-2 font-medium py-3 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 2 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                        <PiBuildings className="text-xl" />
                        <p className="text-sm ">Company Profile</p>
                    </div>
                    <div onClick={() => { props.handleChangeTabIndex(3) }} className={`my-2 font-medium py-3 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 3 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                        <LuClipboardList className="text-xl" />
                        <p className="text-sm ">Job Listing</p>
                    </div>
                    <div onClick={() => { props.handleChangeTabIndex(5) }} className={`my-2 font-medium py-3 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 5 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                        <IoChatboxEllipsesOutline className="text-xl" />
                        <p className="text-sm ">Messages</p>
                    </div>
                </div>
                <button onClick={() => { handleClickLogout() }} className="text-xs text-white bg-[#4A2C84] py-3 px-6 rounded-xl font-semibold ml-10 absolute bottom-10">Log out</button>
            </div>
            <div
                className="h-full min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20"></div>
        </div>
    )
}
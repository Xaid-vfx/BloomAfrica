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
import UnreadMessagesDot from "@/components/UnreadMessagesDot/UnreadMessagesDot";
import { BsBuildingUp } from "react-icons/bs";

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
        

        
            <div className='hidden lg:flex flex-col border-gray-300 border-[1px] h-full w-full rounded-t-xl bg-white relative '>
                
                    <div className="flex flex-col justify-center my-6">
                        <div onClick={() => { props.handleChangeTabIndex(0) }} className={`my-2 font-medium py-5 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 0 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                            <BiHomeAlt2 className="text-xl" />
                            <p className="text-sm ">Dashboard</p>
                        </div>
                        {/* <div onClick={() => { props.handleChangeTabIndex(1) }} className={`my-2 font-medium py-5 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 1 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                            <TbMessage className="text-xl" />
                            <p className="text-sm ">Messages</p>
                        </div> */}
                        <div onClick={() => { props.handleChangeTabIndex(2) }} className={`my-2 font-medium py-5 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 2 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                            <PiBuildings className="text-xl" />
                            <p className="text-sm ">Company Profile</p>
                        </div>
                        <div onClick={() => { props.handleChangeTabIndex(3) }} className={`my-2 font-medium py-5 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 3 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                            <LuClipboardList className="text-xl" />
                            <p className="text-sm ">Job Listing</p>
                        </div>
                        <div onClick={() => { props.handleChangeTabIndex(5) }} className={`my-2 font-medium py-5 cursor-pointer px-4 flex gap-2 items-center  ${props.currTabIndex == 5 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                            <IoChatboxEllipsesOutline className="text-xl" />
                            <p className="text-sm ">Messages</p>
                            <UnreadMessagesDot userId={props.user?.id} />
                        </div>
                        <div onClick={() => { props.handleChangeTabIndex(6) }}
                            className={`my-2 font-medium py-5 cursor-pointer px-4 flex gap-2 items-center  
                            ${props.currTabIndex == 6 ? "text-[#4A2C84] font-semibold bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                            <BsBuildingUp className="text-xl" />
                            <p className="text-sm">Bank Details</p>
                        </div>
                    </div>
                <button onClick={() => { handleClickLogout() }} className="text-sm text-[#4A2C84] bg-[#ae9ece] py-3 px-6 rounded-2xl font-semibold mx-5 xl:mx-10 absolute bottom-14 left-0 right-0">Log out</button>
            </div>  
          
            

    )
}
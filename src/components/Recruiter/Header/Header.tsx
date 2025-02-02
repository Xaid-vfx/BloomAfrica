import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { useState } from "react";
import Image from "next/image";
import Bloom from '../../../assets/images/BloomLogo.png'
import { BiHomeAlt2, BiMessage } from "react-icons/bi";
import { PiBuildings } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { BsBuildingUp } from "react-icons/bs";

type Props = {
    name: string
    handleChangeTabIndex: any
    currTabIndex: number
}

export default function Header(props: Props) {
    const [showNav, setshowNav] = useState(false)

    function handleChangeTabIndex(index: any) {
        props.handleChangeTabIndex(index)
        setshowNav(false)
    }

    if (showNav) {
        return (
            <>
                <div className="lg:hidden flex justify-between px-3 py-3 items-center">
                    <HiOutlineMenuAlt2 className="text-2xl" onClick={() => { setshowNav(true) }} />
                    <div>
                        <p className="text-sm mb-1">Company</p>
                        <p className="flex gap-2 items-center font-semibold">{props.name}<FaChevronDown /></p>
                    </div>
                    <div><IoNotificationsOutline className="text-xl" /></div>
                </div>
                <div id="sideBar" className="h-[110vh] bg-[#F8F8FD] w-full overflow-hidden fixed top-0 z-20 duration-200">

                    <div className="w-full px-6">
                        <div className="my-6 relative w-full">
                            <AiOutlineClose className="text-2xl absolute top-2 cursor-pointer " onClick={() => { setshowNav(false) }} />
                            <div className="flex justify-center w-full"><Image src={Bloom} width={120} height={100} /></div>
                        </div>

                        <div className="flex flex-col justify-center my-3">
                            <div onClick={() => { handleChangeTabIndex(0) }} className={`  py-3 cursor-pointer px-4 flex gap-4 items-center  ${props.currTabIndex == 0 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <BiHomeAlt2 className="text-xl" />
                                <p className=" ">Dashboard</p>
                            </div>
                            <div onClick={() => { handleChangeTabIndex(2) }} className={`my-1 py-3 cursor-pointer px-4 flex gap-4 items-center  ${props.currTabIndex == 2 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <PiBuildings className="text-xl" />
                                <p className="">Company Profile</p>
                            </div>
                            <div onClick={() => { handleChangeTabIndex(3) }} className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${props.currTabIndex == 3 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <LuClipboardList className="text-xl" />
                                <p className="">Job Listing</p>
                            </div>
                            <div onClick={() => { handleChangeTabIndex(5) }} className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${props.currTabIndex == 5 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <BiMessage className="text-xl" />
                                <p className="">Messages</p>
                            </div>
                            <div onClick={() => { handleChangeTabIndex(6) }}
                                className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${props.currTabIndex == 6 ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <BsBuildingUp className="text-xl" />
                                <p className="text-sm">Bank Details</p>
                            </div>
                        </div>
                    </div>
                    <hr className="h-px bg-gray-200 border-0 mt-6 mb-4"></hr>
                    <div onClick={() => { handleChangeTabIndex(4) }} className="text-base font-medium flex justify-center w-full">
                        <p className="text-white bg-[#4A2C84] w-full mx-4 text-center py-3 px-6 rounded-2xl">+ Post Apprenticeship</p>
                    </div>
                </div>
            </>
        )
    }
    return (
        <div className='mb-5 bg-white'>
            <div className="hidden lg:flex px-8 py-4 justify-between items-center ">
                <div className='flex flex-row'>
                    <div className='mr-24'>
                        <Image src={Bloom} width={120} height={100} />
                    </div>
                    <div>
                        <p className="text-sm">Company</p>
                        <p className="font-semibold">{props.name}</p>
                    </div>
                </div>
                <a onClick={() => { props.handleChangeTabIndex(4) }}><button className="text-sm text-white bg-[#4A2C84] py-3 px-6 rounded-2xl font-semibold">+ Post Apprenticeship</button></a>
            </div>
            <div className="lg:hidden flex justify-between px-3 py-3 items-center">
                <HiOutlineMenuAlt2 className="text-2xl" onClick={() => { setshowNav(true) }} />
                <div>
                    <p className="text-sm mb-1">Company</p>
                    <p className="flex gap-2 items-center font-semibold">{props.name}<FaChevronDown /></p>
                </div>
                <div><IoNotificationsOutline className="text-xl" /></div>
            </div>
            <hr className="h-px bg-gray-300 border-0"></hr>

        </div>

    )
}
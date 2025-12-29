'use client'

import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaChevronDown } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { useState } from "react";
import PrentisLogo from '@/components/Logo/PrentisLogo'
import { BiHomeAlt2, BiMessage } from "react-icons/bi";
import { PiBuildings } from "react-icons/pi";
import { LuClipboardList } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { BsBuildingUp } from "react-icons/bs";
import { useRouter, usePathname } from "next/navigation";

type Props = {
    name: string;
}

export default function Header({ name }: Props) {
    const [showNav, setShowNav] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        router.push(path);
        setShowNav(false);
    };

    if (showNav) {
        return (
            <>
                <div className="lg:hidden flex justify-between px-3 py-3 items-center">
                    <HiOutlineMenuAlt2 className="text-2xl" onClick={() => { setShowNav(true) }} />
                    <div>
                        <p className="text-sm mb-1">Company</p>
                    </div>
                </div>
                <div id="sideBar" className="h-[110vh] bg-[#F8F8FD] w-full overflow-hidden fixed top-0 z-20 duration-200">

                    <div className="w-full px-6">
                        <div className="my-6 relative w-full">
                            <AiOutlineClose className="text-2xl absolute top-2 cursor-pointer " onClick={() => { setShowNav(false) }} />
                            <div className="flex justify-center w-full"><PrentisLogo width={120} height={100} alt="Prentis Logo" /></div>
                        </div>

                        <div className="flex flex-col justify-center my-3">
                            <div onClick={() => { handleNavigation('/recruiter/dashboard') }} className={`  py-3 cursor-pointer px-4 flex gap-4 items-center  ${pathname === '/recruiter/dashboard' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <BiHomeAlt2 className="text-xl" />
                                <p className=" ">Dashboard</p>
                            </div>
                            <div onClick={() => { handleNavigation('/recruiter/company-profile') }} className={`my-1 py-3 cursor-pointer px-4 flex gap-4 items-center  ${pathname === '/recruiter/company-profile' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <PiBuildings className="text-xl" />
                                <p className="">Company Profile</p>
                            </div>
                            <div onClick={() => { handleNavigation('/recruiter/apprenticeships') }} className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${pathname === '/recruiter/apprenticeships' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <LuClipboardList className="text-xl" />
                                <p className="">My Apprenticeships</p>
                            </div>
                            <div onClick={() => { handleNavigation('/recruiter/messages') }} className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${pathname === '/recruiter/messages' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <BiMessage className="text-xl" />
                                <p className="">Messages</p>
                            </div>
                            <div onClick={() => { handleNavigation('/recruiter/bank-details') }}
                                className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${pathname === '/recruiter/bank-details' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <BsBuildingUp className="text-xl" />
                                <p className="text-sm">Bank Details</p>
                            </div>
                        </div>
                    </div>
                    <hr className="h-px bg-gray-200 border-0 mt-6 mb-4"></hr>
                    <div onClick={() => { handleNavigation('/recruiter/post-apprenticeship') }} className="text-base font-medium flex justify-center w-full">
                        <p className="text-white bg-[#4A2C84] w-full mx-4 text-center py-3 px-6 rounded-2xl">+ Post Apprenticeship</p>
                    </div>
                </div>
            </>
        )
    }
    return (
        <div className="bg-white py-4 px-6">
            <div className="flex justify-between items-center max-w-[1300px] mx-auto">
                <div className="flex items-center gap-4">
                    <HiOutlineMenuAlt2
                        className="text-2xl lg:hidden cursor-pointer"
                        onClick={() => setShowNav(true)}
                    />
                    <Image
                        src={Prentis}
                        width={120}
                        height={100}
                        alt="Prentis Logo"
                        className="cursor-pointer"
                        onClick={() => handleNavigation('/recruiter/dashboard')}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Image
                                src={Prentis}
                                width={40}
                                height={40}
                                alt="Profile"
                            />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium">{name}</p>
                            <p className="text-xs text-gray-500">Recruiter</p>
                        </div>
                        <FaChevronDown className="text-gray-500" />
                    </div>
                    <IoNotificationsOutline className="text-2xl" />
                </div>
            </div>
        </div>
    )
}
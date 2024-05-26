'use client'

import { useEffect, useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { BiHomeAlt2 } from "react-icons/bi"
import { FaChevronDown } from "react-icons/fa6"
import { HiOutlineMenuAlt2 } from "react-icons/hi"
import { IoNotificationsOutline } from "react-icons/io5"
import { LuClipboardList } from "react-icons/lu"
import { PiBuildings } from "react-icons/pi"
import Bloom from '../../assets/images/BloomLogo.png'
import Image from "next/image"
import { useRouter } from "next/navigation"

type Props = {
    name: string
}

export default function Header(props: Props) {
    const [showNav, setshowNav] = useState(false)
    const [currentPage, setCurrentPage] = useState("")

    const url = reverseString(globalThis.window?.location.href)
    const page = url?.split("/")

    function reverseString(str: string) {
        var splitString = str?.split("");
        var reverseArray = splitString?.reverse();
        var joinArray = reverseArray?.join("");
        return joinArray;
    }

    useEffect(() => {
        if (reverseString(page[0]) == 'applied') {
            setCurrentPage("applied")
        }
        else if (reverseString(page[0]) == 'saved') {
            setCurrentPage("saved")
        }
        else if (reverseString(page[0]) == 'edit') {
            setCurrentPage("edit")
        }
    }, [currentPage])

    if (showNav) {
        return (
            <>
                <div className="lg:hidden flex justify-between px-3 py-3 items-center">
                    <HiOutlineMenuAlt2 className="text-2xl" onClick={() => { setshowNav(true) }} />
                    <div>
                        <p className="text-sm mb-1">Company</p>

                    </div>
                    <div><IoNotificationsOutline className="text-xl" /></div>
                </div>
                <div id="sideBar" className="h-[110vh] bg-[#F8F8FD] w-full overflow-hidden fixed top-0 z-10 duration-200">

                    <div className="w-full px-6">
                        <div className="my-6 relative w-full">
                            <AiOutlineClose className="text-2xl absolute top-2 cursor-pointer " onClick={() => { setshowNav(false) }} />
                            <div className="flex justify-center w-full">
                                <Image src={Bloom} alt="logo" width={120} height={100} />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center my-3">
                            <a href="/seeker/applied" className={`  py-3 cursor-pointer px-4 flex gap-4 items-center  ${currentPage == 'applied' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <BiHomeAlt2 className="text-xl" />
                                <p className=" ">Applied Jobs</p>
                            </a>
                            <a href="/seeker/saved" className={`my-1 py-3 cursor-pointer px-4 flex gap-4 items-center  ${currentPage == 'saved' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <PiBuildings className="text-xl" />
                                <p className="">Saved Jobs</p>
                            </a>
                            <a href="/seeker/edit" className={` py-3 cursor-pointer px-4 flex gap-4 items-center  ${currentPage == 'edit' ? "text-[#4640DE] font-medium bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                                <LuClipboardList className="text-xl" />
                                <p className="">Edit Profile</p>
                            </a>
                        </div>
                    </div>
                    <hr className="h-px bg-gray-200 border-0 mt-6 mb-4"></hr>
                    {/* <div onClick={() => { }} className="text-base font-medium flex justify-center w-full">
                        <p className="text-white bg-[#4A2C84] w-full mx-4 text-center py-3 px-6 rounded-full">+ Post a Job</p>
                    </div> */}
                </div>
            </>
        )
    }
    return (
        <div>
            <div className="hidden lg:flex px-8 py-4 justify-between items-center">
                <div>
                    <p className="text-sm">Good Morning</p>
                    <p className="font-semibold">{props.name}</p>
                </div>
                <a href="/all-jobs"><button className="text-xs text-white bg-[#4A2C84] py-3 px-6 rounded-xl font-semibold">Explore Jobs</button></a>
            </div>
            <div className="lg:hidden flex justify-between px-3 py-3 items-center">
                <HiOutlineMenuAlt2 className="text-2xl" onClick={() => { setshowNav(true) }} />
                <div>
                    <p className="font-semibold my-2">Dashboard</p>

                </div>
                <div><IoNotificationsOutline className="text-xl" /></div>
            </div>
            <hr className="h-px bg-gray-200 border-0"></hr>
        </div>
    )
}
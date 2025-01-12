'use client'
import Image from "next/image";
import Bloom from '../../assets/images/BloomLogo.png'
import { useEffect, useState } from "react";
import { BiHomeAlt2 } from "react-icons/bi";
import { LuClipboardList } from "react-icons/lu";
import { TbMessage } from "react-icons/tb";
import { PiBuildings } from "react-icons/pi";
import { SignOut } from "@/lib/Signout/Signout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

type Props = {
    handleChangeTabIndex: any;
    currTabIndex: number;
}

export default function Sidebar(props: Props) {

    const [currentPage, setCurrentPage] = useState("")
    const router = useRouter()

    const url = reverseString(globalThis.window?.location.href)
    const page = url?.split("/")

    function reverseString(str: string) {
        var splitString = str?.split("");
        var reverseArray = splitString?.reverse();
        var joinArray = reverseArray?.join("");
        return joinArray;
    }


    function handleClickLogout() {
        SignOut()
        router.push('/signup')
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
        else if (reverseString(page[0]) == 'messages') {
            setCurrentPage("messages")
        }
    }, [currentPage])

    return (
        <div className="hidden lg:flex flex-col border-gray-300 border-[1px] h-full w-full] rounded-t-xl bg-white relative px-3">

            <div className="flex flex-col justify-center my-6">
                <a href="/seeker/applied" className={`my-2 font-medium rounded-2xl  py-3 cursor-pointer px-4 flex gap-2 items-center  ${currentPage == 'applied' ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <BiHomeAlt2 className="text-xl" />
                    <p className="text-sm ">Applied</p>
                </a>

                <a href="/seeker/saved" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center  ${currentPage == 'saved' ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <PiBuildings className="text-xl" />
                    <p className="text-sm ">Saved </p>
                </a>

                <a href="/seeker/edit" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center  ${currentPage == 'edit' ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <LuClipboardList className="text-xl" />
                    <p className="text-sm ">Edit Profile</p>
                </a>
                <a href="/seeker/chat" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center  ${currentPage == 'chat' ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <IoChatboxEllipsesOutline className="text-xl" />
                    <p className="text-sm ">Messages</p>
                </a>
                
            </div>
            <button onClick={() => { handleClickLogout() }} className="text-xs text-[#4A2C84] bg-[#cfc2e9] py-3 px-6 rounded-2xl font-semibold mx-5 xl:mx-10 absolute bottom-10 left-0 right-0">Log out</button>
            
            
        </div>
    ) 
}
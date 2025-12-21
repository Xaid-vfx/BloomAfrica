'use client'

import PrentisLogo from '@/components/Logo/PrentisLogo'
import { BiHomeAlt2 } from "react-icons/bi";
import { LuClipboardList } from "react-icons/lu";
import { PiBuildings } from "react-icons/pi";
import { SignOut } from "@/lib/Signout/Signout";
import { useRouter, usePathname } from "next/navigation";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import UnreadMessagesDot from "@/components/UnreadMessagesDot/UnreadMessagesDot";
import { BsBuildingUp } from "react-icons/bs";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const segment = useSelectedLayoutSegment()
    const [userId, setUserId] = useState<string>("")
    const supabase = createClientComponentClient()

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
            }
        }
        getUser()
    }, [])

    function handleClickLogout() {
        SignOut()
        router.push('/signup')
    }

    const isActive = (path: string) => {
        return segment === path
    }

    return (
        <div className='hidden lg:flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl px-3 bg-white relative'>
            <div className="flex flex-col justify-center my-6">
                <Link href="/recruiter/dashboard" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center ${isActive('dashboard') ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <BiHomeAlt2 className="text-xl" />
                    <p className="text-sm">Dashboard</p>
                </Link>
                <Link href="/recruiter/company" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center ${isActive('company') ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <PiBuildings className="text-xl" />
                    <p className="text-sm">Company Profile</p>
                </Link>
                <Link href="/recruiter/listings" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center ${isActive('listings') ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <LuClipboardList className="text-xl" />
                    <p className="text-sm">My Apprenticeships</p>
                </Link>
                <Link href="/recruiter/messages" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center ${isActive('messages') ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <IoChatboxEllipsesOutline className="text-xl" />
                    <p className="text-sm">Messages</p>
                    <UnreadMessagesDot userId={userId} />
                </Link>
                <Link href="/recruiter/bank-details" className={`my-2 font-medium rounded-2xl py-3 cursor-pointer px-4 flex gap-2 items-center ${isActive('bank-details') ? "text-[#4A2C84] font-semibold py-5 bg-[#E9EBFD]" : "text-[#7C8493]"}`}>
                    <BsBuildingUp className="text-xl" />
                    <p className="text-sm">Bank Details</p>
                </Link>
            </div>
            <button onClick={handleClickLogout} className="text-sm text-[#4A2C84] bg-[#ae9ece] py-3 px-6 rounded-2xl font-semibold mx-5 xl:mx-10 absolute bottom-14 left-0 right-0">Log out</button>
        </div>
    )
}
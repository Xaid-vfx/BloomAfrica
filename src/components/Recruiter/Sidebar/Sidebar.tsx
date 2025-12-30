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
import { LogOut, Plus } from "lucide-react";

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
        <div className='hidden lg:flex flex-col border border-gray-100 w-full rounded-2xl bg-white shadow-lg relative sticky top-5' style={{ height: 'calc(100vh - 2.5rem)' }}>
            {/* Logo Section */}
            <div className="px-6 py-6 border-b border-gray-100">
                <Link href="/recruiter/dashboard">
                    <PrentisLogo className="!text-[#14B8A6]" />
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 px-4 py-6">
                <nav className="space-y-1">
                    <Link
                        href="/recruiter/dashboard"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            isActive('dashboard')
                                ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                                : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <BiHomeAlt2 className={`text-xl transition-colors ${
                            isActive('dashboard') ? "text-white" : "text-gray-500 group-hover:text-[#14B8A6]"
                        }`} />
                        <span className="text-sm">Dashboard</span>
                    </Link>

                    <Link
                        href="/recruiter/company"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            isActive('company')
                                ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                                : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <PiBuildings className={`text-xl transition-colors ${
                            isActive('company') ? "text-white" : "text-gray-500 group-hover:text-[#14B8A6]"
                        }`} />
                        <span className="text-sm">Company Profile</span>
                    </Link>

                    <Link
                        href="/recruiter/listings"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            isActive('listings')
                                ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                                : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <LuClipboardList className={`text-xl transition-colors ${
                            isActive('listings') ? "text-white" : "text-gray-500 group-hover:text-[#14B8A6]"
                        }`} />
                        <span className="text-sm">My Apprenticeships</span>
                    </Link>

                    <Link
                        href="/recruiter/messages"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            isActive('messages')
                                ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                                : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <IoChatboxEllipsesOutline className={`text-xl transition-colors ${
                                isActive('messages') ? "text-white" : "text-gray-500 group-hover:text-[#14B8A6]"
                            }`} />
                            <span className="text-sm">Messages</span>
                        </div>
                        <UnreadMessagesDot userId={userId} />
                    </Link>

                    <Link
                        href="/recruiter/bank-details"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                            isActive('bank-details')
                                ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                                : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        <BsBuildingUp className={`text-xl transition-colors ${
                            isActive('bank-details') ? "text-white" : "text-gray-500 group-hover:text-[#14B8A6]"
                        }`} />
                        <span className="text-sm">Bank Details</span>
                    </Link>
                </nav>

                {/* Post Apprenticeship Button */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <Link
                        href="/recruiter/post-a-job"
                        className="flex items-center justify-center gap-2 w-full bg-[#0A1F44] hover:bg-[#1A3A64] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors shadow-lg"
                    >
                        <Plus size={18} />
                        Post Apprenticeship
                    </Link>
                </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 pb-6">
                <button
                    onClick={handleClickLogout}
                    className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-700 hover:text-red-600 py-3 px-4 rounded-xl font-medium text-sm transition-all"
                >
                    <LogOut size={18} />
                    Log out
                </button>
            </div>
        </div>
    )
}

'use client'

import PrentisLogo from '@/components/Logo/PrentisLogo'
import { BiHomeAlt2 } from "react-icons/bi";
import { LuClipboardList } from "react-icons/lu";
import { PiBuildings } from "react-icons/pi";
import { SignOut } from "@/lib/utils/signOut";
import { useRouter, useSearchParams } from "next/navigation";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import UnreadMessagesDot from "@/components/UnreadMessagesDot/UnreadMessagesDot";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Plus, Rocket, Lock, CheckCircle2, Circle, BookOpen, Clock } from "lucide-react";
import { useRecruiter } from "@/context/RecruiterContext";

const ONBOARDING_SECTIONS = [
  { title: 'Registrant Information' },
  { title: 'Choose Trainer Type' },
  { title: 'Business Identity' },
  { title: 'Verification & Trust' },
  { title: 'Workspace & Facility' },
  { title: 'Program Intent' },
  { title: 'Curriculum' },
  { title: 'Teaching Team' }
]

export default function Sidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const segment = useSelectedLayoutSegment()
    const [userId, setUserId] = useState<string>("")

    // Get all state from context (single source of truth)
    const {
        user,
        canPostApprenticeships,
        hasActiveSubscription,
        isAccountApproved,
        isOnboardingComplete,
        completedOnboardingSections,
        isLoading
    } = useRecruiter()

    // Determine the lock message based on status
    const getLockMessage = () => {
        if (!hasActiveSubscription && !isAccountApproved) {
            return 'Complete payment and wait for account approval'
        } else if (!hasActiveSubscription) {
            return 'Complete payment to unlock'
        } else if (!isAccountApproved) {
            return 'Your account is under review'
        }
        return ''
    }

    const currentOnboardingSection = parseInt(searchParams?.get('section') || '1')

    // Get userId from context user
    useEffect(() => {
        if (user?.id) {
            setUserId(user.id)
        }
    }, [user])

    function handleClickLogout() {
        SignOut()
        router.push('/signup')
    }

    const isActive = (path: string) => {
        return segment === path
    }

    if (isLoading) {
        return (
            <div className='hidden lg:flex flex-col border border-gray-100 w-full rounded-2xl bg-white shadow-lg items-center justify-center'
                 style={{ height: 'calc(100vh - 2.5rem)' }}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#14B8A6]"></div>
            </div>
        );
    }

    return (
        <div className='hidden lg:flex flex-col border border-gray-100 w-full rounded-2xl bg-white shadow-lg relative sticky top-5 overflow-x-hidden' style={{ height: 'calc(100vh - 2.5rem)' }}>
            {/* Logo Section */}
            <div className="px-6 py-6 border-b border-gray-100">
                <Link href="/recruiter/dashboard">
                    <PrentisLogo className="!text-[#14B8A6]" />
                </Link>
            </div>

            {/* Status Banner - shows when features are locked */}
            {isOnboardingComplete && !canPostApprenticeships && (
                <div className="mx-4 mt-4 p-3 bg-amber-100 border-2 border-amber-300 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2">
                        {!hasActiveSubscription ? (
                            <Clock size={18} className="text-amber-700 flex-shrink-0" />
                        ) : (
                            <Lock size={18} className="text-amber-700 flex-shrink-0" />
                        )}
                        <p className="text-sm text-amber-900 font-semibold leading-tight">
                            {getLockMessage()}
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation Links */}
            <div className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden">
                <nav className="space-y-1">
                    {/* Onboarding with expandable subsections - only show when not complete */}
                    {!isOnboardingComplete && (
                        <div>
                            <Link
                                href="/recruiter/onboarding"
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                    isActive('onboarding')
                                        ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <Rocket className={`transition-colors ${
                                    isActive('onboarding') ? "text-white" : "text-gray-500 group-hover:text-[#14B8A6]"
                                }`} size={20} />
                                <span className="text-sm">Onboarding</span>
                            </Link>

                            {/* Expandable Subsections - only show when on onboarding page */}
                            {isActive('onboarding') && (
                                <div className="ml-4 mt-2 space-y-1 pl-4 relative">
                                    {/* Gray background line */}
                                    <div
                                        className="absolute left-0 top-0 w-1 bg-gray-200 rounded-full pointer-events-none"
                                        style={{
                                            height: '100%'
                                        }}
                                    />
                                    {/* Progress bar overlay */}
                                    <div
                                        className="absolute left-0 w-1 bg-[#14B8A6] rounded-full transition-all duration-300 pointer-events-none"
                                        style={{
                                            top: '-4px',
                                            height: completedOnboardingSections.length > 0
                                                ? `calc(${(Math.max(...completedOnboardingSections, 0) / ONBOARDING_SECTIONS.length) * 100}% + 6px)`
                                                : '0'
                                        }}
                                    />
                                    {ONBOARDING_SECTIONS.map((section, index) => {
                                        const sectionNum = index + 1
                                        const isComplete = completedOnboardingSections.includes(sectionNum)
                                        const isCurrent = currentOnboardingSection === sectionNum
                                        const isAccessible = isComplete || sectionNum === Math.max(...completedOnboardingSections, 0) + 1 || sectionNum === 1

                                        return (
                                            <Link
                                                key={sectionNum}
                                                href={isAccessible ? `/recruiter/onboarding?section=${sectionNum}` : '#'}
                                                className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                                    isCurrent
                                                        ? "bg-[#14B8A6]/10 text-[#14B8A6] font-semibold"
                                                        : isComplete
                                                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                        : isAccessible
                                                        ? "text-gray-600 hover:bg-gray-50 hover:text-[#14B8A6]"
                                                        : "text-gray-400 cursor-not-allowed opacity-60"
                                                }`}
                                                onClick={(e) => {
                                                    if (!isAccessible) e.preventDefault()
                                                }}
                                            >
                                                {isComplete ? (
                                                    <CheckCircle2 size={14} className="text-[#14B8A6] flex-shrink-0" />
                                                ) : (
                                                    <Circle size={14} className="flex-shrink-0" />
                                                )}
                                                <span className="truncate">{section.title}</span>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Dashboard - always show when onboarding is complete */}
                    {!isOnboardingComplete ? (
                        <div className="relative group/tooltip">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                                <BiHomeAlt2 className="text-xl" />
                                <span className="text-sm">Dashboard</span>
                                <Lock size={14} className="ml-auto" />
                            </div>
                            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Complete onboarding to unlock
                            </div>
                        </div>
                    ) : (
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
                    )}

                    {!isOnboardingComplete ? (
                        <div className="relative group/tooltip">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                                <BookOpen size={20} />
                                <span className="text-sm">Manage Curriculum</span>
                                <Lock size={14} className="ml-auto" />
                            </div>
                            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Complete onboarding to unlock
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/recruiter/curriculum"
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                isActive('curriculum')
                                    ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <BookOpen className={`transition-colors ${
                                isActive('curriculum') ? "text-white" : "text-gray-500 group-hover:text-[#14B8A6]"
                            }`} size={20} />
                            <span className="text-sm">Manage Curriculum</span>
                        </Link>
                    )}

                    {!isOnboardingComplete ? (
                        <div className="relative group/tooltip">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                                <PiBuildings className="text-xl" />
                                <span className="text-sm">Company Profile</span>
                                <Lock size={14} className="ml-auto" />
                            </div>
                            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Complete onboarding to unlock
                            </div>
                        </div>
                    ) : (
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
                    )}

                    {!isOnboardingComplete ? (
                        <div className="relative group/tooltip">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                                <LuClipboardList className="text-xl" />
                                <span className="text-sm">My Apprenticeships</span>
                                <Lock size={14} className="ml-auto" />
                            </div>
                            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Complete onboarding to unlock
                            </div>
                        </div>
                    ) : !canPostApprenticeships ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                            <LuClipboardList className="text-xl" />
                            <span className="text-sm">My Apprenticeships</span>
                            <Lock size={14} className="ml-auto" />
                        </div>
                    ) : (
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
                    )}

                    {!isOnboardingComplete ? (
                        <div className="relative group/tooltip">
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                                <IoChatboxEllipsesOutline className="text-xl" />
                                <span className="text-sm">Messages</span>
                                <Lock size={14} className="ml-auto" />
                            </div>
                            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Complete onboarding to unlock
                            </div>
                        </div>
                    ) : !canPostApprenticeships ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-gray-100 text-gray-400 cursor-not-allowed opacity-60">
                            <IoChatboxEllipsesOutline className="text-xl" />
                            <span className="text-sm">Messages</span>
                            <Lock size={14} className="ml-auto" />
                        </div>
                    ) : (
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
                    )}

                    </nav>

                {/* Post Apprenticeship Button */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    {!isOnboardingComplete ? (
                        <div className="relative group/tooltip">
                            <div className="flex items-center justify-center gap-2 w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-semibold text-sm cursor-not-allowed opacity-60">
                                <Plus size={18} />
                                Post Apprenticeship
                                <Lock size={14} className="ml-1" />
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                Complete onboarding to unlock
                            </div>
                        </div>
                    ) : !canPostApprenticeships ? (
                        <div className="flex items-center justify-center gap-2 w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-semibold text-sm cursor-not-allowed opacity-60">
                            {!hasActiveSubscription ? <Clock size={18} /> : <Lock size={18} />}
                            Post Apprenticeship
                            <Lock size={14} className="ml-1" />
                        </div>
                    ) : (
                        <Link
                            href="/recruiter/post-a-job"
                            className="flex items-center justify-center gap-2 w-full bg-[#0A1F44] hover:bg-[#1A3A64] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors shadow-lg"
                        >
                            <Plus size={18} />
                            Post Apprenticeship
                        </Link>
                    )}
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

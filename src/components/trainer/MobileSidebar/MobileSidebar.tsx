'use client'

import { useState, useEffect, useRef, TouchEvent } from 'react'
import { useRouter, usePathname, useSearchParams, useSelectedLayoutSegment } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import PrentisLogo from '@/components/Logo/PrentisLogo'
import UnreadMessagesDot from '@/components/UnreadMessagesDot/UnreadMessagesDot'
import { BiHomeAlt2 } from "react-icons/bi"
import { LuClipboardList } from "react-icons/lu"
import { PiBuildings } from "react-icons/pi"
import { IoChatboxEllipsesOutline } from "react-icons/io5"
import { SignOut } from "@/lib/utils/signOut"
import { Rocket, Lock, CheckCircle2, Circle, Plus, LogOut, X, BookOpen, Clock } from "lucide-react"
import { cn, zIndex, touchTargets } from '@/styles/mobile-design-tokens'
import { useRecruiter } from "@/context/RecruiterContext"

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

export default function MobileSidebar() {
  // === STATE ===
  const [isExpanded, setIsExpanded] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [completedOnboardingSections, setCompletedOnboardingSections] = useState<number[]>([])

  // === HOOKS ===
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const segment = useSelectedLayoutSegment()
  const supabase = createClientComponentClient()

  // Get subscription and account status from context
  const { canPostApprenticeships, hasActiveSubscription, isAccountApproved } = useRecruiter()
  const drawerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const edgeSwipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null)

  const currentOnboardingSection = parseInt(searchParams?.get('section') || '1')

  // === EFFECTS ===
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        checkOnboardingStatus(user.id)
      }
    }
    getUser()
  }, [])

  // Refresh completion status when section changes
  useEffect(() => {
    if (userId && pathname?.includes('/onboarding')) {
      checkOnboardingStatus(userId)
    }
  }, [currentOnboardingSection, userId])

  // Body scroll lock
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isExpanded])

  // === FUNCTIONS ===
  async function checkOnboardingStatus(userId: string) {
    try {
      const { data, error } = await supabase
        .from('TrainerProfiles')
        .select('is_completed, current_section, completed_sections')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      setIsOnboardingComplete(data?.is_completed || false)

      // If onboarding is complete, show all sections as complete
      if (data?.is_completed) {
        setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8])
      }
      // Otherwise, use completed_sections if available, or calculate from current_section
      else if (data?.completed_sections) {
        setCompletedOnboardingSections(data.completed_sections)
      } else if (data?.current_section) {
        const completed = Array.from({length: data.current_section - 1}, (_, i) => i + 1)
        setCompletedOnboardingSections(completed)
      }
    } catch (error) {
      // Table doesn't exist - use localStorage for local development
      const localCompletion = localStorage.getItem(`trainer_onboarding_complete_${userId}`)
      const isComplete = localCompletion === 'true'
      setIsOnboardingComplete(isComplete)

      // Load completed sections from localStorage
      const localData = localStorage.getItem(`trainer_profile_${userId}`)
      if (localData) {
        const data = JSON.parse(localData)

        // If onboarding is complete, show all sections as complete
        if (data.is_completed || isComplete) {
          setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8])
        }
        // Otherwise use completed_sections or calculate from current_section
        else if (data.completed_sections) {
          setCompletedOnboardingSections(data.completed_sections)
        } else if (data.current_section) {
          const completed = Array.from({length: data.current_section - 1}, (_, i) => i + 1)
          setCompletedOnboardingSections(completed)
        }
      } else if (isComplete) {
        setCompletedOnboardingSections([1, 2, 3, 4, 5, 6, 7, 8])
      }
    }
  }

  function handleClickLogout() {
    SignOut()
    router.push('/signup')
  }

  const isActive = (path: string) => segment === path

  const closeDrawer = () => setIsExpanded(false)

  const handleNavigate = (path: string) => {
    router.push(path)
    closeDrawer()
  }

  // Touch gesture handlers for swipe-to-close
  const handleTouchStart = (e: TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current) return
    const deltaX = e.touches[0].clientX - touchStartRef.current.x
    // Could add visual feedback here
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return
    const endX = e.changedTouches[0].clientX
    const deltaX = endX - touchStartRef.current.x

    // If swiped left more than 80px, close drawer
    if (deltaX < -80) {
      closeDrawer()
    }

    touchStartRef.current = null
  }

  // Edge swipe detection for opening drawer from left screen edge
  const handleEdgeSwipeStart = (e: TouchEvent) => {
    edgeSwipeStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    }
  }

  const handleEdgeSwipeMove = (e: TouchEvent) => {
    if (!edgeSwipeStartRef.current) return

    const currentX = e.touches[0].clientX
    const deltaX = currentX - edgeSwipeStartRef.current.x

    // Prevent default browser behavior if swiping right (prevents iOS back gesture)
    if (deltaX > 10) {
      e.preventDefault()
    }
  }

  const handleEdgeSwipeEnd = (e: TouchEvent) => {
    if (!edgeSwipeStartRef.current) return

    const endX = e.changedTouches[0].clientX
    const deltaX = endX - edgeSwipeStartRef.current.x
    const deltaTime = Date.now() - edgeSwipeStartRef.current.time

    // If swiped right more than 80px within 300ms, open drawer
    if (deltaX > 80 && deltaTime < 300) {
      setIsExpanded(true)
    }

    edgeSwipeStartRef.current = null
  }

  // === NAVIGATION ITEMS ===
  const navItems = [
    {
      icon: <Rocket size={20} />,
      path: '/recruiter/onboarding',
      label: 'Onboarding',
      segment: 'onboarding',
      locked: false
    },
    {
      icon: <BiHomeAlt2 className="text-xl" />,
      path: '/recruiter/dashboard',
      label: 'Dashboard',
      segment: 'dashboard',
      locked: !isOnboardingComplete
    },
    {
      icon: <BookOpen size={20} />,
      path: '/recruiter/curriculum',
      label: 'Curriculum',
      segment: 'curriculum',
      locked: !isOnboardingComplete
    },
    {
      icon: <PiBuildings className="text-xl" />,
      path: '/recruiter/company',
      label: 'Company',
      segment: 'company',
      locked: !isOnboardingComplete
    },
    {
      icon: <LuClipboardList className="text-xl" />,
      path: '/recruiter/listings',
      label: 'Jobs',
      segment: 'listings',
      locked: !isOnboardingComplete || !canPostApprenticeships
    },
    {
      icon: <IoChatboxEllipsesOutline className="text-xl" />,
      path: '/recruiter/messages',
      label: 'Messages',
      segment: 'messages',
      locked: !isOnboardingComplete || !canPostApprenticeships
    },
  ]

  return (
    <>
      {/* ========== EDGE SWIPE DETECTION ZONE ========== */}
      {!isExpanded && (
        <div
          className="lg:hidden fixed left-0 top-0 bottom-0 w-8 z-20"
          onTouchStart={handleEdgeSwipeStart}
          onTouchMove={handleEdgeSwipeMove}
          onTouchEnd={handleEdgeSwipeEnd}
          aria-hidden="true"
        />
      )}

      {/* ========== COLLAPSED BAR ========== */}
      <div className="lg:hidden fixed left-0 top-0 bottom-0 z-30 w-16 bg-[#0A1F44] border-r border-[#1A3A64] shadow-lg">
        {/* Logo Section */}
        <div className="flex items-center justify-center pt-3 pb-2 border-b border-white/10">
          <Link
            href={isOnboardingComplete ? "/recruiter/dashboard" : "/recruiter/onboarding"}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            aria-label={isOnboardingComplete ? "Go to dashboard" : "Go to onboarding"}
          >
            <div className="text-center ">
              <div className="text-lg leading-[1] font-bold text-white">Pren <br/> <span className='text-[#17d7c1]'> tis.</span></div>
            </div>
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col py-4 gap-1">
          {navItems.map((item) => {
            const active = isActive(item.segment)

            return (
              <button
                key={item.path}
                onClick={() => !item.locked && setIsExpanded(true)}
                disabled={item.locked}
                className={cn(
                  'relative flex items-center justify-center',
                  touchTargets.iconButton,
                  'transition-colors duration-200',
                  active ? 'text-[#14B8A6]' : 'text-gray-400',
                  item.locked && 'opacity-40 cursor-not-allowed'
                )}
                aria-label={item.label}
              >
                {item.icon}

                {/* Active indicator - left edge bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#14B8A6] rounded-r-full" />
                )}

                {/* Lock overlay */}
                {item.locked && (
                  <Lock size={12} className="absolute top-2 left-2 text-gray-300" />
                )}

                {/* Message badge */}
                {item.path === '/recruiter/messages' && userId && (
                  <div className="absolute top-1 left-1 scale-75">
                    <UnreadMessagesDot userId={userId} />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ========== EXPANDED DRAWER ========== */}
      {isExpanded && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] max-w-[70vw] bg-[#0A1F44] shadow-2xl overflow-y-auto animate-slide-in-left"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="navigation"
            aria-label="Mobile navigation sidebar"
          >
            {/* Header with close button */}
            <div className="sticky top-0 z-10 bg-[#0A1F44] border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <Link
                href={isOnboardingComplete ? "/recruiter/dashboard" : "/recruiter/onboarding"}
                onClick={closeDrawer}
              >
                <PrentisLogo className="!text-white" />
              </Link>
              <button
                onClick={closeDrawer}
                className={cn(touchTargets.iconButton, 'rounded-full hover:bg-white/10 transition-colors text-white')}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Content */}
            <div className="flex-1 px-4 py-6">
              <nav className="space-y-1">
                {/* Onboarding with expandable subsections */}
                <div>
                  <Link
                    href="/recruiter/onboarding"
                    onClick={closeDrawer}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive('onboarding')
                        ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    <Rocket className={`transition-colors ${
                      isActive('onboarding') ? "text-white" : "text-gray-300 group-hover:text-[#14B8A6]"
                    }`} size={20} />
                    <span className="text-sm">Onboarding</span>
                  </Link>

                  {/* Expandable Subsections - only show when on onboarding page */}
                  {isActive('onboarding') && (
                    <div className="ml-4 mt-2 space-y-1 pl-4 relative">
                      {/* Gray background line */}
                      <div
                        className="absolute left-0 top-0 w-1 bg-white/20 rounded-full pointer-events-none"
                        style={{ height: '100%' }}
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
                            onClick={(e) => {
                              if (!isAccessible) {
                                e.preventDefault()
                              } else {
                                closeDrawer()
                              }
                            }}
                            className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                              isCurrent
                                ? "bg-[#14B8A6]/20 text-[#14B8A6] font-semibold"
                                : isComplete
                                ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                : isAccessible
                                ? "text-gray-300 hover:bg-white/10 hover:text-[#14B8A6]"
                                : "text-gray-400 cursor-not-allowed opacity-50"
                            }`}
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

                {/* Dashboard */}
                {!isOnboardingComplete ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 cursor-not-allowed opacity-70">
                    <BiHomeAlt2 className="text-xl" />
                    <span className="text-sm">Dashboard</span>
                    <Lock size={14} className="ml-auto" />
                  </div>
                ) : (
                  <Link
                    href="/recruiter/dashboard"
                    onClick={closeDrawer}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive('dashboard')
                        ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    <BiHomeAlt2 className={`text-xl transition-colors ${
                      isActive('dashboard') ? "text-white" : "text-gray-300 group-hover:text-[#14B8A6]"
                    }`} />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                )}

                {/* Manage Curriculum */}
                {!isOnboardingComplete ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 cursor-not-allowed opacity-70">
                    <BookOpen size={20} />
                    <span className="text-sm">Manage Curriculum</span>
                    <Lock size={14} className="ml-auto" />
                  </div>
                ) : (
                  <Link
                    href="/recruiter/curriculum"
                    onClick={closeDrawer}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive('curriculum')
                        ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    <BookOpen className={`transition-colors ${
                      isActive('curriculum') ? "text-white" : "text-gray-300 group-hover:text-[#14B8A6]"
                    }`} size={20} />
                    <span className="text-sm">Manage Curriculum</span>
                  </Link>
                )}

                {/* Company Profile */}
                {!isOnboardingComplete ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 cursor-not-allowed opacity-70">
                    <PiBuildings className="text-xl" />
                    <span className="text-sm">Company Profile</span>
                    <Lock size={14} className="ml-auto" />
                  </div>
                ) : (
                  <Link
                    href="/recruiter/company"
                    onClick={closeDrawer}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive('company')
                        ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    <PiBuildings className={`text-xl transition-colors ${
                      isActive('company') ? "text-white" : "text-gray-300 group-hover:text-[#14B8A6]"
                    }`} />
                    <span className="text-sm">Company Profile</span>
                  </Link>
                )}

                {/* My Apprenticeships */}
                {!isOnboardingComplete ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 cursor-not-allowed opacity-70">
                    <LuClipboardList className="text-xl" />
                    <span className="text-sm">My Apprenticeships</span>
                    <Lock size={14} className="ml-auto" />
                  </div>
                ) : !canPostApprenticeships ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 cursor-not-allowed opacity-70">
                      <LuClipboardList className="text-xl" />
                      <span className="text-sm">My Apprenticeships</span>
                      <Lock size={14} className="ml-auto" />
                    </div>
                    <p className="text-xs text-gray-400 px-4 mt-1">
                      {!hasActiveSubscription ? 'Complete payment to unlock' : 'Account under review'}
                    </p>
                  </div>
                ) : (
                  <Link
                    href="/recruiter/listings"
                    onClick={closeDrawer}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive('listings')
                        ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    <LuClipboardList className={`text-xl transition-colors ${
                      isActive('listings') ? "text-white" : "text-gray-300 group-hover:text-[#14B8A6]"
                    }`} />
                    <span className="text-sm">My Apprenticeships</span>
                  </Link>
                )}

                {/* Messages */}
                {!isOnboardingComplete ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 cursor-not-allowed opacity-70">
                    <IoChatboxEllipsesOutline className="text-xl" />
                    <span className="text-sm">Messages</span>
                    <Lock size={14} className="ml-auto" />
                  </div>
                ) : !canPostApprenticeships ? (
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 cursor-not-allowed opacity-70">
                      <IoChatboxEllipsesOutline className="text-xl" />
                      <span className="text-sm">Messages</span>
                      <Lock size={14} className="ml-auto" />
                    </div>
                    <p className="text-xs text-gray-400 px-4 mt-1">
                      {!hasActiveSubscription ? 'Complete payment to unlock' : 'Account under review'}
                    </p>
                  </div>
                ) : (
                  <Link
                    href="/recruiter/messages"
                    onClick={closeDrawer}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive('messages')
                        ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/30"
                        : "text-gray-200 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <IoChatboxEllipsesOutline className={`text-xl transition-colors ${
                        isActive('messages') ? "text-white" : "text-gray-300 group-hover:text-[#14B8A6]"
                      }`} />
                      <span className="text-sm">Messages</span>
                    </div>
                    <UnreadMessagesDot userId={userId} />
                  </Link>
                )}

                </nav>

              {/* Post Apprenticeship Button */}
              <div className="mt-6 pt-6 border-t border-white/10">
                {!isOnboardingComplete ? (
                  <div className="flex items-center justify-center gap-2 w-full bg-white/5 text-gray-300 py-3 px-4 rounded-xl font-semibold text-sm cursor-not-allowed opacity-70">
                    <Plus size={18} />
                    Post Apprenticeship
                    <Lock size={14} className="ml-1" />
                  </div>
                ) : !canPostApprenticeships ? (
                  <div className="relative group/tooltip">
                    <div className="flex items-center justify-center gap-2 w-full bg-white/5 text-gray-300 py-3 px-4 rounded-xl font-semibold text-sm cursor-not-allowed opacity-70">
                      {!hasActiveSubscription ? <Clock size={18} /> : <Lock size={18} />}
                      Post Apprenticeship
                      <Lock size={14} className="ml-1" />
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-2">
                      {!hasActiveSubscription ? 'Complete payment to unlock' : 'Account under review'}
                    </p>
                  </div>
                ) : (
                  <Link
                    href="/recruiter/post-a-job"
                    onClick={closeDrawer}
                    className="flex items-center justify-center gap-2 w-full bg-[#14B8A6] hover:bg-[#14B8A6]/80 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors shadow-lg"
                  >
                    <Plus size={18} />
                    Post Apprenticeship
                  </Link>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="px-4 pb-6 pt-4">
              <button
                onClick={handleClickLogout}
                className="flex items-center justify-center gap-2 w-full border-2 border-white/20 hover:border-red-400 hover:bg-red-500/10 text-gray-200 hover:text-red-400 py-3 px-4 rounded-xl font-medium text-sm transition-all"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

'use client'

import { useState, useEffect, useRef, TouchEvent, useCallback } from 'react'
import { useRouter, useSearchParams, useSelectedLayoutSegment } from 'next/navigation'
import Link from 'next/link'
import PrentisLogo from '@/components/Logo/PrentisLogo'
import UnreadMessagesDot from '@/components/UnreadMessagesDot/UnreadMessagesDot'
import { BiHomeAlt2 } from "react-icons/bi"
import { LuClipboardList } from "react-icons/lu"
import { PiBuildings } from "react-icons/pi"
import { IoChatboxEllipsesOutline } from "react-icons/io5"
import { SignOut } from "@/lib/utils/signOut"
import { Rocket, Lock, CheckCircle2, Circle, Plus, LogOut, X, BookOpen, Clock } from "lucide-react"
import { cn, touchTargets } from '@/styles/mobile-design-tokens'
import { useRecruiter } from "@/context/RecruiterContext"
import { toast } from "sonner"

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

const DRAWER_WIDTH = 280
const DRAG_THRESHOLD = 0.3 // 30% of drawer width to trigger open/close
const VELOCITY_THRESHOLD = 0.5 // pixels per ms

export default function MobileSidebar() {
  // === HOOKS ===
  const router = useRouter()
  const searchParams = useSearchParams()
  const segment = useSelectedLayoutSegment()

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

  // Show toast for locked features
  const showLockedToast = useCallback(() => {
    if (!hasActiveSubscription && !isAccountApproved) {
      toast.error('Complete payment and wait for account approval to access this feature')
    } else if (!hasActiveSubscription) {
      toast.error('Complete payment to access this feature')
    } else if (!isAccountApproved) {
      toast.error('Your account is under review')
    }
  }, [hasActiveSubscription, isAccountApproved])

  // === STATE ===
  const [isExpanded, setIsExpanded] = useState(false)
  const [userId, setUserId] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0) // 0 = closed, DRAWER_WIDTH = fully open

  const drawerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number; time: number; wasExpanded: boolean } | null>(null)
  const lastTouchRef = useRef<{ x: number; time: number } | null>(null)

  const currentOnboardingSection = parseInt(searchParams?.get('section') || '1')

  // Calculate actual drawer position
  const drawerPosition = isDragging ? dragOffset : (isExpanded ? DRAWER_WIDTH : 0)
  const progress = Math.min(Math.max(drawerPosition / DRAWER_WIDTH, 0), 1)

  // === EFFECTS ===
  // Get userId from context user
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id)
    }
  }, [user])

  // Body scroll lock
  useEffect(() => {
    if (isExpanded || isDragging) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isExpanded, isDragging])

  // === FUNCTIONS ===
  function handleClickLogout() {
    SignOut()
    router.push('/signup')
  }

  const isActive = (path: string) => segment === path

  const closeDrawer = useCallback(() => setIsExpanded(false), [])
  const openDrawer = useCallback(() => setIsExpanded(true), [])

  // Unified touch handler for both edge swipe (open) and drawer swipe (close)
  const handleTouchStart = useCallback((e: TouchEvent, fromEdge: boolean = false) => {
    const touch = e.touches[0]
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      wasExpanded: isExpanded
    }
    lastTouchRef.current = { x: touch.clientX, time: Date.now() }

    // Set initial drag offset based on current state
    if (fromEdge) {
      setDragOffset(0)
    } else if (isExpanded) {
      setDragOffset(DRAWER_WIDTH)
    }
  }, [isExpanded])

  const handleTouchMove = useCallback((e: TouchEvent, fromEdge: boolean = false) => {
    if (!dragStartRef.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStartRef.current.x
    const deltaY = touch.clientY - dragStartRef.current.y

    // If vertical scroll is dominant, don't handle as drawer drag
    if (!isDragging && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
      dragStartRef.current = null
      return
    }

    // Start dragging after small threshold
    if (!isDragging && Math.abs(deltaX) > 10) {
      setIsDragging(true)
    }

    if (isDragging || Math.abs(deltaX) > 10) {
      e.preventDefault()

      let newOffset: number
      if (fromEdge) {
        // Opening from edge: offset starts at 0
        newOffset = Math.max(0, Math.min(deltaX, DRAWER_WIDTH))
      } else {
        // Closing from drawer: offset starts at DRAWER_WIDTH
        newOffset = Math.max(0, Math.min(DRAWER_WIDTH + deltaX, DRAWER_WIDTH))
      }

      setDragOffset(newOffset)
      setIsDragging(true)

      // Track velocity
      lastTouchRef.current = { x: touch.clientX, time: Date.now() }
    }
  }, [isDragging])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!dragStartRef.current || !isDragging) {
      dragStartRef.current = null
      lastTouchRef.current = null
      setIsDragging(false)
      return
    }

    const touch = e.changedTouches[0]

    // Calculate velocity
    let velocity = 0
    if (lastTouchRef.current) {
      const timeDiff = Date.now() - lastTouchRef.current.time
      if (timeDiff > 0) {
        velocity = (touch.clientX - lastTouchRef.current.x) / timeDiff
      }
    }

    // Determine if should open or close based on position and velocity
    const shouldOpen =
      velocity > VELOCITY_THRESHOLD || // Fast swipe right
      (velocity > -VELOCITY_THRESHOLD && dragOffset > DRAWER_WIDTH * DRAG_THRESHOLD) // Past threshold and not swiping left fast

    setIsDragging(false)
    setDragOffset(0)

    if (shouldOpen) {
      openDrawer()
    } else {
      closeDrawer()
    }

    dragStartRef.current = null
    lastTouchRef.current = null
  }, [isDragging, dragOffset, openDrawer, closeDrawer])

  // Show loading state for collapsed bar
  if (isLoading) {
    return (
      <div className="lg:hidden fixed left-0 top-0 bottom-0 z-30 w-16 bg-[#0A1F44] border-r border-[#1A3A64] shadow-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#14B8A6]"></div>
      </div>
    );
  }

  // === NAVIGATION ITEMS ===
  const navItems = [
    // Only show onboarding when not complete
    ...(!isOnboardingComplete ? [{
      icon: <Rocket size={20} />,
      path: '/recruiter/onboarding',
      label: 'Onboarding',
      segment: 'onboarding',
      locked: false
    }] : []),
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
      {!isExpanded && !isDragging && (
        <div
          className="lg:hidden fixed left-16 top-0 bottom-0 w-6 z-40"
          onTouchStart={(e) => handleTouchStart(e, true)}
          onTouchMove={(e) => handleTouchMove(e, true)}
          onTouchEnd={handleTouchEnd}
          aria-hidden="true"
        />
      )}

      {/* ========== COLLAPSED BAR ========== */}
      <div
        className="lg:hidden fixed left-0 top-0 bottom-0 z-30 w-16 bg-[#0A1F44] border-r border-[#1A3A64] shadow-lg cursor-pointer"
        onClick={openDrawer}
        onTouchStart={(e) => handleTouchStart(e, true)}
        onTouchMove={(e) => handleTouchMove(e, true)}
        onTouchEnd={handleTouchEnd}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center pt-3 pb-2 border-b border-white/10">
          <Link
            href={isOnboardingComplete ? "/recruiter/dashboard" : "/recruiter/onboarding"}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            aria-label={isOnboardingComplete ? "Go to dashboard" : "Go to onboarding"}
          >
            <div className="text-center ">
              <div className="text-lg leading-[1] font-bold text-white">Pren <br/> <span className='text-[#17d7c1]'>tis</span>.</div>
            </div>
          </Link>
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col py-4 gap-1">
          {navItems.map((item) => {
            const active = isActive(item.segment)

            return (
              <div
                key={item.path}
                className={cn(
                  'relative flex items-center justify-center',
                  touchTargets.iconButton,
                  'transition-colors duration-200',
                  active ? 'text-[#14B8A6]' : 'text-gray-400',
                  item.locked && 'opacity-40'
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
                  <div className="absolute -top-0.5 -right-0.5">
                    <UnreadMessagesDot userId={userId} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ========== EXPANDED DRAWER ========== */}
      {/* Backdrop - always rendered, controlled via opacity/pointer-events */}
      <div
        className="lg:hidden fixed inset-0 z-40 transition-[background-color,backdrop-filter] duration-300"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${0.5 * progress})`,
          backdropFilter: `blur(${4 * progress}px)`,
          WebkitBackdropFilter: `blur(${4 * progress}px)`,
          pointerEvents: isExpanded || isDragging ? 'auto' : 'none',
        }}
        onClick={closeDrawer}
        onTouchStart={(e) => handleTouchStart(e, false)}
        onTouchMove={(e) => handleTouchMove(e, false)}
        onTouchEnd={handleTouchEnd}
        aria-hidden="true"
      />

      {/* Drawer - always rendered, controlled via transform */}
      <div
        ref={drawerRef}
        className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-[280px] max-w-[70vw] bg-[#0A1F44] shadow-2xl overflow-y-auto transition-transform duration-300"
        style={{
          transform: `translateX(${isExpanded && !isDragging ? 0 : isDragging ? (-DRAWER_WIDTH + dragOffset) : -DRAWER_WIDTH}px)`,
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          transitionDuration: isDragging ? '0ms' : '300ms',
        }}
        onTouchStart={(e) => handleTouchStart(e, false)}
        onTouchMove={(e) => handleTouchMove(e, false)}
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
                <PrentisLogo variant="light" />
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
                {/* Onboarding with expandable subsections - only show when not complete */}
                {!isOnboardingComplete && (
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
                )}

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
                  <button
                    onClick={showLockedToast}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 opacity-70 w-full text-left"
                  >
                    <LuClipboardList className="text-xl" />
                    <span className="text-sm">My Apprenticeships</span>
                    <Lock size={14} className="ml-auto" />
                  </button>
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
                  <button
                    onClick={showLockedToast}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium bg-white/5 text-gray-300 opacity-70 w-full text-left"
                  >
                    <IoChatboxEllipsesOutline className="text-xl" />
                    <span className="text-sm">Messages</span>
                    <Lock size={14} className="ml-auto" />
                  </button>
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
                    <div className="relative">
                      <IoChatboxEllipsesOutline className={`text-xl transition-colors ${
                        isActive('messages') ? "text-white" : "text-gray-300 group-hover:text-[#14B8A6]"
                      }`} />
                      <div className="absolute -top-1 -right-1">
                        <UnreadMessagesDot userId={userId} />
                      </div>
                    </div>
                    <span className="text-sm">Messages</span>
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
                  <button
                    onClick={showLockedToast}
                    className="flex items-center justify-center gap-2 w-full bg-white/5 text-gray-300 py-3 px-4 rounded-xl font-semibold text-sm opacity-70 hover:opacity-80 transition-opacity"
                  >
                    {!hasActiveSubscription ? <Clock size={18} /> : <Lock size={18} />}
                    Post Apprenticeship
                    <Lock size={14} className="ml-1" />
                  </button>
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
  )
}

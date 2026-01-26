'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Hammer, Building2 } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type Track = 'artisan' | 'company'

interface TrackSwitcherProps {
    initialTrack?: Track
}

export default function TrackSwitcher({ initialTrack = 'artisan' }: TrackSwitcherProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [activeTrack, setActiveTrack] = useState<Track>(initialTrack)
    const [artisanCount, setArtisanCount] = useState<number>(0)
    const [companyCount, setCompanyCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)

    // Sync with URL params
    useEffect(() => {
        const trackParam = searchParams.get('track') as Track
        if (trackParam === 'artisan' || trackParam === 'company') {
            setActiveTrack(trackParam)
        }
    }, [searchParams])

    // Fetch counts on mount
    useEffect(() => {
        async function fetchCounts() {
            const supabase = createClientComponentClient()
            setIsLoading(true)

            try {
                // Get Individual/Artisan trainer user IDs
                const { data: artisanTrainers } = await supabase
                    .from('TrainerProfiles')
                    .select('user_id')
                    .eq('trainer_category', 'Individual/Artisan/Small Business')
                    .eq('is_completed', true)

                const artisanUserIds = artisanTrainers?.map(t => t.user_id) || []

                // Get Company trainer user IDs
                const { data: companyTrainers } = await supabase
                    .from('TrainerProfiles')
                    .select('user_id')
                    .eq('trainer_category', 'Company')
                    .eq('is_completed', true)

                const companyUserIds = companyTrainers?.map(t => t.user_id) || []

                // If no trainers have completed onboarding, count all jobs as artisan
                if (artisanUserIds.length === 0 && companyUserIds.length === 0) {
                    const { count: totalCount } = await supabase
                        .from('Jobs')
                        .select('*', { count: 'exact', head: true })

                    setArtisanCount(totalCount || 0)
                    setCompanyCount(0)
                } else {
                    // Count artisan jobs
                    if (artisanUserIds.length > 0) {
                        const { count: artisanJobCount } = await supabase
                            .from('Jobs')
                            .select('*', { count: 'exact', head: true })
                            .in('recruiter', artisanUserIds)

                        setArtisanCount(artisanJobCount || 0)
                    } else {
                        // Fallback: count all jobs as artisan if no artisan trainers
                        const { count: totalCount } = await supabase
                            .from('Jobs')
                            .select('*', { count: 'exact', head: true })

                        setArtisanCount(totalCount || 0)
                    }

                    // Count company jobs
                    if (companyUserIds.length > 0) {
                        const { count: companyJobCount } = await supabase
                            .from('Jobs')
                            .select('*', { count: 'exact', head: true })
                            .in('recruiter', companyUserIds)

                        setCompanyCount(companyJobCount || 0)
                    } else {
                        setCompanyCount(0)
                    }
                }
            } catch (error) {
                console.error('Error fetching counts:', error)
                // Fallback: try to count all jobs
                const supabase = createClientComponentClient()
                const { count } = await supabase
                    .from('Jobs')
                    .select('*', { count: 'exact', head: true })
                setArtisanCount(count || 0)
                setCompanyCount(0)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCounts()
    }, [])

    const handleTrackChange = (track: Track) => {
        setActiveTrack(track)

        // Update URL params
        const params = new URLSearchParams(searchParams.toString())
        params.set('track', track)
        router.push(`/all-trainings?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div className="bg-gray-100 rounded-2xl p-1.5 flex gap-1.5">
                {/* Artisan Tab */}
                <button
                    type="button"
                    onClick={() => handleTrackChange('artisan')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-all ${
                        activeTrack === 'artisan'
                            ? 'bg-white text-[#14B8A6] shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Hammer className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Artisan</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        activeTrack === 'artisan'
                            ? 'bg-[#14B8A6]/10 text-[#14B8A6]'
                            : 'bg-gray-200 text-gray-600'
                    }`}>
                        {isLoading ? '...' : artisanCount}
                    </span>
                </button>

                {/* Company Tab */}
                <button
                    type="button"
                    onClick={() => handleTrackChange('company')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-all ${
                        activeTrack === 'company'
                            ? 'bg-white text-[#0A1F44] shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Company</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        activeTrack === 'company'
                            ? 'bg-[#0A1F44]/10 text-[#0A1F44]'
                            : 'bg-gray-200 text-gray-600'
                    }`}>
                        {isLoading ? '...' : companyCount}
                    </span>
                </button>
            </div>
        </div>
    )
}

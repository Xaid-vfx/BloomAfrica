'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  BookOpen,
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  Lock,
  GraduationCap,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

type CurriculumType = 'own' | 'prentis' | 'custom' | 'later' | null

interface TrainerProfile {
  curriculum_type: CurriculumType
  curriculum_files: string[] | null
  curriculum_notes: string | null
  primary_industry?: string
}

interface PrentisCurriculum {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  primary_industry: string
  secondary_industries?: string[]
  program_type?: string
  duration_weeks?: number
  skill_level?: 'beginner' | 'intermediate' | 'advanced'
  qualification?: string
  learning_outcomes?: string[]
  required_subscription_tier?: string | null
  is_featured?: boolean
  isInShortlist?: boolean
  eligibility?: {
    isEligible: boolean
    reason?: string
    issues: string[]
  }
}

interface ShortlistedCurriculum extends PrentisCurriculum {
  shortlistId: string
  addedAt: string
  notes?: string
}

// Placeholder curriculums for display when database is empty
const PLACEHOLDER_CURRICULUMS: PrentisCurriculum[] = [
  {
    id: 'placeholder-1',
    name: 'Fashion Design Fundamentals',
    slug: 'fashion-design-fundamentals',
    description: 'A comprehensive introduction to fashion design principles, pattern making, and garment construction techniques.',
    short_description: 'Learn core fashion design skills from sketching to garment construction.',
    primary_industry: 'Fashion & Textiles',
    secondary_industries: ['Creative Arts'],
    program_type: 'Hands-on Craft/Trade',
    duration_weeks: 12,
    skill_level: 'beginner',
    qualification: 'Certificate',
    learning_outcomes: ['Pattern drafting', 'Sewing techniques', 'Fabric selection', 'Design principles'],
    required_subscription_tier: null,
    is_featured: true,
  },
  {
    id: 'placeholder-2',
    name: 'Auto Mechanics Essentials',
    slug: 'auto-mechanics-essentials',
    description: 'Master the fundamentals of automotive repair and maintenance, including engine diagnostics, brake systems, and electrical systems.',
    short_description: 'Hands-on training in automotive repair and diagnostics.',
    primary_industry: 'Automotive',
    program_type: 'Technical/Engineering',
    duration_weeks: 16,
    skill_level: 'beginner',
    qualification: 'ND',
    learning_outcomes: ['Engine diagnostics', 'Brake system repair', 'Electrical troubleshooting', 'Preventive maintenance'],
    required_subscription_tier: null,
    is_featured: true,
  },
  {
    id: 'placeholder-3',
    name: 'Professional Baking & Pastry',
    slug: 'professional-baking-pastry',
    description: 'From bread basics to advanced pastry techniques, this curriculum covers everything needed to work in a professional bakery.',
    short_description: 'Complete training in baking, pastry arts, and confectionery.',
    primary_industry: 'Food & Beverage',
    program_type: 'Hands-on Craft/Trade',
    duration_weeks: 14,
    skill_level: 'intermediate',
    qualification: 'Certificate',
    learning_outcomes: ['Bread making', 'Pastry techniques', 'Cake decoration', 'Food safety'],
    required_subscription_tier: null,
    is_featured: false,
  },
  {
    id: 'placeholder-4',
    name: 'Cosmetology & Beauty Therapy',
    slug: 'cosmetology-beauty-therapy',
    description: 'Comprehensive training in hair styling, skincare, makeup application, and nail technology for aspiring beauty professionals.',
    short_description: 'Full spectrum beauty training from hair to nails.',
    primary_industry: 'Beauty & Cosmetics',
    program_type: 'Hands-on Craft/Trade',
    duration_weeks: 20,
    skill_level: 'beginner',
    qualification: 'HND',
    learning_outcomes: ['Hair cutting & styling', 'Skincare treatments', 'Makeup artistry', 'Nail technology'],
    required_subscription_tier: null,
    is_featured: true,
  },
  {
    id: 'placeholder-5',
    name: 'Mobile Phone Repair Technician',
    slug: 'mobile-phone-repair',
    description: 'Learn to diagnose and repair smartphones and tablets, including screen replacement, battery service, and software troubleshooting.',
    short_description: 'Technical training in smartphone and tablet repair.',
    primary_industry: 'Technology & Electronics',
    program_type: 'Technical/Engineering',
    duration_weeks: 8,
    skill_level: 'beginner',
    qualification: 'Certificate',
    learning_outcomes: ['Hardware diagnostics', 'Screen replacement', 'Battery service', 'Software troubleshooting'],
    required_subscription_tier: null,
    is_featured: false,
  },
  {
    id: 'placeholder-6',
    name: 'Furniture Making & Woodcraft',
    slug: 'furniture-making-woodcraft',
    description: 'Traditional and modern woodworking techniques for creating furniture, from joinery basics to finishing and upholstery.',
    short_description: 'Craft beautiful furniture from raw wood to finished piece.',
    primary_industry: 'Woodwork & Furniture',
    program_type: 'Hands-on Craft/Trade',
    duration_weeks: 24,
    skill_level: 'intermediate',
    qualification: 'BTech',
    learning_outcomes: ['Wood joinery', 'Power tool mastery', 'Finishing techniques', 'Furniture design'],
    required_subscription_tier: 'Corporate',
    is_featured: false,
  },
  {
    id: 'placeholder-7',
    name: 'Plumbing & Pipe Fitting',
    slug: 'plumbing-pipe-fitting',
    description: 'Essential plumbing skills covering installation, maintenance, and repair of water supply and drainage systems.',
    short_description: 'Master residential and commercial plumbing systems.',
    primary_industry: 'Hardware & Construction',
    program_type: 'Technical/Engineering',
    duration_weeks: 12,
    skill_level: 'beginner',
    qualification: 'ND',
    learning_outcomes: ['Pipe fitting', 'Fixture installation', 'Leak repair', 'Code compliance'],
    required_subscription_tier: null,
    is_featured: false,
  },
  {
    id: 'placeholder-8',
    name: 'Welding & Metal Fabrication',
    slug: 'welding-metal-fabrication',
    description: 'Comprehensive welding training including MIG, TIG, and stick welding techniques plus metal fabrication fundamentals.',
    short_description: 'Learn multiple welding techniques and metal fabrication.',
    primary_industry: 'Metalwork & Fabrication',
    program_type: 'Technical/Engineering',
    duration_weeks: 16,
    skill_level: 'intermediate',
    qualification: 'HND',
    learning_outcomes: ['MIG welding', 'TIG welding', 'Blueprint reading', 'Safety protocols'],
    required_subscription_tier: null,
    is_featured: true,
  },
]

export default function CurriculumPage() {
  const [loading, setLoading] = useState(true)
  const [curriculumType, setCurriculumType] = useState<CurriculumType>(null)
  const [curriculumFiles, setCurriculumFiles] = useState<string[]>([])
  const [curriculumNotes, setCurriculumNotes] = useState<string>('')
  const [trainerIndustry, setTrainerIndustry] = useState<string | null>(null)

  // Curriculum states
  const [browseCurriculums, setBrowseCurriculums] = useState<PrentisCurriculum[]>([])
  const [shortlistedCurriculums, setShortlistedCurriculums] = useState<ShortlistedCurriculum[]>([])
  const [loadingCurriculums, setLoadingCurriculums] = useState(false)
  const [addingToShortlist, setAddingToShortlist] = useState<string | null>(null)
  const [removingFromShortlist, setRemovingFromShortlist] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  const fetchShortlist = useCallback(async () => {
    try {
      const response = await fetch('/api/curriculums/shortlist')
      const data = await response.json()

      if (response.ok) {
        setShortlistedCurriculums(data.curriculums || [])
      }
    } catch (error) {
      console.error('Error fetching shortlist:', error)
    }
  }, [])

  const fetchBrowseCurriculums = useCallback(async () => {
    setLoadingCurriculums(true)
    try {
      const response = await fetch('/api/curriculums')
      const data = await response.json()

      if (response.ok) {
        const apiCurriculums = data.curriculums || []
        // Use placeholder curriculums if API returns empty, filtered by trainer's industry
        if (apiCurriculums.length === 0) {
          const industry = data.trainerIndustry
          const filtered = industry
            ? PLACEHOLDER_CURRICULUMS.filter(
                c => c.primary_industry === industry ||
                (c.secondary_industries || []).includes(industry)
              )
            : PLACEHOLDER_CURRICULUMS
          setBrowseCurriculums(filtered.length > 0 ? filtered : PLACEHOLDER_CURRICULUMS)
        } else {
          setBrowseCurriculums(apiCurriculums)
        }
        setTrainerIndustry(data.trainerIndustry)
      } else {
        // Fallback to all placeholders on error
        setBrowseCurriculums(PLACEHOLDER_CURRICULUMS)
      }
    } catch (error) {
      console.error('Error fetching curriculums:', error)
      // Fallback to placeholders on error
      setBrowseCurriculums(PLACEHOLDER_CURRICULUMS)
    } finally {
      setLoadingCurriculums(false)
    }
  }, [])

  useEffect(() => {
    async function fetchCurriculumData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('TrainerProfiles')
          .select('curriculum_type, curriculum_files, curriculum_notes, primary_industry')
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setCurriculumType(data.curriculum_type)
          setCurriculumFiles(data.curriculum_files || [])
          setCurriculumNotes(data.curriculum_notes || '')
          setTrainerIndustry(data.primary_industry || null)
        }
      } catch {
        // Fallback to localStorage for development
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const localData = localStorage.getItem(`trainer_profile_${user.id}`)
          if (localData) {
            const parsed = JSON.parse(localData)
            setCurriculumType(parsed.curriculum_type || null)
            setCurriculumFiles(parsed.curriculum_files || [])
            setCurriculumNotes(parsed.curriculum_notes || '')
            setTrainerIndustry(parsed.primary_industry || null)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCurriculumData()
    fetchShortlist()
    fetchBrowseCurriculums()
  }, [supabase, fetchShortlist, fetchBrowseCurriculums])

  const addToShortlist = async (curriculumId: string) => {
    setAddingToShortlist(curriculumId)
    try {
      const response = await fetch('/api/curriculums/shortlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curriculum_id: curriculumId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Curriculum added to shortlist')
        await fetchShortlist()
        await fetchBrowseCurriculums()
      } else {
        toast.error(data.error || 'Failed to add curriculum')
      }
    } catch (error) {
      console.error('Error adding to shortlist:', error)
      toast.error('Failed to add curriculum')
    } finally {
      setAddingToShortlist(null)
    }
  }

  const removeFromShortlist = async (shortlistId: string) => {
    setRemovingFromShortlist(shortlistId)
    try {
      const response = await fetch(`/api/curriculums/shortlist/${shortlistId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Curriculum removed from shortlist')
        await fetchShortlist()
        await fetchBrowseCurriculums()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to remove curriculum')
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error)
      toast.error('Failed to remove curriculum')
    } finally {
      setRemovingFromShortlist(null)
    }
  }

  const getStatusBadge = (type: CurriculumType) => {
    if (type === curriculumType) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#14B8A6]/10 text-[#14B8A6] text-xs font-medium rounded-full">
          <CheckCircle size={12} />
          Current Selection
        </span>
      )
    }
    return null
  }

  const getSkillLevelBadge = (level?: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-amber-100 text-amber-700',
      advanced: 'bg-[#0A1F44]/10 text-[#0A1F44]',
    }
    return colors[level || 'beginner'] || colors.beginner
  }

  const curriculumOptions = [
    {
      type: 'custom' as CurriculumType,
      icon: Sparkles,
      title: 'Custom Curriculum',
      description: 'Work with our team to design a custom curriculum tailored to your specific industry needs and training objectives.',
      action: 'Request Custom',
      color: 'from-[#14B8A6] to-[#0D9488]'
    },
    {
      type: 'own' as CurriculumType,
      icon: Upload,
      title: 'Upload Your Own',
      description: 'Already have your own curriculum? Upload your files and materials to use with your apprenticeship programs.',
      action: 'Upload Files',
      color: 'from-[#0A1F44] to-[#1A3A64]'
    }
  ]

  if (loading) {
    return (
      <div className="relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-[#14B8A6]" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44] mb-2">
            Manage Curriculum
          </h1>
          <p className="text-gray-600">
            Choose how you want to handle your training curriculum. You can use pre-built packages, request a custom solution, or upload your own materials.
          </p>
        </div>

        {/* Current Status Banner */}
        {curriculumType && curriculumType !== 'later' && (
          <div className="mb-8 p-4 bg-gradient-to-r from-[#14B8A6]/10 to-[#0D9488]/10 border border-[#14B8A6]/20 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#14B8A6]/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0A1F44]">
                  {curriculumType === 'prentis' && 'Using Prentis Curriculum'}
                  {curriculumType === 'custom' && 'Custom Curriculum Requested'}
                  {curriculumType === 'own' && 'Using Your Own Curriculum'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {curriculumType === 'prentis' && 'You selected to use our pre-built curriculum packages during onboarding.'}
                  {curriculumType === 'custom' && 'Our team is working on your custom curriculum request.'}
                  {curriculumType === 'own' && `You have ${curriculumFiles.length} file(s) uploaded.`}
                </p>
                {curriculumNotes && curriculumType === 'custom' && (
                  <p className="text-sm text-gray-500 mt-2 italic">
                    Notes: {curriculumNotes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {curriculumType === 'later' && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">
                  Curriculum Selection Pending
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  You chose to decide on your curriculum later during onboarding. Select an option below to get started.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* My Curriculums Section (Shortlist) */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#14B8A6]/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <h2 className="text-xl font-semibold text-[#0A1F44]">My Curriculums</h2>
            <span className="text-sm text-gray-500">({shortlistedCurriculums.length} saved)</span>
          </div>

          {shortlistedCurriculums.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <div className="p-3 bg-gray-100 rounded-full inline-flex mb-3">
                <BookOpen className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">No curriculums saved yet</h3>
              <p className="text-sm text-gray-500">
                Browse available curriculums below and add them to your shortlist to use when posting apprenticeships.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {shortlistedCurriculums.map((curriculum) => (
                <div
                  key={curriculum.shortlistId}
                  className="group flex items-center gap-2 bg-[#14B8A6]/10 border border-[#14B8A6]/30 rounded-full pl-3 pr-1 py-1"
                >
                  <CheckCircle size={14} className="text-[#14B8A6]" />
                  <span className="text-sm font-medium text-[#0A1F44]">{curriculum.name}</span>
                  <button
                    onClick={() => removeFromShortlist(curriculum.shortlistId)}
                    disabled={removingFromShortlist === curriculum.shortlistId}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    {removingFromShortlist === curriculum.shortlistId ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Browse Curriculums Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#0A1F44]/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-[#0A1F44]" />
            </div>
            <h2 className="text-xl font-semibold text-[#0A1F44]">Prentis Curriculum</h2>
            {trainerIndustry && (
              <span className="text-sm text-gray-500">for {trainerIndustry}</span>
            )}
          </div>

          {loadingCurriculums ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#14B8A6]" />
            </div>
          ) : browseCurriculums.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <div className="p-3 bg-gray-100 rounded-full inline-flex mb-3">
                <AlertCircle className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">No curriculums available</h3>
              <p className="text-sm text-gray-500">
                {trainerIndustry
                  ? `No curriculums are currently available for the ${trainerIndustry} industry.`
                  : 'Complete your profile to see available curriculums for your industry.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {browseCurriculums.map((curriculum) => {
                const isInShortlist = curriculum.isInShortlist
                const isEligible = curriculum.eligibility?.isEligible !== false
                const isPlaceholder = curriculum.id.startsWith('placeholder-')

                return (
                  <div
                    key={curriculum.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isInShortlist
                        ? 'bg-[#14B8A6]/10 ring-1 ring-[#14B8A6]'
                        : isEligible
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-gray-50 opacity-50'
                    }`}
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[#0A1F44] text-sm truncate">{curriculum.name}</h3>
                        {curriculum.is_featured && (
                          <span className="text-[9px] font-bold bg-amber-500 text-white px-1 rounded">★</span>
                        )}
                        {isPlaceholder && (
                          <span className="text-[9px] text-gray-400">demo</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {curriculum.duration_weeks}wks • {curriculum.skill_level} • {curriculum.qualification || 'Certificate'} • {curriculum.primary_industry}
                      </div>
                    </div>

                    {/* Action */}
                    {isPlaceholder || !isEligible ? (
                      <Lock size={14} className="text-gray-300" />
                    ) : isInShortlist ? (
                      <CheckCircle size={18} className="text-[#14B8A6]" />
                    ) : (
                      <button
                        onClick={() => addToShortlist(curriculum.id)}
                        disabled={addingToShortlist === curriculum.id}
                        className="p-2 bg-[#0A1F44] hover:bg-[#0A1F44]/80 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        {addingToShortlist === curriculum.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Other Curriculum Options */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#0A1F44] mb-4">Other Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculumOptions.map((option) => {
              const Icon = option.icon
              const isSelected = curriculumType === option.type

              return (
                <div
                  key={option.type}
                  className={`relative bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? 'border-[#14B8A6] shadow-lg shadow-[#14B8A6]/10'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${option.color}`} />

                  <div className="p-6">
                    {/* Status Badge */}
                    <div className="mb-4 min-h-[28px]">
                      {getStatusBadge(option.type)}
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${option.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[#0A1F44] mb-2">
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-6 min-h-[60px]">
                      {option.description}
                    </p>

                    {/* Action Button */}
                    <button
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                        isSelected
                          ? 'bg-[#14B8A6] text-white hover:bg-[#0D9488]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.action}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Uploaded Files Section (if applicable) */}
        {curriculumType === 'own' && curriculumFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-[#0A1F44] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#14B8A6]" />
              Uploaded Files
            </h3>
            <div className="space-y-3">
              {curriculumFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{file}</span>
                  </div>
                  <button className="text-sm text-[#14B8A6] hover:text-[#0D9488] font-medium">
                    View
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0D9488] font-medium">
              <Upload size={16} />
              Upload More Files
            </button>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <h3 className="text-lg font-semibold text-[#0A1F44] mb-2">
            Need Help Choosing?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Not sure which option is right for you? Our team can help you determine the best curriculum approach for your training programs.
          </p>
          <button className="inline-flex items-center gap-2 text-sm text-[#14B8A6] hover:text-[#0D9488] font-medium">
            Contact Support
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

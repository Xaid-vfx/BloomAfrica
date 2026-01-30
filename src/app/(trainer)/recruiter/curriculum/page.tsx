'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { BookOpen, Upload, FileText, Sparkles, CheckCircle, Clock, ExternalLink, Loader2 } from 'lucide-react'

type CurriculumType = 'own' | 'prentis' | 'custom' | 'later' | null

interface TrainerProfile {
  curriculum_type: CurriculumType
  curriculum_files: string[] | null
  curriculum_notes: string | null
}

export default function CurriculumPage() {
  const [loading, setLoading] = useState(true)
  const [curriculumType, setCurriculumType] = useState<CurriculumType>(null)
  const [curriculumFiles, setCurriculumFiles] = useState<string[]>([])
  const [curriculumNotes, setCurriculumNotes] = useState<string>('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchCurriculumData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('TrainerProfiles')
          .select('curriculum_type, curriculum_files, curriculum_notes')
          .eq('user_id', user.id)
          .single()

        if (error) throw error

        if (data) {
          setCurriculumType(data.curriculum_type)
          setCurriculumFiles(data.curriculum_files || [])
          setCurriculumNotes(data.curriculum_notes || '')
        }
      } catch (error) {
        // Fallback to localStorage for development
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const localData = localStorage.getItem(`trainer_profile_${user.id}`)
          if (localData) {
            const parsed = JSON.parse(localData)
            setCurriculumType(parsed.curriculum_type || null)
            setCurriculumFiles(parsed.curriculum_files || [])
            setCurriculumNotes(parsed.curriculum_notes || '')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCurriculumData()
  }, [supabase])

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

  const curriculumOptions = [
    {
      type: 'prentis' as CurriculumType,
      icon: BookOpen,
      title: 'Prentis Curriculums',
      description: 'Access pre-built, industry-standard curriculum packages designed by experts. Ready to use immediately for your training programs.',
      action: 'Browse Curriculums',
      actionHref: '/recruiter/curriculum/browse',
      color: 'from-[#14B8A6] to-[#0D9488]'
    },
    {
      type: 'custom' as CurriculumType,
      icon: Sparkles,
      title: 'Custom Curriculum',
      description: 'Work with our team to design a custom curriculum tailored to your specific industry needs and training objectives.',
      action: 'Request Custom',
      actionHref: '/recruiter/curriculum/request',
      color: 'from-[#8B5CF6] to-[#7C3AED]'
    },
    {
      type: 'own' as CurriculumType,
      icon: Upload,
      title: 'Upload Your Own',
      description: 'Already have your own curriculum? Upload your files and materials to use with your apprenticeship programs.',
      action: 'Upload Files',
      actionHref: '/recruiter/curriculum/upload',
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

        {/* Curriculum Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            )
          })}
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

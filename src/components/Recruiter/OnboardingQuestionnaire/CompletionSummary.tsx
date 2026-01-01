'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Edit, ArrowRight, Building2, Shield, MapPin, GraduationCap, Users } from 'lucide-react'
import { useRecruiter } from '@/context/RecruiterContext'

interface CompletionSummaryProps {
  onEdit: () => void
}

interface ProfileData {
  registrant_full_name?: string
  registrant_position?: string
  registrant_nin?: string
  registrant_phone?: string
  business_name?: string
  trainer_category?: string
  primary_industry?: string
  years_in_operation?: number
  cac_number?: string
  tin_number?: string
  business_registration_date?: string
  bvn_number?: string
  business_registration_url?: string
  owner_manager_id_url?: string
  professional_licenses_urls?: string[]
  physical_address?: string
  workspace_photo_urls?: string[]
  team_size?: number
  facility_features?: string[]
  prentis_accreditation?: boolean
  general_program_types?: string[]
  avg_program_duration?: string
  typical_commitment?: string
  outcome_intent?: string[]
  support_provided?: string[]
}

export default function CompletionSummary({ onEdit, profileData }: CompletionSummaryProps & { profileData?: ProfileData }) {
  const router = useRouter()
  const { trainerProfile } = useRecruiter()

  // Use passed profileData if available, otherwise fall back to context
  const displayData = profileData || trainerProfile

  return (
    <div className="relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Celebration Header */}
          <div className="text-center py-8">
            <div className="bg-[#14B8A6]/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="text-[#14B8A6]" size={48} />
            </div>
            <h1 className="text-4xl font-bold text-[#0A1F44] mb-3">
              Profile Complete!
            </h1>
            <p className="text-lg text-gray-600">
              Your trainer profile has been successfully submitted
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You can now access all platform features
            </p>
          </div>

          {/* Summary Cards */}
          <div className="space-y-4">
            {/* Registrant Information */}
            <SummaryCard
              icon={<User size={20} />}
              title="Registrant Information"
              items={[
                { label: 'Full Name', value: displayData?.registrant_full_name },
                { label: 'Position/Role', value: displayData?.registrant_position },
                { label: 'NIN', value: displayData?.registrant_nin ? `${displayData.registrant_nin.slice(0, 3)}***${displayData.registrant_nin.slice(-3)}` : 'Not provided' },
                { label: 'Phone Number', value: displayData?.registrant_phone },
                { label: 'Government ID', value: displayData?.owner_manager_id_url ? '✓ Uploaded' : 'Not uploaded' }
              ]}
            />

            {/* Business Identity */}
            <SummaryCard
              icon={<Building2 size={20} />}
              title="Business Identity"
              items={[
                { label: 'Business Name', value: displayData?.business_name },
                { label: 'Category', value: displayData?.trainer_category },
                { label: 'Industry', value: displayData?.primary_industry },
                { label: 'Years Operating', value: displayData?.years_in_operation }
              ]}
            />

            {/* Verification & Trust */}
            <SummaryCard
              icon={<Shield size={20} />}
              title="Verification & Trust"
              items={[
                ...(displayData?.trainer_category === 'Company' ? [
                  { label: 'CAC/RC Number', value: displayData?.cac_number },
                  { label: 'TIN', value: displayData?.tin_number },
                  { label: 'Registration Date', value: displayData?.business_registration_date }
                ] : []),
                ...(displayData?.trainer_category === 'Individual/Artisan/Small Business' ? [
                  { label: 'BVN', value: displayData?.bvn_number ? `${displayData.bvn_number.slice(0, 3)}***${displayData.bvn_number.slice(-3)}` : 'Not provided' }
                ] : []),
                { label: 'Business Registration', value: displayData?.business_registration_url ? '✓ Uploaded' : 'Not uploaded' },
                { label: 'Professional Licenses', value: displayData?.professional_licenses_urls?.length ? `${displayData.professional_licenses_urls.length} file(s) uploaded` : 'None' }
              ]}
            />

            {/* Workspace & Facility */}
            <SummaryCard
              icon={<MapPin size={20} />}
              title="Workspace & Facility"
              items={[
                { label: 'Physical Address', value: displayData?.physical_address },
                { label: 'Workspace Photos', value: displayData?.workspace_photo_urls?.length ? `${displayData.workspace_photo_urls.length} photos` : 'None' },
                { label: 'Team Size', value: displayData?.team_size },
                { label: 'Facility Features', value: displayData?.facility_features?.join(', ') || 'None' }
              ]}
            />

            {/* Program Intent & Certification */}
            <SummaryCard
              icon={<GraduationCap size={20} />}
              title="Program Intent & Certification"
              items={[
                { label: 'Prentis Accreditation', value: displayData?.prentis_accreditation ? 'Yes' : 'No' },
                { label: 'Program Types', value: displayData?.general_program_types?.join(', ') || 'None' },
                { label: 'Average Duration', value: displayData?.avg_program_duration },
                { label: 'Commitment', value: displayData?.typical_commitment },
                { label: 'Outcome Intent', value: displayData?.outcome_intent?.join(', ') || 'None' },
                { label: 'Support Provided', value: displayData?.support_provided?.join(', ') || 'None' }
              ]}
            />

            {/* Teaching Team */}
            <SummaryCard
              icon={<Users size={20} />}
              title="Teaching Team"
              items={[
                { label: 'Total Mentors', value: 'Configured' }
              ]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 border-t border-gray-200">
            <button
              onClick={() => router.push('/recruiter/dashboard')}
              className="flex items-center justify-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-8 py-3.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </button>
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3.5 rounded-lg font-medium transition-all"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SummaryCardProps {
  icon: React.ReactNode
  title: string
  items: Array<{ label: string; value: any }>
}

function SummaryCard({ icon, title, items }: SummaryCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-300">
        <div className="p-2 bg-[#14B8A6]/10 rounded-lg text-[#14B8A6]">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-start gap-4">
            <span className="text-sm font-medium text-gray-600">{item.label}:</span>
            <span className="text-sm text-gray-900 text-right flex-1">
              {item.value || 'Not provided'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

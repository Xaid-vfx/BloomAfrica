'use client'

import { Trash2, User } from 'lucide-react'
import FileUploadField from './FileUploadField'

export interface Mentor {
  id: string
  name: string
  yearsExperience: string
  specialization: string
  bio: string
  photo: File | null
}

interface MentorCardProps {
  mentor: Mentor
  index: number
  onChange: (mentor: Mentor) => void
  onRemove: () => void
  errors?: {
    name?: string
    yearsExperience?: string
    specialization?: string
    bio?: string
  }
  showRemove: boolean
}

export default function MentorCard({
  mentor,
  index,
  onChange,
  onRemove,
  errors = {},
  showRemove
}: MentorCardProps) {
  const handleChange = (field: keyof Mentor, value: any) => {
    onChange({
      ...mentor,
      [field]: value
    })
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#14B8A6]/10 rounded-lg">
            <User className="text-[#14B8A6]" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Mentor {index + 1}
          </h3>
        </div>

        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Remove mentor"
          >
            <Trash2 className="text-gray-400 group-hover:text-red-500" size={20} />
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mentor Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mentor Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={mentor.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., John Doe"
            className={`
              w-full px-4 py-2.5 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20
              ${errors.name
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-gray-300 focus:border-[#14B8A6]'
              }
            `}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={mentor.yearsExperience}
            onChange={(e) => handleChange('yearsExperience', e.target.value)}
            placeholder="e.g., 10"
            className={`
              w-full px-4 py-2.5 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20
              ${errors.yearsExperience
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-gray-300 focus:border-[#14B8A6]'
              }
            `}
          />
          {errors.yearsExperience && (
            <p className="text-sm text-red-600 mt-1">{errors.yearsExperience}</p>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={mentor.specialization}
            onChange={(e) => handleChange('specialization', e.target.value)}
            placeholder="e.g., Transmission repair"
            className={`
              w-full px-4 py-2.5 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20
              ${errors.specialization
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-gray-300 focus:border-[#14B8A6]'
              }
            `}
          />
          {errors.specialization && (
            <p className="text-sm text-red-600 mt-1">{errors.specialization}</p>
          )}
        </div>

        {/* Professional Bio */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Bio
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={mentor.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="A 1-sentence summary of their history (e.g., 'Trained 20+ apprentices over 10 years')"
            rows={3}
            className={`
              w-full px-4 py-2.5 rounded-lg border-2 transition-colors resize-none
              focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20
              ${errors.bio
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-gray-300 focus:border-[#14B8A6]'
              }
            `}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.bio ? (
              <p className="text-sm text-red-600">{errors.bio}</p>
            ) : (
              <p className="text-xs text-gray-500">
                Minimum 50 characters
              </p>
            )}
            <p className={`text-xs ${
              mentor.bio.length >= 50 ? 'text-[#14B8A6]' : 'text-gray-500'
            }`}>
              {mentor.bio.length} characters
            </p>
          </div>
        </div>

        {/* Mentor Photo */}
        <div className="md:col-span-2">
          <FileUploadField
            label="Mentor Photo"
            description="A clear photo to build a personal connection with learners (optional)"
            category="MentorPhotos"
            multiple={false}
            required={false}
            value={mentor.photo ? [mentor.photo] : []}
            onChange={(files) => handleChange('photo', files[0] || null)}
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'
import { cn, spacing, typography, touchTargets, formStates } from '@/styles/mobile-design-tokens'

interface SkillsInputProps {
  label?: string
  value: string[]
  onChange: (skills: string[]) => void
  error?: string
  helperText?: string
  required?: boolean
  minSkills?: number
  maxSkills?: number
  placeholder?: string
  suggestions?: string[]
}

export default function SkillsInput({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  minSkills,
  maxSkills = 10,
  placeholder = 'Enter a skill',
  suggestions = [],
}: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addSkill = () => {
    const trimmed = inputValue.trim()

    if (trimmed && value.length < maxSkills && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  const addSuggestion = (suggestion: string) => {
    if (value.length < maxSkills && !value.includes(suggestion)) {
      onChange([...value, suggestion])
    }
  }

  const filteredSuggestions = suggestions.filter(
    s => !value.includes(s) && s.toLowerCase().includes(inputValue.toLowerCase())
  )

  const remainingSkills = minSkills ? Math.max(0, minSkills - value.length) : 0
  const canAddMore = value.length < maxSkills
  const inputDisabled = !canAddMore

  return (
    <div className={cn('w-full', spacing.marginMd)}>
      {/* Label */}
      {label && (
        <label className={cn(typography.label, 'mb-2 block')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Skill count indicator */}
      <div className="flex items-center justify-between mb-2">
        <span className={cn(typography.helper)}>
          {value.length} of {maxSkills} skills
          {remainingSkills > 0 && (
            <span className="text-yellow-600 ml-1">
              ({remainingSkills} more required)
            </span>
          )}
        </span>
        {!canAddMore && (
          <span className={cn(typography.helper, 'text-yellow-600')}>
            Maximum reached
          </span>
        )}
      </div>

      {/* Input and Add button */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(e.target.value.length > 0)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            disabled={inputDisabled}
            className={cn(
              touchTargets.input,
              typography.input,
              'w-full border rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error ? formStates.error : formStates.default,
              inputDisabled && formStates.disabled
            )}
          />

          {/* Suggestions dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addSuggestion(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={addSkill}
          disabled={!inputValue.trim() || inputDisabled}
          className={cn(
            touchTargets.button,
            'bg-[#14B8A6] hover:bg-[#0D9488] text-white font-medium rounded-lg',
            'shadow-md hover:shadow-lg active:scale-95 transition-all',
            'disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none',
            'flex items-center gap-2 px-6'
          )}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Selected skills - Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((skill) => (
            <div
              key={skill}
              className={cn(
                'inline-flex items-center gap-2',
                'bg-teal-50 text-[#14B8A6] border-2 border-teal-200',
                'px-3 py-1.5 rounded-full',
                'font-medium text-sm',
                'group'
              )}
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className={cn(
                  'w-5 h-5 rounded-full',
                  'bg-[#14B8A6] text-white',
                  'flex items-center justify-center',
                  'opacity-70 group-hover:opacity-100 transition-opacity',
                  'hover:bg-[#0D9488] active:scale-90'
                )}
                aria-label={`Remove ${skill}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Suggested skills (if any) */}
      {suggestions.length > 0 && value.length < maxSkills && (
        <div className="mb-2">
          <p className={cn(typography.helper, 'mb-2')}>
            Suggested skills:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions
              .filter(s => !value.includes(s))
              .slice(0, 5)
              .map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addSuggestion(suggestion)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium',
                    'bg-gray-100 text-gray-700',
                    'border border-gray-300',
                    'hover:bg-gray-200 hover:border-gray-400',
                    'transition-all active:scale-95'
                  )}
                >
                  + {suggestion}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className={cn(typography.error, 'mt-1.5 flex items-center gap-1')}>
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className={cn(typography.helper, 'mt-1.5')}>
          {helperText}
        </p>
      )}
    </div>
  )
}

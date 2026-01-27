'use client'

import { forwardRef } from 'react'
import { cn, spacing, typography, touchTargets } from '@/styles/mobile-design-tokens'

export interface ButtonOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface ButtonGroupProps {
  label?: string
  error?: string
  helperText?: string
  options: ButtonOption[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  required?: boolean
  containerClassName?: string
  multiSelect?: boolean
  fullWidth?: boolean
}

const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      value,
      onChange,
      required,
      containerClassName,
      multiSelect = false,
      fullWidth = false,
    },
    ref
  ) => {
    const handleButtonClick = (optionValue: string, disabled?: boolean) => {
      if (disabled) return

      if (multiSelect) {
        const currentValues = Array.isArray(value) ? value : []
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v) => v !== optionValue)
          : [...currentValues, optionValue]
        onChange(newValues)
      } else {
        onChange(optionValue)
      }
    }

    const isSelected = (optionValue: string): boolean => {
      if (multiSelect) {
        return Array.isArray(value) ? value.includes(optionValue) : false
      }
      return value === optionValue
    }

    return (
      <div ref={ref} className={cn('w-full', spacing.marginMd, containerClassName)}>
        {/* Label */}
        {label && (
          <label className={cn(typography.label, 'mb-3 block')}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Button group */}
        <div
          className={cn(
            'flex gap-2',
            fullWidth ? 'flex-col sm:flex-row' : 'flex-wrap'
          )}
          role="group"
          aria-describedby={error ? 'button-group-error' : helperText ? 'button-group-helper' : undefined}
        >
          {options.map((option) => {
            const selected = isSelected(option.value)

            return (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleButtonClick(option.value, option.disabled)}
                className={cn(
                  touchTargets.button,
                  'flex items-center justify-center gap-2 rounded-lg border-2 font-medium transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:ring-offset-2',
                  fullWidth && 'flex-1',
                  selected
                    ? 'bg-[#4640DE] border-[#4640DE] text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
                  option.disabled && 'opacity-50 cursor-not-allowed',
                  !option.disabled && !selected && 'active:scale-95'
                )}
                aria-pressed={selected}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>

        {/* Error message */}
        {error && (
          <p id="button-group-error" className={cn(typography.error, 'mt-1.5 flex items-center gap-1')}>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id="button-group-helper" className={cn(typography.helper, 'mt-1.5')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup

'use client'

import { forwardRef } from 'react'
import { cn, spacing, typography, touchTargets } from '@/styles/mobile-design-tokens'

export interface CheckboxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface CheckboxGroupProps {
  label?: string
  error?: string
  helperText?: string
  options: CheckboxOption[]
  value: string[]
  onChange: (value: string[]) => void
  required?: boolean
  containerClassName?: string
  direction?: 'vertical' | 'horizontal'
}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      value = [],
      onChange,
      required,
      containerClassName,
      direction = 'vertical',
    },
    ref
  ) => {
    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        onChange([...value, optionValue])
      } else {
        onChange(value.filter((v) => v !== optionValue))
      }
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

        {/* Checkboxes */}
        <div
          className={cn(
            'gap-3',
            direction === 'vertical' ? 'flex flex-col' : 'flex flex-wrap'
          )}
          role="group"
          aria-describedby={error ? 'checkbox-group-error' : helperText ? 'checkbox-group-helper' : undefined}
        >
          {options.map((option) => {
            const isChecked = value.includes(option.value)
            const checkboxId = `checkbox-${option.value}`

            return (
              <label
                key={option.value}
                htmlFor={checkboxId}
                className={cn(
                  'flex items-start gap-3 cursor-pointer select-none',
                  touchTargets.listItem,
                  'rounded-lg border-2 transition-all duration-200',
                  isChecked
                    ? 'border-[#4640DE] bg-[#E9EBFD]/50'
                    : 'border-gray-200 hover:border-gray-300 bg-white',
                  option.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {/* Hidden native checkbox for accessibility */}
                <input
                  id={checkboxId}
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  disabled={option.disabled}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                  aria-describedby={option.description ? `${checkboxId}-desc` : undefined}
                />

                {/* Custom checkbox */}
                <div
                  className={cn(
                    'flex-shrink-0 w-6 h-6 rounded border-2 transition-all duration-200 flex items-center justify-center mt-0.5',
                    isChecked
                      ? 'bg-[#4640DE] border-[#4640DE]'
                      : 'bg-white border-gray-300'
                  )}
                >
                  {isChecked && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Label and description */}
                <div className="flex-1 min-w-0">
                  <p className={cn(typography.body, 'font-medium text-gray-900')}>
                    {option.label}
                  </p>
                  {option.description && (
                    <p id={`${checkboxId}-desc`} className={cn(typography.helper, 'mt-0.5')}>
                      {option.description}
                    </p>
                  )}
                </div>
              </label>
            )
          })}
        </div>

        {/* Error message */}
        {error && (
          <p id="checkbox-group-error" className={cn(typography.error, 'mt-1.5 flex items-center gap-1')}>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id="checkbox-group-helper" className={cn(typography.helper, 'mt-1.5')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

CheckboxGroup.displayName = 'CheckboxGroup'

export default CheckboxGroup

'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn, spacing, typography, touchTargets, formStates } from '@/styles/mobile-design-tokens'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  success?: boolean
  containerClassName?: string
  required?: boolean
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder = 'Select an option',
      success,
      containerClassName,
      required,
      disabled,
      ...selectProps
    },
    ref
  ) => {
    const getSelectState = () => {
      if (error) return formStates.error
      if (success) return formStates.success
      if (disabled) return formStates.disabled
      return formStates.default
    }

    return (
      <div className={cn('w-full', spacing.marginMd, containerClassName)}>
        {/* Label */}
        {label && (
          <label className={cn(typography.label, 'mb-2 block')}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select container */}
        <div className="relative">
          {/* Select element */}
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              touchTargets.input,
              typography.input,
              'w-full border rounded-lg appearance-none pr-12 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'cursor-pointer',
              getSelectState(),
              disabled && 'cursor-not-allowed',
              // Style for placeholder/default option
              selectProps.value === '' && 'text-gray-400'
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectProps.id}-error` : helperText ? `${selectProps.id}-helper` : undefined}
            {...selectProps}
          >
            {/* Placeholder option */}
            <option value="" disabled>
              {placeholder}
            </option>

            {/* Options */}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="text-gray-900"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <ChevronDown size={20} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p id={`${selectProps.id}-error`} className={cn(typography.error, 'mt-1.5 flex items-center gap-1')}>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {/* Success message */}
        {success && !error && (
          <p className={cn(typography.success, 'mt-1.5 flex items-center gap-1')}>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Looks good!
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p id={`${selectProps.id}-helper`} className={cn(typography.helper, 'mt-1.5')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

SelectInput.displayName = 'SelectInput'

export default SelectInput

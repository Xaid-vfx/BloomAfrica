'use client'

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn, spacing, typography, touchTargets, formStates } from '@/styles/mobile-design-tokens'

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  success?: boolean
  containerClassName?: string
  required?: boolean
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      success,
      containerClassName,
      required,
      disabled,
      ...inputProps
    },
    ref
  ) => {
    const getInputState = () => {
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

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              touchTargets.input,
              typography.input,
              'w-full border rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              getInputState(),
              disabled && 'cursor-not-allowed'
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputProps.id}-error` : helperText ? `${inputProps.id}-helper` : undefined}
            {...inputProps}
          />

          {/* Right icon */}
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={`${inputProps.id}-error`} className={cn(typography.error, 'mt-1.5 flex items-center gap-1')}>
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
          <p id={`${inputProps.id}-helper`} className={cn(typography.helper, 'mt-1.5')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextInput.displayName = 'TextInput'

export default TextInput

'use client'

import { TextareaHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { cn, spacing, typography, touchTargets, formStates } from '@/styles/mobile-design-tokens'

interface TextAreaInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  label?: string
  error?: string
  helperText?: string
  success?: boolean
  containerClassName?: string
  required?: boolean
  showCharCount?: boolean
  minChars?: number
  maxChars?: number
}

const TextAreaInput = forwardRef<HTMLTextAreaElement, TextAreaInputProps>(
  (
    {
      label,
      error,
      helperText,
      success,
      containerClassName,
      required,
      disabled,
      showCharCount = false,
      minChars,
      maxChars,
      value,
      onChange,
      ...textareaProps
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0)

    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length)
      }
    }, [value])

    const getTextareaState = () => {
      if (error) return formStates.error
      if (success) return formStates.success
      if (disabled) return formStates.disabled
      return formStates.default
    }

    const getCharCountColor = () => {
      if (maxChars && charCount > maxChars) return 'text-red-600'
      if (minChars && charCount < minChars) return 'text-yellow-600'
      if (minChars && charCount >= minChars) return 'text-green-600'
      return 'text-gray-500'
    }

    const getCharCountBgColor = () => {
      if (maxChars && charCount > maxChars) return 'bg-red-50'
      if (minChars && charCount < minChars) return 'bg-yellow-50'
      if (minChars && charCount >= minChars) return 'bg-green-50'
      return 'bg-gray-50'
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      if (onChange) {
        onChange(e)
      }
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

        {/* Textarea container */}
        <div className="relative">
          {/* Textarea element */}
          <textarea
            ref={ref}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            maxLength={maxChars}
            className={cn(
              touchTargets.textarea,
              typography.input,
              'w-full border rounded-lg resize-y transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              getTextareaState(),
              disabled && 'cursor-not-allowed',
              showCharCount && 'pb-10' // Extra padding for floating counter
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaProps.id}-error` : helperText ? `${textareaProps.id}-helper` : undefined}
            {...textareaProps}
          />

          {/* Floating character counter */}
          {showCharCount && (
            <div className="absolute bottom-3 right-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                  getCharCountColor(),
                  getCharCountBgColor(),
                  'border border-current/20'
                )}
              >
                {minChars && charCount < minChars && (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {minChars && charCount >= minChars && (!maxChars || charCount <= maxChars) && (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span>
                  {charCount}
                  {minChars && ` / ${minChars}+ chars`}
                  {!minChars && maxChars && ` / ${maxChars}`}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p id={`${textareaProps.id}-error`} className={cn(typography.error, 'mt-1.5 flex items-center gap-1')}>
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
          <p id={`${textareaProps.id}-helper`} className={cn(typography.helper, 'mt-1.5')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextAreaInput.displayName = 'TextAreaInput'

export default TextAreaInput

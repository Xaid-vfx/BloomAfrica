'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Camera, Upload, X, File, Image as ImageIcon } from 'lucide-react'
import { cn, spacing, typography, touchTargets, borderRadius } from '@/styles/mobile-design-tokens'
import { isImageFile, formatFileSize } from '@/lib/utils/uploadTrainerFile'

interface MobileFileUploadProps {
  label?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number
  value: File[]
  onChange: (files: File[]) => void
  error?: string
  helperText?: string
  required?: boolean
  enableCamera?: boolean
  disabled?: boolean
}

export default function MobileFileUpload({
  label,
  accept = 'image/*,application/pdf',
  multiple = false,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  value,
  onChange,
  error,
  helperText,
  required,
  enableCamera = true,
  disabled,
}: MobileFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<{ [key: string]: string }>({})

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (multiple) {
      const newFiles = [...value, ...files].slice(0, maxFiles)
      onChange(newFiles)
      generatePreviews(files)
    } else {
      onChange(files.slice(0, 1))
      generatePreviews(files.slice(0, 1))
    }

    // Reset input
    e.target.value = ''
  }

  const generatePreviews = async (files: File[]) => {
    const newPreviews: { [key: string]: string } = {}

    for (const file of files) {
      if (isImageFile(file)) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviews(prev => ({
            ...prev,
            [file.name]: reader.result as string
          }))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)

    // Remove preview
    const fileToRemove = value[index]
    setPreviews(prev => {
      const updated = { ...prev }
      delete updated[fileToRemove.name]
      return updated
    })
  }

  const canAddMore = value.length < maxFiles

  return (
    <div className={cn('w-full', spacing.marginMd)}>
      {/* Label */}
      {label && (
        <label className={cn(typography.label, 'mb-2 block')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload area */}
      {canAddMore && (
        <div className="flex gap-2 mb-3">
          {/* File picker button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={cn(
              touchTargets.button,
              'flex-1 flex items-center justify-center gap-2',
              'border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-[#4640DE] hover:bg-[#4640DE]/5',
              'transition-all duration-200',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Upload size={20} />
            <span className="font-medium">Choose {multiple ? 'Files' : 'File'}</span>
          </button>

          {/* Camera button (mobile only) */}
          {enableCamera && accept.includes('image') && (
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={disabled}
              className={cn(
                touchTargets.iconButton,
                'flex items-center justify-center',
                'border-2 border-dashed border-gray-300 rounded-lg',
                'hover:border-[#4640DE] hover:bg-[#4640DE]/5',
                'transition-all duration-200 lg:hidden',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              aria-label="Take photo"
            >
              <Camera size={20} />
            </button>
          )}

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="sr-only"
            disabled={disabled}
          />

          {enableCamera && (
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple={multiple}
              onChange={handleFileSelect}
              className="sr-only"
              disabled={disabled}
            />
          )}
        </div>
      )}

      {/* File count indicator */}
      {multiple && value.length > 0 && (
        <div className="mb-2">
          <span className={cn(typography.helper, value.length >= maxFiles ? 'text-yellow-600' : 'text-gray-500')}>
            {value.length} of {maxFiles} files selected
            {value.length >= maxFiles && ' (maximum reached)'}
          </span>
        </div>
      )}

      {/* Selected files - Grid layout for images */}
      {value.length > 0 && (
        <div className={cn(
          'grid gap-3',
          value.some(f => isImageFile(f)) ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'
        )}>
          {value.map((file, index) => {
            const isImage = isImageFile(file)
            const preview = previews[file.name]

            return (
              <div
                key={`${file.name}-${index}`}
                className={cn(
                  'relative group',
                  borderRadius.md,
                  'border-2 border-gray-200',
                  'overflow-hidden',
                  'bg-white',
                  isImage ? 'aspect-square' : 'p-3'
                )}
              >
                {/* Image preview */}
                {isImage && preview && (
                  <img
                    src={preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* File info */}
                {!isImage && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <File size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(typography.bodySmall, 'font-medium text-gray-900 truncate')}>
                        {file.name}
                      </p>
                      <p className={cn(typography.caption, 'text-gray-500')}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className={cn(
                    'absolute top-1 right-1',
                    'w-7 h-7 rounded-full',
                    'bg-red-500 text-white',
                    'flex items-center justify-center',
                    'opacity-0 group-hover:opacity-100 transition-opacity',
                    'hover:bg-red-600 active:scale-95',
                    'focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                  )}
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={16} />
                </button>

                {/* File name overlay for images */}
                {isImage && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className={cn(typography.caption, 'text-white truncate')}>
                      {file.name}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
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

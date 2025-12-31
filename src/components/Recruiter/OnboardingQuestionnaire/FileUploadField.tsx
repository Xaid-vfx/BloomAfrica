'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  validateFile,
  validateFiles,
  formatFileSize,
  isImageFile,
  createImagePreview,
  type FileCategory
} from '@/lib/uploadTrainerFile/uploadTrainerFile'

interface FileUploadFieldProps {
  label: string
  description?: string
  category: FileCategory
  multiple?: boolean
  required?: boolean
  value: File[]
  onChange: (files: File[]) => void
  error?: string
  minFiles?: number
  maxFiles?: number
}

export default function FileUploadField({
  label,
  description,
  category,
  multiple = false,
  required = false,
  value,
  onChange,
  error,
  minFiles,
  maxFiles
}: FileUploadFieldProps) {
  const [previews, setPreviews] = useState<{ [key: string]: string }>({})
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const filesArray = Array.from(selectedFiles)

    if (multiple) {
      const validation = validateFiles(filesArray, category)
      if (!validation.valid) {
        return
      }

      const newFiles = [...value, ...filesArray]

      // Check if total count exceeds maxFiles
      if (maxFiles && newFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed. You currently have ${value.length} file${value.length !== 1 ? 's' : ''}.`)
        return
      }

      onChange(newFiles)

      // Generate previews for image files
      for (const file of filesArray) {
        if (isImageFile(file)) {
          const preview = await createImagePreview(file)
          setPreviews(prev => ({ ...prev, [file.name]: preview }))
        }
      }
    } else {
      const file = filesArray[0]
      const validation = validateFile(file, category)
      if (!validation.valid) {
        return
      }

      onChange([file])

      // Generate preview for image file
      if (isImageFile(file)) {
        const preview = await createImagePreview(file)
        setPreviews({ [file.name]: preview })
      }
    }
  }

  const handleRemoveFile = (index: number) => {
    const fileToRemove = value[index]
    const newFiles = value.filter((_, i) => i !== index)
    onChange(newFiles)

    // Remove preview
    setPreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[fileToRemove.name]
      return newPreviews
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const isValid = !error && value.length > 0
  const showUploadButton = multiple ? !maxFiles || value.length < maxFiles : value.length === 0

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Upload Area */}
      {showUploadButton && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-6
            transition-all cursor-pointer
            ${isDragging
              ? 'border-[#14B8A6] bg-[#14B8A6]/5'
              : error
                ? 'border-red-300 bg-red-50 hover:border-red-400'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={category === 'BusinessRegistration' || category === 'OwnerID' || category === 'ProfessionalLicenses'
              ? '.pdf,.jpg,.jpeg,.png'
              : '.jpg,.jpeg,.png,.webp'
            }
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3 text-center">
            <div className={`
              p-3 rounded-full
              ${isDragging ? 'bg-[#14B8A6]/10' : 'bg-gray-100'}
            `}>
              <Upload
                className={isDragging ? 'text-[#14B8A6]' : 'text-gray-400'}
                size={24}
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {category === 'WorkspacePhotos' || category === 'MentorPhotos'
                  ? 'JPG, PNG or WEBP (max 5MB)'
                  : 'PDF, JPG or PNG (max 10MB)'
                }
              </p>
              {minFiles && (
                <p className="text-xs text-gray-500 mt-1">
                  Minimum {minFiles} file{minFiles > 1 ? 's' : ''} required
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Preview or Icon */}
              <div className="flex-shrink-0">
                {previews[file.name] ? (
                  <img
                    src={previews[file.name]}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    {isImageFile(file) ? (
                      <ImageIcon size={20} className="text-gray-400" />
                    ) : (
                      <FileText size={20} className="text-gray-400" />
                    )}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0">
                <CheckCircle2 size={20} className="text-[#14B8A6]" />
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File Count Info */}
      {multiple && value.length > 0 && (
        <p className="text-xs text-gray-600">
          {value.length} file{value.length > 1 ? 's' : ''} selected
          {maxFiles && ` (max ${maxFiles})`}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}

      {/* Success State */}
      {isValid && required && (
        <p className="text-sm text-[#14B8A6] flex items-center gap-1">
          <CheckCircle2 size={16} />
          <span>File{value.length > 1 ? 's' : ''} ready for upload</span>
        </p>
      )}
    </div>
  )
}

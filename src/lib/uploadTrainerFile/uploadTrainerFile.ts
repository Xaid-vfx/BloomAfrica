import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export type FileCategory =
  | 'BusinessRegistration'
  | 'OwnerID'
  | 'ProfessionalLicenses'
  | 'WorkspacePhotos'
  | 'MentorPhotos'

export interface FileValidationRules {
  maxSize: number
  allowedTypes: string[]
  maxFiles?: number
  required?: boolean
}

export const FILE_VALIDATION_RULES: Record<FileCategory, FileValidationRules> = {
  BusinessRegistration: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    required: true
  },
  OwnerID: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    required: true
  },
  ProfessionalLicenses: {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxFiles: 5,
    required: false
  },
  WorkspacePhotos: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFiles: 5,
    required: true
  },
  MentorPhotos: {
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    required: false
  }
}

/**
 * Validates a file against the rules for its category
 */
export function validateFile(file: File, category: FileCategory): { valid: boolean; error?: string } {
  const rules = FILE_VALIDATION_RULES[category]

  // Check file size
  if (file.size > rules.maxSize) {
    const maxSizeMB = rules.maxSize / (1024 * 1024)
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    }
  }

  // Check file type
  if (!rules.allowedTypes.includes(file.type)) {
    const allowedExtensions = rules.allowedTypes
      .map(type => type.split('/')[1])
      .join(', ')
    return {
      valid: false,
      error: `File type must be one of: ${allowedExtensions}`
    }
  }

  return { valid: true }
}

/**
 * Validates an array of files
 */
export function validateFiles(files: File[], category: FileCategory): { valid: boolean; error?: string } {
  const rules = FILE_VALIDATION_RULES[category]

  // Check max files limit
  if (rules.maxFiles && files.length > rules.maxFiles) {
    return {
      valid: false,
      error: `Maximum ${rules.maxFiles} files allowed`
    }
  }

  // Validate each file
  for (const file of files) {
    const validation = validateFile(file, category)
    if (!validation.valid) {
      return validation
    }
  }

  return { valid: true }
}

/**
 * Uploads a single file to Supabase Storage with retry logic
 */
export async function uploadFile(
  file: File,
  userId: string,
  category: FileCategory,
  index?: number,
  retries = 3
): Promise<string | null> {
  const supabase = createClientComponentClient()
  const timestamp = Date.now()
  const fileExt = file.name.split('.').pop()

  const fileName = index !== undefined
    ? `${category.toLowerCase()}-${userId}-${index}-${timestamp}.${fileExt}`
    : `${category.toLowerCase()}-${userId}-${timestamp}.${fileExt}`

  const filePath = `/TrainerProfiles/${userId}/${category}/${fileName}`

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from('Docs')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        })

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('Docs')
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error(`Upload attempt ${attempt} failed:`, error)

      if (attempt === retries) {
        toast.error(`Failed to upload ${file.name} after ${retries} attempts`)
        return null
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }

  return null
}

/**
 * Uploads multiple files to Supabase Storage
 */
export async function uploadFiles(
  files: File[],
  userId: string,
  category: FileCategory
): Promise<string[]> {
  const uploadPromises = files.map((file, index) =>
    uploadFile(file, userId, category, index + 1)
  )

  const results = await Promise.all(uploadPromises)
  return results.filter((url): url is string => url !== null)
}

/**
 * Uploads a business registration document
 */
export async function uploadBusinessRegistration(
  file: File,
  userId: string
): Promise<string | null> {
  const validation = validateFile(file, 'BusinessRegistration')
  if (!validation.valid) {
    toast.error(validation.error)
    return null
  }

  return uploadFile(file, userId, 'BusinessRegistration')
}

/**
 * Uploads an owner/manager ID document
 */
export async function uploadOwnerManagerId(
  file: File,
  userId: string
): Promise<string | null> {
  const validation = validateFile(file, 'OwnerID')
  if (!validation.valid) {
    toast.error(validation.error)
    return null
  }

  return uploadFile(file, userId, 'OwnerID')
}

/**
 * Uploads professional license documents
 */
export async function uploadProfessionalLicenses(
  files: File[],
  userId: string
): Promise<string[]> {
  const validation = validateFiles(files, 'ProfessionalLicenses')
  if (!validation.valid) {
    toast.error(validation.error)
    return []
  }

  return uploadFiles(files, userId, 'ProfessionalLicenses')
}

/**
 * Uploads workspace photos
 */
export async function uploadWorkspacePhotos(
  photos: File[],
  userId: string
): Promise<string[]> {
  const validation = validateFiles(photos, 'WorkspacePhotos')
  if (!validation.valid) {
    toast.error(validation.error)
    return []
  }

  // Check minimum requirement (3 photos)
  if (photos.length < 3) {
    toast.error('Please upload at least 3 workspace photos')
    return []
  }

  return uploadFiles(photos, userId, 'WorkspacePhotos')
}

/**
 * Uploads a mentor photo
 */
export async function uploadMentorPhoto(
  photo: File,
  userId: string,
  mentorId: string
): Promise<string | null> {
  const validation = validateFile(photo, 'MentorPhotos')
  if (!validation.valid) {
    toast.error(validation.error)
    return null
  }

  const supabase = createClientComponentClient()
  const timestamp = Date.now()
  const fileExt = photo.name.split('.').pop()
  const fileName = `mentor-${mentorId}-${timestamp}.${fileExt}`
  const filePath = `/TrainerProfiles/${userId}/MentorPhotos/${fileName}`

  try {
    const { error } = await supabase.storage
      .from('Docs')
      .upload(filePath, photo, {
        upsert: true,
        contentType: photo.type
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('Docs')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('Mentor photo upload error:', error)
    toast.error('Failed to upload mentor photo')
    return null
  }
}

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    const supabase = createClientComponentClient()

    // Extract file path from URL
    const urlParts = url.split('/storage/v1/object/public/Docs/')
    if (urlParts.length < 2) {
      console.error('Invalid file URL')
      return false
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('Docs')
      .remove([filePath])

    if (error) throw error

    return true
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}

/**
 * Gets file size in a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Gets file extension from file name
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

/**
 * Checks if file is an image
 */
export function isImageFile(file: File): boolean {
  return file?.type?.startsWith('image/') || false
}

/**
 * Creates a preview URL for an image file
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

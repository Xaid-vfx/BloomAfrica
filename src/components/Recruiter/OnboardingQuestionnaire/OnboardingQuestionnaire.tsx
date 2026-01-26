'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { Save, Building2, Shield, MapPin, GraduationCap, Users, User, CheckCircle2, Rocket, BookOpen, Upload, Sparkles, Clock } from 'lucide-react'
import { useRecruiter } from '@/context/RecruiterContext'
import FileUploadField from './FileUploadField'
import MentorCard, { type Mentor } from './MentorCard'
import SectionNavigation from './SectionNavigation'
import CompletionSummary from './CompletionSummary'
import PricingPopup from '@/components/Recruiter/PricingPopup/PricingPopup'
import {
  calculateSubscription,
  type PricingBreakdown,
  type TrainerCategory,
  type CommitmentType
} from '@/lib/pricing/calculateSubscription'
import {
  uploadBusinessRegistration,
  uploadOwnerManagerId,
  uploadProfessionalLicenses,
  uploadWorkspacePhotos,
  uploadMentorPhoto,
  uploadCurriculumDocument
} from '@/lib/uploadTrainerFile/uploadTrainerFile'
import ProgressIndicator from '@/components/Recruiter/ProgressIndicator/ProgressIndicator'
import MobileFileUpload from '@/components/Recruiter/MobileFileUpload/MobileFileUpload'
import useScrollToError from '@/hooks/useScrollToError'

const SECTION_TITLES = [
  'Registrant Information',
  'Choose Trainer Type',
  'Business Identity',
  'Verification & Trust',
  'Workspace & Facility',
  'Program Intent & Certification',
  'Curriculum',
  'Teaching Team'
]

const INDUSTRY_OPTIONS = [
  'Fashion & Textiles',
  'Automotive',
  'Hardware & Construction',
  'Logistics & Transportation',
  'Food & Beverage',
  'Beauty & Cosmetics',
  'Technology & Electronics',
  'Woodwork & Furniture',
  'Metalwork & Fabrication',
  'Agriculture',
  'Other'
]

const FACILITY_FEATURES = [
  'On-site tools',
  'Safety gear provided',
  'Internet access',
  'Air conditioning',
  'Parking space',
  'Cafeteria/Break room',
  'Library/Resource center'
]

const PROGRAM_TYPES = [
  'Hands-on Craft/Trade',
  'Technical/Engineering',
  'Business & Operations'
]

const OUTCOME_INTENTS = [
  'Direct Hire',
  'Market Ready'
]

const SUPPORT_PROVIDED = [
  'Monthly Stipend',
  'Tools and Equipment',
  'Workspace/Studio Access',
  'Housing/Accommodation'
]

export default function OnboardingQuestionnaire() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, trainerProfile } = useRecruiter()
  const supabase = createClientComponentClient()

  // Navigation state
  const [currentSection, setCurrentSection] = useState(1)
  const [completedSections, setCompletedSections] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'edit' | 'summary'>('edit')

  // Section 1: Registrant Information
  const [registrantFullName, setRegistrantFullName] = useState('')
  const [registrantPosition, setRegistrantPosition] = useState('')
  const [registrantNIN, setRegistrantNIN] = useState('')
  const [registrantPhone, setRegistrantPhone] = useState('')

  // Section 2: Trainer Type & Business Identity
  const [businessName, setBusinessName] = useState('')
  const [trainerCategory, setTrainerCategory] = useState('')
  const [primaryIndustry, setPrimaryIndustry] = useState('')
  const [businessBio, setBusinessBio] = useState('')
  const [yearsInOperation, setYearsInOperation] = useState('')

  // Section 2: Verification & Trust
  const [businessRegistration, setBusinessRegistration] = useState<File[]>([])
  const [ownerManagerId, setOwnerManagerId] = useState<File[]>([])
  const [professionalLicenses, setProfessionalLicenses] = useState<File[]>([])
  const [cacNumber, setCacNumber] = useState('')
  const [tinNumber, setTinNumber] = useState('')
  const [businessRegDate, setBusinessRegDate] = useState('')
  const [bvnNumber, setBvnNumber] = useState('')

  // Section 3: Workspace & Facility
  const [physicalAddress, setPhysicalAddress] = useState('')
  const [workspacePhotos, setWorkspacePhotos] = useState<File[]>([])
  const [facilityFeatures, setFacilityFeatures] = useState<string[]>([])
  const [teamSize, setTeamSize] = useState('')

  // Section 4: Program Intent & Certification
  const [prentisAccreditation, setPrentisAccreditation] = useState<boolean | null>(null)
  const [alternativeCertification, setAlternativeCertification] = useState('')
  const [generalProgramTypes, setGeneralProgramTypes] = useState<string[]>([])
  const [avgProgramDuration, setAvgProgramDuration] = useState('')
  const [typicalCommitment, setTypicalCommitment] = useState('')
  const [outcomeIntent, setOutcomeIntent] = useState<string[]>([])
  const [supportProvided, setSupportProvided] = useState<string[]>([])

  // Section 7: Curriculum
  const [curriculumType, setCurriculumType] = useState<'own' | 'prentis' | 'custom' | 'later' | null>(null)
  const [curriculumFiles, setCurriculumFiles] = useState<File[]>([])
  const [curriculumNotes, setCurriculumNotes] = useState('')

  // Section 8: Teaching Team
  const [requestPrentisTeaching, setRequestPrentisTeaching] = useState<boolean | null>(null)
  const [mentors, setMentors] = useState<Mentor[]>([{
    id: crypto.randomUUID(),
    name: '',
    yearsExperience: '',
    specialization: '',
    bio: '',
    photo: null
  }])

  // UI state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Pricing popup state
  const [showPricingPopup, setShowPricingPopup] = useState(false)
  const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown | null>(null)
  const [savedProfileId, setSavedProfileId] = useState<string | null>(null)

  // Auto-scroll to errors
  useScrollToError({ errors: fieldErrors })
  const [profileId, setProfileId] = useState<string | null>(null)

  // Load saved progress on mount
  useEffect(() => {
    loadSavedProgress()
  }, [])

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (viewMode === 'edit' && !isSubmitting) {
        saveProgress()
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [viewMode, isSubmitting, businessName, trainerCategory, primaryIndustry, businessBio, yearsInOperation, physicalAddress, teamSize, avgProgramDuration, typicalCommitment, alternativeCertification])

  // Sync URL query params with currentSection
  useEffect(() => {
    const sectionParam = searchParams.get('section')
    if (sectionParam) {
      const targetSection = parseInt(sectionParam)
      if (targetSection >= 1 && targetSection <= 8 && targetSection !== currentSection) {
        handleSectionNavigation(targetSection)
      }
    }
  }, [searchParams])

  async function loadSavedProgress() {
    try {
      const { data, error } = await supabase
        .from('TrainerProfiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfileId(data.id)

        // Restore form state
        setRegistrantFullName(data.registrant_full_name || '')
        setRegistrantPosition(data.registrant_position || '')
        setRegistrantNIN(data.registrant_nin || '')
        setRegistrantPhone(data.registrant_phone || '')
        setBusinessName(data.business_name || '')
        setTrainerCategory(data.trainer_category || '')
        setPrimaryIndustry(data.primary_industry || '')
        setBusinessBio(data.business_bio || '')
        setYearsInOperation(data.years_in_operation?.toString() || '')
        setCacNumber(data.cac_number || '')
        setTinNumber(data.tin_number || '')
        setBusinessRegDate(data.business_registration_date || '')
        setBvnNumber(data.bvn_number || '')
        setPhysicalAddress(data.physical_address || '')
        setFacilityFeatures(data.facility_features || [])
        setTeamSize(data.team_size?.toString() || '')
        setPrentisAccreditation(data.prentis_accreditation)
        setAlternativeCertification(data.alternative_certification || '')
        setGeneralProgramTypes(data.general_program_types || [])
        setAvgProgramDuration(data.avg_program_duration || '')
        setTypicalCommitment(data.typical_commitment || '')
        setOutcomeIntent(data.outcome_intent || [])
        setSupportProvided(data.support_provided || [])
        setCurriculumType(data.curriculum_type || null)
        setCurriculumNotes(data.curriculum_notes || '')
        setRequestPrentisTeaching(data.request_prentis_teaching ?? null)

        // Restore navigation state
        setCurrentSection(data.current_section || 1)

        // If completed, show summary
        if (data.is_completed) {
          setViewMode('summary')
        }

        // Load mentors
        const { data: mentorsData } = await supabase
          .from('TrainerMentors')
          .select('*')
          .eq('profile_id', data.id)
          .order('display_order')

        if (mentorsData && mentorsData.length > 0) {
          setMentors(mentorsData.map(m => ({
            id: m.id,
            name: m.mentor_name,
            yearsExperience: m.years_experience?.toString() || '',
            specialization: m.specialization || '',
            bio: m.professional_bio || '',
            photo: null // Can't restore File objects
          })))
        }
      }
    } catch (error) {
      console.log('Database not available - using localStorage for local development')
      // Use localStorage as fallback
      const localData = localStorage.getItem(`trainer_profile_${user.id}`)
      if (localData) {
        const data = JSON.parse(localData)
        setRegistrantFullName(data.registrant_full_name || '')
        setRegistrantPosition(data.registrant_position || '')
        setRegistrantNIN(data.registrant_nin || '')
        setRegistrantPhone(data.registrant_phone || '')
        setBusinessName(data.business_name || '')
        setTrainerCategory(data.trainer_category || '')
        setPrimaryIndustry(data.primary_industry || '')
        setBusinessBio(data.business_bio || '')
        setYearsInOperation(data.years_in_operation?.toString() || '')
        setCacNumber(data.cac_number || '')
        setTinNumber(data.tin_number || '')
        setBusinessRegDate(data.business_registration_date || '')
        setBvnNumber(data.bvn_number || '')
        setPhysicalAddress(data.physical_address || '')
        setFacilityFeatures(data.facility_features || [])
        setTeamSize(data.team_size?.toString() || '')
        setPrentisAccreditation(data.prentis_accreditation)
        setAlternativeCertification(data.alternative_certification || '')
        setGeneralProgramTypes(data.general_program_types || [])
        setAvgProgramDuration(data.avg_program_duration || '')
        setTypicalCommitment(data.typical_commitment || '')
        setOutcomeIntent(data.outcome_intent || [])
        setSupportProvided(data.support_provided || [])
        setCurriculumType(data.curriculum_type || null)
        setCurriculumNotes(data.curriculum_notes || '')
        setRequestPrentisTeaching(data.request_prentis_teaching ?? null)
        setCurrentSection(data.current_section || 1)

        if (data.is_completed) {
          setViewMode('summary')
        }

        if (data.mentors) {
          setMentors(data.mentors)
        }

        if (data.completed_sections) {
          setCompletedSections(data.completed_sections)
        }
      }
    }
  }

  async function saveProgress() {
    return saveProgressWithSections(completedSections)
  }

  async function saveProgressWithSections(sectionsToSave: number[]) {
    setIsSaving(true)
    try {
      const { data, error } = await supabase
        .from('TrainerProfiles')
        .upsert({
          user_id: user.id,
          current_section: currentSection,
          is_completed: false,
          completed_sections: sectionsToSave,
          registrant_full_name: registrantFullName,
          registrant_position: registrantPosition,
          registrant_nin: registrantNIN,
          registrant_phone: registrantPhone,
          business_name: businessName,
          trainer_category: trainerCategory,
          primary_industry: primaryIndustry,
          business_bio: businessBio,
          years_in_operation: yearsInOperation ? parseInt(yearsInOperation) : null,
          cac_number: cacNumber,
          tin_number: tinNumber,
          business_registration_date: businessRegDate,
          bvn_number: bvnNumber,
          physical_address: physicalAddress,
          facility_features: facilityFeatures,
          team_size: teamSize ? parseInt(teamSize) : null,
          prentis_accreditation: prentisAccreditation,
          alternative_certification: alternativeCertification,
          general_program_types: generalProgramTypes,
          avg_program_duration: avgProgramDuration,
          typical_commitment: typicalCommitment,
          outcome_intent: outcomeIntent,
          support_provided: supportProvided,
          curriculum_type: curriculumType,
          curriculum_notes: curriculumNotes,
          request_prentis_teaching: requestPrentisTeaching
        })
        .select()
        .single()

      if (error) throw error

      if (data) {
        setProfileId(data.id)
        setLastSaved(new Date())
      }
    } catch (error) {
      // Use localStorage as fallback
      const localData = {
        user_id: user.id,
        current_section: currentSection,
        is_completed: false,
        registrant_full_name: registrantFullName,
        registrant_position: registrantPosition,
        registrant_nin: registrantNIN,
        registrant_phone: registrantPhone,
        business_name: businessName,
        trainer_category: trainerCategory,
        primary_industry: primaryIndustry,
        business_bio: businessBio,
        years_in_operation: yearsInOperation ? parseInt(yearsInOperation) : null,
        cac_number: cacNumber,
        tin_number: tinNumber,
        business_registration_date: businessRegDate,
        bvn_number: bvnNumber,
        physical_address: physicalAddress,
        facility_features: facilityFeatures,
        team_size: teamSize ? parseInt(teamSize) : null,
        prentis_accreditation: prentisAccreditation,
        alternative_certification: alternativeCertification,
        general_program_types: generalProgramTypes,
        avg_program_duration: avgProgramDuration,
        typical_commitment: typicalCommitment,
        outcome_intent: outcomeIntent,
        support_provided: supportProvided,
        curriculum_type: curriculumType,
        curriculum_notes: curriculumNotes,
        request_prentis_teaching: requestPrentisTeaching,
        mentors: mentors,
        completed_sections: sectionsToSave
      }
      localStorage.setItem(`trainer_profile_${user.id}`, JSON.stringify(localData))
      setLastSaved(new Date())
    } finally {
      setIsSaving(false)
    }
  }

  function validateSection1(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!registrantFullName?.trim()) {
      errors.registrantFullName = 'Full name is required'
    }

    if (!registrantPosition?.trim()) {
      errors.registrantPosition = 'Position/role is required'
    }

    if (!registrantNIN?.trim()) {
      errors.registrantNIN = 'NIN is required'
    } else if (registrantNIN.length !== 11 && registrantNIN.length !== 14) {
      errors.registrantNIN = 'NIN must be 11 or 14 digits'
    }

    if (!registrantPhone?.trim()) {
      errors.registrantPhone = 'Phone number is required'
    }

    if (ownerManagerId.length === 0) {
      errors.ownerManagerId = 'Government-issued ID is required'
    }

    return errors
  }

  function validateSection2(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!trainerCategory) {
      errors.trainerCategory = 'Please select a trainer type'
    }

    return errors
  }

  function validateSection3(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!businessName?.trim()) {
      errors.businessName = 'Business name is required'
    }

    if (!primaryIndustry) {
      errors.primaryIndustry = 'Please select your primary industry'
    }

    if (!businessBio?.trim()) {
      errors.businessBio = 'Business bio is required'
    } else if (businessBio.length < 100) {
      errors.businessBio = 'Business bio must be at least 100 characters'
    }

    if (!yearsInOperation) {
      errors.yearsInOperation = 'Years in operation is required'
    } else if (parseInt(yearsInOperation) < 0) {
      errors.yearsInOperation = 'Must be a positive number'
    }

    return errors
  }

  function validateSection4(): Record<string, string> {
    const errors: Record<string, string> = {}

    // For Company trainers, CAC and TIN are required
    if (trainerCategory === 'Company') {
      if (!cacNumber?.trim()) {
        errors.cacNumber = 'CAC/RC Number is required for companies'
      }

      if (!tinNumber?.trim()) {
        errors.tinNumber = 'Tax Identification Number (TIN) is required'
      }

      if (!businessRegDate) {
        errors.businessRegDate = 'Business registration date is required'
      }
    }

    // For Individual trainers, BVN is required
    if (trainerCategory === 'Individual/Artisan/Small Business') {
      if (!bvnNumber?.trim()) {
        errors.bvnNumber = 'Bank Verification Number (BVN) is required'
      } else if (bvnNumber.length !== 11) {
        errors.bvnNumber = 'BVN must be exactly 11 digits'
      }
    }

    if (businessRegistration.length === 0) {
      errors.businessRegistration = 'Business registration document is required'
    }

    return errors
  }

  function validateSection5(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (!physicalAddress?.trim()) {
      errors.physicalAddress = 'Physical address is required'
    }

    if (workspacePhotos.length < 3) {
      errors.workspacePhotos = 'Please upload at least 3 workspace photos'
    } else if (workspacePhotos.length > 5) {
      errors.workspacePhotos = 'Maximum 5 workspace photos allowed'
    }

    if (facilityFeatures.length === 0) {
      errors.facilityFeatures = 'Please select at least one facility feature'
    }

    if (!teamSize) {
      errors.teamSize = 'Team size is required'
    } else if (parseInt(teamSize) < 1) {
      errors.teamSize = 'Team size must be at least 1'
    }

    return errors
  }

  function validateSection6(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (prentisAccreditation === null) {
      errors.prentisAccreditation = 'Please select yes or no'
    }

    if (prentisAccreditation === false && !alternativeCertification?.trim()) {
      errors.alternativeCertification = 'Please specify alternative certification'
    }

    if (generalProgramTypes.length === 0) {
      errors.generalProgramTypes = 'Please select at least one program type'
    }

    if (!avgProgramDuration) {
      errors.avgProgramDuration = 'Please select average program duration'
    }

    if (!typicalCommitment) {
      errors.typicalCommitment = 'Please select typical commitment'
    }

    if (outcomeIntent.length === 0) {
      errors.outcomeIntent = 'Please select at least one outcome intent'
    }

    if (supportProvided.length === 0) {
      errors.supportProvided = 'Please select at least one type of support provided'
    }

    return errors
  }

  function validateSection7(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (curriculumType === null) {
      errors.curriculumType = 'Please select a curriculum option'
    }

    // If using own curriculum, require file upload
    if (curriculumType === 'own' && curriculumFiles.length === 0) {
      errors.curriculumFiles = 'Please upload your curriculum document'
    }

    // If requesting custom curriculum, require notes/description
    if (curriculumType === 'custom' && !curriculumNotes?.trim()) {
      errors.curriculumNotes = 'Please describe your curriculum requirements'
    }

    return errors
  }

  function validateSection8(): Record<string, string> {
    const errors: Record<string, string> = {}

    if (requestPrentisTeaching === null) {
      errors.requestPrentisTeaching = 'Please select an option'
    }

    // Only validate mentors if they're providing their own team
    if (requestPrentisTeaching === false) {
      if (mentors.length === 0) {
        errors.mentors = 'Please add at least one mentor'
      }

      mentors.forEach((mentor, index) => {
        if (!mentor.name?.trim()) {
          errors[`mentor_${index}_name`] = `Mentor ${index + 1} name is required`
        }

        if (!mentor.yearsExperience) {
          errors[`mentor_${index}_experience`] = `Years of experience required`
        } else if (parseInt(mentor.yearsExperience) < 0) {
          errors[`mentor_${index}_experience`] = 'Must be a positive number'
        }

        if (!mentor.specialization?.trim()) {
          errors[`mentor_${index}_specialization`] = `Specialization required`
        }

        if (!mentor.bio?.trim()) {
          errors[`mentor_${index}_bio`] = `Bio required`
        } else if (mentor.bio.length < 50) {
          errors[`mentor_${index}_bio`] = 'Bio must be at least 50 characters'
        }
      })
    }

    return errors
  }

  function validateCurrentSection(): boolean {
    let errors: Record<string, string> = {}

    switch (currentSection) {
      case 1:
        errors = validateSection1()
        break
      case 2:
        errors = validateSection2()
        break
      case 3:
        errors = validateSection3()
        break
      case 4:
        errors = validateSection4()
        break
      case 5:
        errors = validateSection5()
        break
      case 6:
        errors = validateSection6()
        break
      case 7:
        errors = validateSection7()
        break
      case 8:
        errors = validateSection8()
        break
    }

    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0]
      toast.error(firstError)
      return false
    }

    return true
  }

  // Helper function to update both state and URL
  function goToSection(newSection: number) {
    setCurrentSection(newSection)
    router.push(`/recruiter/onboarding?section=${newSection}`, { scroll: false })
    window.scrollTo(0, 0)
  }

  // Handle section navigation with validation
  async function handleSectionNavigation(targetSection: number) {
    // Check if target section is accessible
    const isAccessible =
      completedSections.includes(targetSection) ||
      targetSection === Math.max(...completedSections, 0) + 1 ||
      targetSection === 1

    if (!isAccessible) {
      toast.error('Please complete previous sections first')
      return
    }

    // If navigating backward, allow it
    if (targetSection < currentSection) {
      goToSection(targetSection)
      return
    }

    // If navigating forward, validate current section first
    if (targetSection > currentSection) {
      if (validateCurrentSection()) {
        const newCompletedSections = Array.from(new Set([...completedSections, currentSection]))
        setCompletedSections(newCompletedSections)

        // Save with the new completed sections immediately
        await saveProgressWithSections(newCompletedSections)

        goToSection(targetSection)
      }
    }
  }

  async function goToNextSection() {
    if (validateCurrentSection()) {
      const newCompletedSections = Array.from(new Set([...completedSections, currentSection]))
      setCompletedSections(newCompletedSections)

      // Save with the new completed sections immediately
      await saveProgressWithSections(newCompletedSections)

      const next = currentSection + 1
      goToSection(next)
    }
  }

  function goToPreviousSection() {
    goToSection(currentSection - 1)
  }

  function addMentor() {
    setMentors([...mentors, {
      id: crypto.randomUUID(),
      name: '',
      yearsExperience: '',
      specialization: '',
      bio: '',
      photo: null
    }])
  }

  function removeMentor(index: number) {
    if (mentors.length > 1) {
      setMentors(mentors.filter((_, i) => i !== index))
    }
  }

  function updateMentor(index: number, updatedMentor: Mentor) {
    const newMentors = [...mentors]
    newMentors[index] = updatedMentor
    setMentors(newMentors)
  }

  function toggleCheckbox(value: string, array: string[], setter: (arr: string[]) => void) {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value))
    } else {
      setter([...array, value])
    }
  }

  async function handleSubmit() {
    if (!validateCurrentSection()) return

    setIsSubmitting(true)

    // Mark the final section as complete
    const newCompletedSections = Array.from(new Set([...completedSections, currentSection]))
    setCompletedSections(newCompletedSections)

    try {
      // Note: File uploads will be skipped in local mode for now
      // Upload files
      const businessRegUrl = businessRegistration[0]
        ? await uploadBusinessRegistration(businessRegistration[0], user.id)
        : null

      const ownerIdUrl = ownerManagerId[0]
        ? await uploadOwnerManagerId(ownerManagerId[0], user.id)
        : null

      const licensesUrls = professionalLicenses.length > 0
        ? await uploadProfessionalLicenses(professionalLicenses, user.id)
        : []

      const workspaceUrls = workspacePhotos.length > 0
        ? await uploadWorkspacePhotos(workspacePhotos, user.id)
        : []

      const curriculumFileUrl = curriculumFiles[0]
        ? await uploadCurriculumDocument(curriculumFiles[0], user.id)
        : null

      // Save trainer profile
      const { data: profileData, error: profileError } = await supabase
        .from('TrainerProfiles')
        .upsert({
          user_id: user.id,
          is_completed: true,
          completed_at: new Date().toISOString(),
          current_section: 8,
          completed_sections: newCompletedSections,
          registrant_full_name: registrantFullName,
          registrant_position: registrantPosition,
          registrant_nin: registrantNIN,
          registrant_phone: registrantPhone,
          business_name: businessName,
          trainer_category: trainerCategory,
          primary_industry: primaryIndustry,
          business_bio: businessBio,
          years_in_operation: parseInt(yearsInOperation),
          cac_number: cacNumber,
          tin_number: tinNumber,
          business_registration_date: businessRegDate,
          bvn_number: bvnNumber,
          business_registration_url: businessRegUrl,
          owner_manager_id_url: ownerIdUrl,
          professional_licenses_urls: licensesUrls,
          physical_address: physicalAddress,
          workspace_photo_urls: workspaceUrls,
          facility_features: facilityFeatures,
          team_size: parseInt(teamSize),
          prentis_accreditation: prentisAccreditation,
          alternative_certification: alternativeCertification,
          general_program_types: generalProgramTypes,
          avg_program_duration: avgProgramDuration,
          typical_commitment: typicalCommitment,
          outcome_intent: outcomeIntent,
          support_provided: supportProvided,
          curriculum_type: curriculumType,
          curriculum_notes: curriculumNotes,
          curriculum_file_url: curriculumFileUrl,
          request_prentis_teaching: requestPrentisTeaching
        })
        .select()
        .single()

      if (profileError) throw profileError

      // Save mentors (only if they have their own team)
      if (requestPrentisTeaching === false) {
        for (let i = 0; i < mentors.length; i++) {
          const mentor = mentors[i]

          let photoUrl = null
          if (mentor.photo) {
            photoUrl = await uploadMentorPhoto(mentor.photo, user.id, mentor.id)
          }

          await supabase.from('TrainerMentors').upsert({
            id: mentor.id,
            profile_id: profileData.id,
            mentor_name: mentor.name,
            years_experience: parseInt(mentor.yearsExperience),
            specialization: mentor.specialization,
            professional_bio: mentor.bio,
            photo_url: photoUrl,
            display_order: i
          })
        }
      }

      // Calculate subscription pricing
      const pricing = calculateSubscription({
        trainerCategory: trainerCategory as TrainerCategory,
        requestPrentisTeaching: requestPrentisTeaching ?? false,
        typicalCommitment: (typicalCommitment as CommitmentType) || 'Part-time',
        primaryIndustry: primaryIndustry,
        prentisAccreditation: prentisAccreditation ?? false,
        outcomeIntent: outcomeIntent,
        curriculumType: curriculumType
      })

      setPricingBreakdown(pricing)
      setSavedProfileId(profileData.id)

      // Create pending subscription
      await savePendingSubscription(profileData.id, pricing)

      // Show pricing popup instead of going to summary
      setShowPricingPopup(true)
    } catch (error) {
      console.log('Database not available - using localStorage for local development')
      // Use localStorage as fallback
      const localData = {
        user_id: user.id,
        is_completed: true,
        completed_at: new Date().toISOString(),
        current_section: 8,
        completed_sections: newCompletedSections,
        registrant_full_name: registrantFullName,
        registrant_position: registrantPosition,
        registrant_nin: registrantNIN,
        registrant_phone: registrantPhone,
        business_name: businessName,
        trainer_category: trainerCategory,
        primary_industry: primaryIndustry,
        business_bio: businessBio,
        years_in_operation: parseInt(yearsInOperation),
        cac_number: cacNumber,
        tin_number: tinNumber,
        business_registration_date: businessRegDate,
        bvn_number: bvnNumber,
        physical_address: physicalAddress,
        facility_features: facilityFeatures,
        team_size: parseInt(teamSize),
        prentis_accreditation: prentisAccreditation,
        alternative_certification: alternativeCertification,
        general_program_types: generalProgramTypes,
        avg_program_duration: avgProgramDuration,
        typical_commitment: typicalCommitment,
        outcome_intent: outcomeIntent,
        support_provided: supportProvided,
        curriculum_type: curriculumType,
        curriculum_notes: curriculumNotes,
        request_prentis_teaching: requestPrentisTeaching,
        mentors: requestPrentisTeaching === false ? mentors : []
      }
      localStorage.setItem(`trainer_profile_${user.id}`, JSON.stringify(localData))
      localStorage.setItem(`trainer_onboarding_complete_${user.id}`, 'true')

      // Calculate subscription pricing for local mode
      const pricing = calculateSubscription({
        trainerCategory: trainerCategory as TrainerCategory,
        requestPrentisTeaching: requestPrentisTeaching ?? false,
        typicalCommitment: (typicalCommitment as CommitmentType) || 'Part-time',
        primaryIndustry: primaryIndustry,
        prentisAccreditation: prentisAccreditation ?? false,
        outcomeIntent: outcomeIntent,
        curriculumType: curriculumType
      })

      setPricingBreakdown(pricing)

      // Save pending subscription to localStorage
      const subscriptionData = {
        user_id: user.id,
        status: 'pending',
        base_tier: pricing.baseTier.name,
        base_amount: pricing.baseTier.amount,
        teaching_team_amount: pricing.addOns.find(a => a.name.includes('Teaching'))?.amount || 0,
        accreditation_amount: pricing.addOns.find(a => a.name.includes('Accreditation'))?.amount || 0,
        direct_hire_amount: pricing.addOns.find(a => a.name.includes('Direct Hire'))?.amount || 0,
        curriculum_amount: pricing.addOns.find(a => a.name.includes('Curriculum'))?.amount || 0,
        industry_multiplier: pricing.industryMultiplier.multiplier,
        subtotal: pricing.subtotal,
        total_amount: pricing.total,
        created_at: new Date().toISOString()
      }
      localStorage.setItem(`trainer_subscription_${user.id}`, JSON.stringify(subscriptionData))

      // Show pricing popup
      setShowPricingPopup(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Save pending subscription to database
  async function savePendingSubscription(profileId: string, pricing: PricingBreakdown) {
    try {
      const teachingAmount = pricing.addOns.find(a => a.name.includes('Teaching'))?.amount || 0
      const accreditationAmount = pricing.addOns.find(a => a.name.includes('Accreditation'))?.amount || 0
      const directHireAmount = pricing.addOns.find(a => a.name.includes('Direct Hire'))?.amount || 0
      const curriculumAmount = pricing.addOns.find(a => a.name.includes('Curriculum'))?.amount || 0

      await supabase.from('TrainerSubscriptions').upsert({
        user_id: user.id,
        profile_id: profileId,
        status: 'pending',
        base_tier: pricing.baseTier.name,
        base_amount: pricing.baseTier.amount,
        teaching_team_amount: teachingAmount,
        accreditation_amount: accreditationAmount,
        direct_hire_amount: directHireAmount,
        curriculum_amount: curriculumAmount,
        industry_multiplier: pricing.industryMultiplier.multiplier,
        subtotal: pricing.subtotal,
        total_amount: pricing.total,
        pricing_input: {
          trainerCategory,
          requestPrentisTeaching,
          typicalCommitment,
          primaryIndustry,
          prentisAccreditation,
          outcomeIntent,
          curriculumType
        }
      })
    } catch (error) {
      console.log('Could not save subscription to database')
    }
  }

  // Handle successful payment
  async function handlePaymentSuccess() {
    try {
      // Update subscription status to active
      await supabase
        .from('TrainerSubscriptions')
        .update({
          status: 'active',
          paid_at: new Date().toISOString(),
          payment_reference: `mock_${Date.now()}`,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .eq('user_id', user.id)
    } catch (error) {
      // Update localStorage for local mode
      const subscriptionData = localStorage.getItem(`trainer_subscription_${user.id}`)
      if (subscriptionData) {
        const data = JSON.parse(subscriptionData)
        data.status = 'active'
        data.paid_at = new Date().toISOString()
        data.payment_reference = `mock_${Date.now()}`
        localStorage.setItem(`trainer_subscription_${user.id}`, JSON.stringify(data))
      }
    }

    setShowPricingPopup(false)
    router.push('/recruiter/dashboard')
    router.refresh()
  }

  // Handle pay later (close popup and go to dashboard)
  function handlePayLater() {
    setShowPricingPopup(false)
    router.push('/recruiter/dashboard')
    router.refresh()
  }

  if (viewMode === 'summary') {
    const profileData = {
      registrant_full_name: registrantFullName,
      registrant_position: registrantPosition,
      registrant_nin: registrantNIN,
      registrant_phone: registrantPhone,
      business_name: businessName,
      trainer_category: trainerCategory,
      primary_industry: primaryIndustry,
      years_in_operation: yearsInOperation ? parseInt(yearsInOperation) : undefined,
      cac_number: cacNumber,
      tin_number: tinNumber,
      business_registration_date: businessRegDate,
      bvn_number: bvnNumber,
      business_registration_url: businessRegistration[0] ? 'uploaded' : undefined,
      owner_manager_id_url: ownerManagerId[0] ? 'uploaded' : undefined,
      professional_licenses_urls: professionalLicenses.length > 0 ? professionalLicenses.map(() => 'uploaded') : undefined,
      physical_address: physicalAddress,
      workspace_photo_urls: workspacePhotos.length > 0 ? workspacePhotos.map(() => 'uploaded') : undefined,
      team_size: teamSize ? parseInt(teamSize) : undefined,
      facility_features: facilityFeatures,
      prentis_accreditation: prentisAccreditation,
      general_program_types: generalProgramTypes,
      avg_program_duration: avgProgramDuration,
      typical_commitment: typicalCommitment,
      outcome_intent: outcomeIntent,
      support_provided: supportProvided
    }
    return <CompletionSummary onEdit={() => {
      // Clear uploaded files when going back to edit mode (files have already been uploaded)
      setBusinessRegistration([])
      setOwnerManagerId([])
      setProfessionalLicenses([])
      setWorkspacePhotos([])
      setViewMode('edit')
    }} profileData={profileData} />
  }

  return (
    <div className="relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-[#0A1F44]">
              Trainer Profile Setup
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-0.5 md:mt-1 hidden sm:block">
              Complete your profile to start training the next generation
            </p>
          </div>

          {/* Save Progress Button - Hidden on mobile */}
          <button
            onClick={saveProgress}
            disabled={isSaving}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
        </div>

        {lastSaved && (
          <p className="hidden lg:block text-xs text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Mobile Progress Indicator */}
      <div className="lg:hidden">
        <ProgressIndicator
          currentStep={currentSection}
          totalSteps={8}
          stepTitle={SECTION_TITLES[currentSection - 1]}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section Content */}
          {currentSection === 1 && (
            <RegistrantInformationSection
              registrantFullName={registrantFullName}
              setRegistrantFullName={setRegistrantFullName}
              registrantPosition={registrantPosition}
              setRegistrantPosition={setRegistrantPosition}
              registrantNIN={registrantNIN}
              setRegistrantNIN={setRegistrantNIN}
              registrantPhone={registrantPhone}
              setRegistrantPhone={setRegistrantPhone}
              ownerManagerId={ownerManagerId}
              setOwnerManagerId={setOwnerManagerId}
              fieldErrors={fieldErrors}
            />
          )}
          {currentSection === 2 && <CategorySelectionSection trainerCategory={trainerCategory} setTrainerCategory={setTrainerCategory} fieldErrors={fieldErrors} />}
          {currentSection === 3 && <BusinessIdentitySection businessName={businessName} setBusinessName={setBusinessName} primaryIndustry={primaryIndustry} setPrimaryIndustry={setPrimaryIndustry} businessBio={businessBio} setBusinessBio={setBusinessBio} yearsInOperation={yearsInOperation} setYearsInOperation={setYearsInOperation} fieldErrors={fieldErrors} />}
          {currentSection === 4 && <VerificationTrustSection businessRegistration={businessRegistration} setBusinessRegistration={setBusinessRegistration} professionalLicenses={professionalLicenses} setProfessionalLicenses={setProfessionalLicenses} cacNumber={cacNumber} setCacNumber={setCacNumber} tinNumber={tinNumber} setTinNumber={setTinNumber} businessRegDate={businessRegDate} setBusinessRegDate={setBusinessRegDate} bvnNumber={bvnNumber} setBvnNumber={setBvnNumber} trainerCategory={trainerCategory} fieldErrors={fieldErrors} />}
          {currentSection === 5 && <WorkspaceFacilitySection physicalAddress={physicalAddress} setPhysicalAddress={setPhysicalAddress} workspacePhotos={workspacePhotos} setWorkspacePhotos={setWorkspacePhotos} facilityFeatures={facilityFeatures} setFacilityFeatures={setFacilityFeatures} teamSize={teamSize} setTeamSize={setTeamSize} fieldErrors={fieldErrors} toggleCheckbox={toggleCheckbox} />}
          {currentSection === 6 && <ProgramIntentSection prentisAccreditation={prentisAccreditation} setPrentisAccreditation={setPrentisAccreditation} alternativeCertification={alternativeCertification} setAlternativeCertification={setAlternativeCertification} generalProgramTypes={generalProgramTypes} setGeneralProgramTypes={setGeneralProgramTypes} avgProgramDuration={avgProgramDuration} setAvgProgramDuration={setAvgProgramDuration} typicalCommitment={typicalCommitment} setTypicalCommitment={setTypicalCommitment} outcomeIntent={outcomeIntent} setOutcomeIntent={setOutcomeIntent} supportProvided={supportProvided} setSupportProvided={setSupportProvided} fieldErrors={fieldErrors} toggleCheckbox={toggleCheckbox} />}
          {currentSection === 7 && <CurriculumSection curriculumType={curriculumType} setCurriculumType={setCurriculumType} curriculumFiles={curriculumFiles} setCurriculumFiles={setCurriculumFiles} curriculumNotes={curriculumNotes} setCurriculumNotes={setCurriculumNotes} fieldErrors={fieldErrors} />}
          {currentSection === 8 && <TeachingTeamSection requestPrentisTeaching={requestPrentisTeaching} setRequestPrentisTeaching={setRequestPrentisTeaching} mentors={mentors} updateMentor={updateMentor} removeMentor={removeMentor} addMentor={addMentor} fieldErrors={fieldErrors} />}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-4 md:px-8 py-4 md:py-6">
        <SectionNavigation
          currentSection={currentSection}
          totalSections={8}
          completedSections={completedSections}
          onPrevious={goToPreviousSection}
          onNext={goToNextSection}
          onSubmit={handleSubmit}
          canGoNext={true}
          isSubmitting={isSubmitting}
          sectionTitles={SECTION_TITLES}
          showBreadcrumbs={false}
        />
      </div>

      {/* Pricing Popup - shown after successful profile submission */}
      {pricingBreakdown && (
        <PricingPopup
          isOpen={showPricingPopup}
          onClose={handlePayLater}
          onPaymentSuccess={handlePaymentSuccess}
          pricing={pricingBreakdown}
          isProcessing={isSubmitting}
        />
      )}
    </div>
  )
}

// ========== SECTION COMPONENTS (EXTRACTED OUTSIDE MAIN COMPONENT) ==========

// Section 1: Registrant Information
function RegistrantInformationSection({
  registrantFullName,
  setRegistrantFullName,
  registrantPosition,
  setRegistrantPosition,
  registrantNIN,
  setRegistrantNIN,
  registrantPhone,
  setRegistrantPhone,
  ownerManagerId,
  setOwnerManagerId,
  fieldErrors
}: {
  registrantFullName: string;
  setRegistrantFullName: (value: string) => void;
  registrantPosition: string;
  setRegistrantPosition: (value: string) => void;
  registrantNIN: string;
  setRegistrantNIN: (value: string) => void;
  registrantPhone: string;
  setRegistrantPhone: (value: string) => void;
  ownerManagerId: File[];
  setOwnerManagerId: (files: File[]) => void;
  fieldErrors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
          <User className="text-[#14B8A6]" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Registrant Information</h2>
          <p className="text-sm text-gray-600">Tell us about the person completing this registration</p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={registrantFullName}
          onChange={(e) => setRegistrantFullName(e.target.value)}
          placeholder="Enter your full name as it appears on your ID"
          className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
            fieldErrors.registrantFullName ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
          }`}
        />
        {fieldErrors.registrantFullName && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.registrantFullName}</p>
        )}
      </div>

      {/* Position/Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Position/Role in Company
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={registrantPosition}
          onChange={(e) => setRegistrantPosition(e.target.value)}
          placeholder="e.g., Owner, Manager, HR Director"
          className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
            fieldErrors.registrantPosition ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
          }`}
        />
        {fieldErrors.registrantPosition && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.registrantPosition}</p>
        )}
      </div>

      {/* NIN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          National Identification Number (NIN)
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={registrantNIN}
          onChange={(e) => setRegistrantNIN(e.target.value)}
          placeholder="Enter your 11 or 14-digit NIN"
          maxLength={14}
          className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
            fieldErrors.registrantNIN ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
          }`}
        />
        {fieldErrors.registrantNIN ? (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.registrantNIN}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Must be 11 or 14 digits</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="tel"
          value={registrantPhone}
          onChange={(e) => setRegistrantPhone(e.target.value)}
          placeholder="e.g., +234 800 000 0000"
          className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
            fieldErrors.registrantPhone ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
          }`}
        />
        {fieldErrors.registrantPhone && (
          <p className="text-sm text-red-600 mt-1">{fieldErrors.registrantPhone}</p>
        )}
      </div>

      {/* Owner/Manager ID */}
      <FileUploadField
        label="Government-Issued ID"
        description="Upload a valid government ID (National ID, Driver's License, International Passport, or Voter's Card)"
        category="OwnerID"
        multiple={false}
        required={true}
        value={ownerManagerId}
        onChange={setOwnerManagerId}
        error={fieldErrors.ownerManagerId}
      />
    </div>
  )
}

// Section 2: Category Selection
function CategorySelectionSection({
  trainerCategory,
  setTrainerCategory,
  fieldErrors
}: {
  trainerCategory: string;
  setTrainerCategory: (value: string) => void;
  fieldErrors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
          <Rocket className="text-[#14B8A6]" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Choose Your Trainer Type</h2>
          <p className="text-sm text-gray-600">Select the option that best describes your training setup</p>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Individual Card */}
        <button
          type="button"
          onClick={() => {
            console.log('Individual card clicked!')
            setTrainerCategory('Individual/Artisan/Small Business')
          }}
          className={`p-6 rounded-xl border-2 transition-all text-left cursor-pointer ${
            trainerCategory === 'Individual/Artisan/Small Business'
              ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-lg'
              : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg ${
              trainerCategory === 'Individual/Artisan/Small Business' ? 'bg-[#14B8A6]/20' : 'bg-gray-100'
            }`}>
              <User className={trainerCategory === 'Individual/Artisan/Small Business' ? 'text-[#14B8A6]' : 'text-gray-500'} size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Individual/Artisan/Small Business</h3>
              <p className="text-sm text-gray-600 mb-3">
                Perfect for solo trainers, master artisans, or small workshops with hands-on apprentice training
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Requirements */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Requirements:</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Government-issued ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Trade association membership (optional)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Workspace photos</span>
                </li>
              </ul>
            </div>

            {/* Expected Outcomes */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Expected Outcomes:</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Train 1-3 apprentices directly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Flexible, hands-on skill transfer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Market-ready certified apprentices</span>
                </li>
              </ul>
            </div>
          </div>
        </button>

        {/* Company Card */}
        <button
          type="button"
          onClick={() => {
            console.log('Company card clicked!')
            setTrainerCategory('Company')
          }}
          className={`p-6 rounded-xl border-2 transition-all text-left cursor-pointer ${
            trainerCategory === 'Company'
              ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-lg'
              : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg ${
              trainerCategory === 'Company' ? 'bg-[#14B8A6]/20' : 'bg-gray-100'
            }`}>
              <Building2 className={trainerCategory === 'Company' ? 'text-[#14B8A6]' : 'text-gray-500'} size={28} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Company/Organization</h3>
              <p className="text-sm text-gray-600 mb-3">
                Ideal for established businesses, startups, or organizations with structured training programs
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Requirements */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Requirements:</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>CAC registration documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Owner/Manager government ID</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Company workspace photos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Professional licenses (if applicable)</span>
                </li>
              </ul>
            </div>

            {/* Expected Outcomes */}
            <div>
              <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Expected Outcomes:</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Apprentice-to-hiring/talent pipeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Structured training programs at scale</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#14B8A6] mt-0.5 flex-shrink-0" />
                  <span>Industry-certified workforce development</span>
                </li>
              </ul>
            </div>
          </div>
        </button>
      </div>

      {/* Error Message */}
      {fieldErrors.trainerCategory && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span>⚠️</span>
          {fieldErrors.trainerCategory}
        </p>
      )}
    </div>
  )
}

// Section 2: Business Identity
function BusinessIdentitySection({
  businessName,
  setBusinessName,
  primaryIndustry,
  setPrimaryIndustry,
  businessBio,
  setBusinessBio,
  yearsInOperation,
  setYearsInOperation,
  fieldErrors
}: {
  businessName: string;
  setBusinessName: (value: string) => void;
  primaryIndustry: string;
  setPrimaryIndustry: (value: string) => void;
  businessBio: string;
  setBusinessBio: (value: string) => void;
  yearsInOperation: string;
  setYearsInOperation: (value: string) => void;
  fieldErrors: Record<string, string>;
}) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
            <Building2 className="text-[#14B8A6]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Business Identity</h2>
            <p className="text-sm text-gray-600">Tell us about your business</p>
          </div>
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business or Workshop Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="The official name that appears on your profile"
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
              fieldErrors.businessName ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
            }`}
          />
          {fieldErrors.businessName && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.businessName}</p>
          )}
        </div>

        {/* Primary Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Industry
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={primaryIndustry}
            onChange={(e) => setPrimaryIndustry(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
              fieldErrors.primaryIndustry ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
            }`}
          >
            <option value="">Select industry</option>
            {INDUSTRY_OPTIONS.map((industry) => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {fieldErrors.primaryIndustry && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.primaryIndustry}</p>
          )}
        </div>

        {/* Business Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Bio
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={businessBio}
            onChange={(e) => setBusinessBio(e.target.value)}
            placeholder="A short description of what you do and your philosophy on training the next generation"
            rows={5}
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
              fieldErrors.businessBio ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {fieldErrors.businessBio ? (
              <p className="text-sm text-red-600">{fieldErrors.businessBio}</p>
            ) : (
              <p className="text-xs text-gray-500">Minimum 100 characters</p>
            )}
            <p className={`text-xs ${businessBio.length >= 100 ? 'text-[#14B8A6]' : 'text-gray-500'}`}>
              {businessBio.length} characters
            </p>
          </div>
        </div>

        {/* Years in Operation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years in Operation
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={yearsInOperation}
            onChange={(e) => setYearsInOperation(e.target.value)}
            placeholder="How long has your business been active?"
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
              fieldErrors.yearsInOperation ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
            }`}
          />
          {fieldErrors.yearsInOperation && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.yearsInOperation}</p>
          )}
        </div>
      </div>
    )
}

// Section 3: Verification & Trust
function VerificationTrustSection({
  businessRegistration,
  setBusinessRegistration,
  professionalLicenses,
  setProfessionalLicenses,
  cacNumber,
  setCacNumber,
  tinNumber,
  setTinNumber,
  businessRegDate,
  setBusinessRegDate,
  bvnNumber,
  setBvnNumber,
  trainerCategory,
  fieldErrors
}: {
  businessRegistration: File[];
  setBusinessRegistration: (files: File[]) => void;
  professionalLicenses: File[];
  setProfessionalLicenses: (files: File[]) => void;
  cacNumber: string;
  setCacNumber: (value: string) => void;
  tinNumber: string;
  setTinNumber: (value: string) => void;
  businessRegDate: string;
  setBusinessRegDate: (value: string) => void;
  bvnNumber: string;
  setBvnNumber: (value: string) => void;
  trainerCategory: string;
  fieldErrors: Record<string, string>;
}) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
            <Shield className="text-[#14B8A6]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Verification & Trust</h2>
            <p className="text-sm text-gray-600">Provide verifiable credentials for your business</p>
          </div>
        </div>

        {/* For Company Trainers */}
        {trainerCategory === 'Company' && (
          <>
            {/* CAC/RC Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CAC/RC Number
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={cacNumber}
                onChange={(e) => setCacNumber(e.target.value)}
                placeholder="Enter your Corporate Affairs Commission registration number"
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
                  fieldErrors.cacNumber ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
                }`}
              />
              {fieldErrors.cacNumber && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.cacNumber}</p>
              )}
            </div>

            {/* TIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Identification Number (TIN)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value)}
                placeholder="Enter your company's TIN"
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
                  fieldErrors.tinNumber ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
                }`}
              />
              {fieldErrors.tinNumber && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.tinNumber}</p>
              )}
            </div>

            {/* Business Registration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Registration Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                value={businessRegDate}
                onChange={(e) => setBusinessRegDate(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
                  fieldErrors.businessRegDate ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
                }`}
              />
              {fieldErrors.businessRegDate && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.businessRegDate}</p>
              )}
            </div>
          </>
        )}

        {/* For Individual/Artisan Trainers */}
        {trainerCategory === 'Individual/Artisan/Small Business' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Verification Number (BVN)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={bvnNumber}
              onChange={(e) => setBvnNumber(e.target.value)}
              placeholder="Enter your 11-digit BVN"
              maxLength={11}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
                fieldErrors.bvnNumber ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
              }`}
            />
            {fieldErrors.bvnNumber ? (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.bvnNumber}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Must be exactly 11 digits</p>
            )}
          </div>
        )}

        {/* Business Registration */}
        <FileUploadField
          label="Business Registration Document"
          description="Upload CAC certificate (for companies) or trade association membership (for individuals)"
          category="BusinessRegistration"
          multiple={false}
          required={true}
          value={businessRegistration}
          onChange={setBusinessRegistration}
          error={fieldErrors.businessRegistration}
        />

        {/* Professional Licenses */}
        <FileUploadField
          label="Professional Licenses (Optional)"
          description="Any industry-specific certifications that prove your right to teach"
          category="ProfessionalLicenses"
          multiple={true}
          required={false}
          value={professionalLicenses}
          onChange={setProfessionalLicenses}
          maxFiles={5}
        />
      </div>
    )
}

// Section 4: Workspace & Facility
function WorkspaceFacilitySection({
  physicalAddress,
  setPhysicalAddress,
  workspacePhotos,
  setWorkspacePhotos,
  facilityFeatures,
  setFacilityFeatures,
  teamSize,
  setTeamSize,
  fieldErrors,
  toggleCheckbox
}: {
  physicalAddress: string;
  setPhysicalAddress: (value: string) => void;
  workspacePhotos: File[];
  setWorkspacePhotos: (files: File[]) => void;
  facilityFeatures: string[];
  setFacilityFeatures: (features: string[]) => void;
  teamSize: string;
  setTeamSize: (value: string) => void;
  fieldErrors: Record<string, string>;
  toggleCheckbox: (value: string, array: string[], setter: (arr: string[]) => void) => void;
}) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
            <MapPin className="text-[#14B8A6]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Workspace & Facility</h2>
            <p className="text-sm text-gray-600">Show learners your training environment</p>
          </div>
        </div>

        {/* Physical Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Physical Address
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={physicalAddress}
            onChange={(e) => setPhysicalAddress(e.target.value)}
            placeholder="The main location where training happens"
            rows={3}
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors resize-none focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
              fieldErrors.physicalAddress ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
            }`}
          />
          {fieldErrors.physicalAddress && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.physicalAddress}</p>
          )}
        </div>

        {/* Workspace Photos */}
        <FileUploadField
          label="Workspace Photos"
          description="Upload 3-5 high-quality images of your workshop, studio, or office. This is the most important trust factor for learners."
          category="WorkspacePhotos"
          multiple={true}
          required={true}
          value={workspacePhotos}
          onChange={setWorkspacePhotos}
          error={fieldErrors.workspacePhotos}
          minFiles={3}
          maxFiles={5}
        />

        {/* Facility Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facility Features
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FACILITY_FEATURES.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleCheckbox(feature, facilityFeatures, setFacilityFeatures)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  facilityFeatures.includes(feature)
                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{feature}</p>
              </button>
            ))}
          </div>
          {fieldErrors.facilityFeatures && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.facilityFeatures}</p>
          )}
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Size
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            placeholder="Total number of employees in your business"
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
              fieldErrors.teamSize ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
            }`}
          />
          {fieldErrors.teamSize && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.teamSize}</p>
          )}
        </div>
      </div>
    )
}

// Section 5: Program Intent & Certification
function ProgramIntentSection({
  prentisAccreditation,
  setPrentisAccreditation,
  alternativeCertification,
  setAlternativeCertification,
  generalProgramTypes,
  setGeneralProgramTypes,
  avgProgramDuration,
  setAvgProgramDuration,
  typicalCommitment,
  setTypicalCommitment,
  outcomeIntent,
  setOutcomeIntent,
  supportProvided,
  setSupportProvided,
  fieldErrors,
  toggleCheckbox
}: {
  prentisAccreditation: boolean | null;
  setPrentisAccreditation: (value: boolean | null) => void;
  alternativeCertification: string;
  setAlternativeCertification: (value: string) => void;
  generalProgramTypes: string[];
  setGeneralProgramTypes: (types: string[]) => void;
  avgProgramDuration: string;
  setAvgProgramDuration: (value: string) => void;
  typicalCommitment: string;
  setTypicalCommitment: (value: string) => void;
  outcomeIntent: string[];
  setOutcomeIntent: (intents: string[]) => void;
  supportProvided: string[];
  setSupportProvided: (support: string[]) => void;
  fieldErrors: Record<string, string>;
  toggleCheckbox: (value: string, array: string[], setter: (arr: string[]) => void) => void;
}) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
            <GraduationCap className="text-[#14B8A6]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Program Intent & Certification</h2>
            <p className="text-sm text-gray-600">Define your training program details</p>
          </div>
        </div>

        {/* Prentis Accreditation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prentis Accreditation
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-600 mb-3">
            Would you like Prentis to award your apprentices with an Accredited Certificate upon successful completion?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: true, label: 'Yes' },
              { value: false, label: 'No' }
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setPrentisAccreditation(option.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  prentisAccreditation === option.value
                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-medium text-gray-900 text-center">{option.label}</p>
              </button>
            ))}
          </div>
          {fieldErrors.prentisAccreditation && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.prentisAccreditation}</p>
          )}
        </div>

        {/* Alternative Certification (conditional) */}
        {prentisAccreditation === false && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alternative Certification
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={alternativeCertification}
              onChange={(e) => setAlternativeCertification(e.target.value)}
              placeholder="Please describe the issuing authority (e.g., Industry Trade Association, Company Seal)"
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
                fieldErrors.alternativeCertification ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
              }`}
            />
            {fieldErrors.alternativeCertification && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.alternativeCertification}</p>
            )}
          </div>
        )}

        {/* General Program Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            General Program Type
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
          <div className="space-y-2">
            {PROGRAM_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleCheckbox(type, generalProgramTypes, setGeneralProgramTypes)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  generalProgramTypes.includes(type)
                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-medium text-gray-900">{type}</p>
              </button>
            ))}
          </div>
          {fieldErrors.generalProgramTypes && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.generalProgramTypes}</p>
          )}
        </div>

        {/* Average Program Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Average Program Duration
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={avgProgramDuration}
            onChange={(e) => setAvgProgramDuration(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 ${
              fieldErrors.avgProgramDuration ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
            }`}
          >
            <option value="">Select duration</option>
            <option value="3-6 months">3-6 months</option>
            <option value="6-12 months">6-12 months</option>
            <option value="1-2 years">1-2 years</option>
            <option value="2+ years">2+ years</option>
          </select>
          {fieldErrors.avgProgramDuration && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.avgProgramDuration}</p>
          )}
        </div>

        {/* Typical Commitment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Typical Commitment
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Full-time', 'Part-time'].map((commitment) => (
              <button
                key={commitment}
                type="button"
                onClick={() => setTypicalCommitment(commitment)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  typicalCommitment === commitment
                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-medium text-gray-900 text-center">{commitment}</p>
              </button>
            ))}
          </div>
          {fieldErrors.typicalCommitment && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.typicalCommitment}</p>
          )}
        </div>

        {/* Outcome Intent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Outcome Intent
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
          <div className="space-y-2">
            {OUTCOME_INTENTS.map((intent) => (
              <button
                key={intent}
                type="button"
                onClick={() => toggleCheckbox(intent, outcomeIntent, setOutcomeIntent)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  outcomeIntent.includes(intent)
                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="font-medium text-gray-900">{intent}</p>
              </button>
            ))}
          </div>
          {fieldErrors.outcomeIntent && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.outcomeIntent}</p>
          )}
        </div>

        {/* Support Provided */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Provided
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">Select all that apply</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUPPORT_PROVIDED.map((support) => (
              <button
                key={support}
                type="button"
                onClick={() => toggleCheckbox(support, supportProvided, setSupportProvided)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  supportProvided.includes(support)
                    ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{support}</p>
              </button>
            ))}
          </div>
          {fieldErrors.supportProvided && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.supportProvided}</p>
          )}
        </div>
      </div>
    )
}

// Section 7: Curriculum
function CurriculumSection({
  curriculumType,
  setCurriculumType,
  curriculumFiles,
  setCurriculumFiles,
  curriculumNotes,
  setCurriculumNotes,
  fieldErrors
}: {
  curriculumType: 'own' | 'prentis' | 'custom' | 'later' | null;
  setCurriculumType: (value: 'own' | 'prentis' | 'custom' | 'later' | null) => void;
  curriculumFiles: File[];
  setCurriculumFiles: (files: File[]) => void;
  curriculumNotes: string;
  setCurriculumNotes: (value: string) => void;
  fieldErrors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
          <BookOpen className="text-[#14B8A6]" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Curriculum</h2>
          <p className="text-sm text-gray-600">How would you like to structure your training program?</p>
        </div>
      </div>

      {/* Curriculum Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose your curriculum approach
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="grid grid-cols-1 gap-4">

          {/* Prentis Curriculum Option */}
          <button
            type="button"
            onClick={() => setCurriculumType('prentis')}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              curriculumType === 'prentis'
                ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${curriculumType === 'prentis' ? 'bg-[#14B8A6]/20' : 'bg-gray-100'}`}>
                <BookOpen className={curriculumType === 'prentis' ? 'text-[#14B8A6]' : 'text-gray-500'} size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">Use Prentis ready-made curriculum</h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-[#14B8A6] text-white rounded-full">Recommended</span>
                </div>
                <p className="text-sm text-gray-600">Choose from our library of professionally designed training programs</p>
              </div>
            </div>
          </button>

          {/* Own Curriculum Option */}
          <button
            type="button"
            onClick={() => setCurriculumType('own')}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              curriculumType === 'own'
                ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${curriculumType === 'own' ? 'bg-[#14B8A6]/20' : 'bg-gray-100'}`}>
                <Upload className={curriculumType === 'own' ? 'text-[#14B8A6]' : 'text-gray-500'} size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">I have my own curriculum</h3>
                <p className="text-sm text-gray-600">Upload your existing training syllabus or curriculum document</p>
              </div>
            </div>
          </button>

          {/* Custom Curriculum Option */}
          <button
            type="button"
            onClick={() => setCurriculumType('custom')}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              curriculumType === 'custom'
                ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${curriculumType === 'custom' ? 'bg-[#14B8A6]/20' : 'bg-gray-100'}`}>
                <Sparkles className={curriculumType === 'custom' ? 'text-[#14B8A6]' : 'text-gray-500'} size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Request custom curriculum</h3>
                <p className="text-sm text-gray-600">Our team will work with you to create a tailored training program</p>
              </div>
            </div>
          </button>

          {/* Decide Later Option */}
          <button
            type="button"
            onClick={() => setCurriculumType('later')}
            className={`p-5 rounded-xl border-2 transition-all text-left ${
              curriculumType === 'later'
                ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-md'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${curriculumType === 'later' ? 'bg-[#14B8A6]/20' : 'bg-gray-100'}`}>
                <Clock className={curriculumType === 'later' ? 'text-[#14B8A6]' : 'text-gray-500'} size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Decide later</h3>
                <p className="text-sm text-gray-600">Skip for now and choose your curriculum after completing onboarding</p>
              </div>
            </div>
          </button>
        </div>
        {fieldErrors.curriculumType && (
          <p className="text-sm text-red-600 mt-2">{fieldErrors.curriculumType}</p>
        )}
      </div>

      {/* Own Curriculum - File Upload */}
      {curriculumType === 'own' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              Upload your curriculum document (PDF, DOC, or DOCX). This should outline your training modules, timeline, and learning objectives.
            </p>
          </div>
          <FileUploadField
            label="Curriculum Document"
            description="Upload your training syllabus or curriculum"
            category="CurriculumDocument"
            multiple={false}
            required={true}
            value={curriculumFiles}
            onChange={setCurriculumFiles}
            error={fieldErrors.curriculumFiles}
          />
        </div>
      )}

      {/* Prentis Curriculum - Info */}
      {curriculumType === 'prentis' && (
        <div className="p-4 bg-[#14B8A6]/10 rounded-xl border border-[#14B8A6]/20">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-[#14B8A6] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Great choice!</h4>
              <p className="text-sm text-gray-600">
                After completing onboarding, you&apos;ll be able to browse and select from our library of industry-standard curricula
                designed for various trades and skill levels. Our curricula are regularly updated to meet current industry standards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Curriculum - Notes */}
      {curriculumType === 'custom' && (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-sm text-purple-800">
              Tell us about your training goals and requirements. Our curriculum specialists will reach out to design a program tailored to your needs.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your curriculum requirements
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={curriculumNotes}
              onChange={(e) => setCurriculumNotes(e.target.value)}
              placeholder="Tell us about the skills you want to teach, your target audience, program goals, and any specific requirements..."
              rows={5}
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20 resize-none ${
                fieldErrors.curriculumNotes ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-gray-300 focus:border-[#14B8A6]'
              }`}
            />
            {fieldErrors.curriculumNotes && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.curriculumNotes}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Be as detailed as possible to help us understand your needs
            </p>
          </div>
        </div>
      )}

      {/* Decide Later - Info */}
      {curriculumType === 'later' && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-start gap-3">
            <Clock className="text-gray-500 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">No problem!</h4>
              <p className="text-sm text-gray-600">
                You can choose or upload your curriculum anytime from your dashboard after completing the onboarding process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Section 8: Teaching Team
function TeachingTeamSection({
  requestPrentisTeaching,
  setRequestPrentisTeaching,
  mentors,
  updateMentor,
  removeMentor,
  addMentor,
  fieldErrors
}: {
  requestPrentisTeaching: boolean | null;
  setRequestPrentisTeaching: (value: boolean | null) => void;
  mentors: Mentor[];
  updateMentor: (index: number, updatedMentor: Mentor) => void;
  removeMentor: (index: number) => void;
  addMentor: () => void;
  fieldErrors: Record<string, string>;
}) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="p-3 bg-[#14B8A6]/10 rounded-lg">
            <Users className="text-[#14B8A6]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Teaching Team</h2>
            <p className="text-sm text-gray-600">Who will be teaching your apprentices?</p>
          </div>
        </div>

        {/* Teaching Team Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you like to handle teaching?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Own Team Option */}
            <button
              type="button"
              onClick={() => setRequestPrentisTeaching(false)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                requestPrentisTeaching === false
                  ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${requestPrentisTeaching === false ? 'bg-[#14B8A6]/20' : 'bg-gray-100'}`}>
                  <Users className={requestPrentisTeaching === false ? 'text-[#14B8A6]' : 'text-gray-500'} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">I have my own teaching team</h3>
                  <p className="text-sm text-gray-600">I will provide mentors who will train the apprentices</p>
                </div>
              </div>
            </button>

            {/* Prentis Team Option */}
            <button
              type="button"
              onClick={() => setRequestPrentisTeaching(true)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                requestPrentisTeaching === true
                  ? 'border-[#14B8A6] bg-[#14B8A6]/5 shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${requestPrentisTeaching === true ? 'bg-[#14B8A6]/20' : 'bg-gray-100'}`}>
                  <GraduationCap className={requestPrentisTeaching === true ? 'text-[#14B8A6]' : 'text-gray-500'} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Request Prentis teaching team</h3>
                  <p className="text-sm text-gray-600">Prentis will provide qualified instructors for your program</p>
                </div>
              </div>
            </button>
          </div>
          {fieldErrors.requestPrentisTeaching && (
            <p className="text-sm text-red-600 mt-2">{fieldErrors.requestPrentisTeaching}</p>
          )}
        </div>

        {/* Prentis Team Info */}
        {requestPrentisTeaching === true && (
          <div className="p-4 bg-[#14B8A6]/10 rounded-xl border border-[#14B8A6]/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-[#14B8A6] mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">We&apos;ll handle the teaching</h4>
                <p className="text-sm text-gray-600">
                  Our team will reach out to discuss your program requirements and match you with qualified instructors.
                  Additional fees may apply based on program duration and complexity.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mentors - Only show if they have their own team */}
        {requestPrentisTeaching === false && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Add the mentors who will be teaching in your program:</p>

            {mentors.map((mentor, index) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                index={index}
                onChange={(updatedMentor) => updateMentor(index, updatedMentor)}
                onRemove={() => removeMentor(index)}
                errors={{
                  name: fieldErrors[`mentor_${index}_name`],
                  yearsExperience: fieldErrors[`mentor_${index}_experience`],
                  specialization: fieldErrors[`mentor_${index}_specialization`],
                  bio: fieldErrors[`mentor_${index}_bio`]
                }}
                showRemove={mentors.length > 1}
              />
            ))}

            {/* Add Another Mentor Button */}
            <button
              type="button"
              onClick={addMentor}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 transition-all group"
            >
              <p className="text-sm font-medium text-gray-600 group-hover:text-[#14B8A6]">
                + Add Another Mentor
              </p>
            </button>

            {fieldErrors.mentors && (
              <p className="text-sm text-red-600">{fieldErrors.mentors}</p>
            )}
          </div>
        )}
      </div>
    )
}

'use client'

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import CountryList from "@/lib/constants/countries"
import { useRouter } from "next/navigation"
import { useRecruiter } from "@/context/RecruiterContext"
import { User, Building2, Globe, MapPin, Upload, Briefcase, Save, X, Wallet, CreditCard, Shield, Users, GraduationCap, BookOpen, Clock, Crown, Sparkles, ChevronRight, Check, XCircle, Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"

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

export default function EditRecruiter() {
    const { user, recruiter, company, trainerProfile, subscription, hasActiveSubscription, isAccountApproved, accountStatus } = useRecruiter()
    const [name, setname] = useState(recruiter?.name)
    const [gender, setgender] = useState(recruiter?.gender)
    const [stateList, setstateList] = useState([])
    const [showSave1, setshowSave1] = useState(false)
    const [showSave2, setshowSave2] = useState(false)
    const [country, setcountry] = useState(recruiter?.country)
    const [state, setstate] = useState(recruiter?.state)
    const [logo, setlogo] = useState<File | null>(null);
    const countryList = CountryList()

    const [cname, setcname] = useState(company?.name)
    const [ctype, setctype] = useState(company?.type)
    const [cwebsite, setcwebsite] = useState(company?.website)
    const [cdesc, setsdesc] = useState(company?.description)

    // Bank details state
    const [accountNumber, setAccountNumber] = useState('')
    const [accountName, setAccountName] = useState('')
    const [bankName, setBankName] = useState('')
    const [bankCode, setBankCode] = useState('')
    const [banks, setBanks] = useState<{code: string; name: string}[]>([])
    const [bankLoading, setBankLoading] = useState(false)
    const [fetchingBanks, setFetchingBanks] = useState(true)
    const [existingBankDetails, setExistingBankDetails] = useState<any>(null)
    const [showSave3, setShowSave3] = useState(false)

    // Trainer Profile fields (from onboarding)
    const [registrantFullName, setRegistrantFullName] = useState(trainerProfile?.registrant_full_name || '')
    const [registrantPosition, setRegistrantPosition] = useState(trainerProfile?.registrant_position || '')
    const [registrantNIN, setRegistrantNIN] = useState(trainerProfile?.registrant_nin || '')
    const [registrantPhone, setRegistrantPhone] = useState(trainerProfile?.registrant_phone || '')
    const [showSaveRegistrant, setShowSaveRegistrant] = useState(false)

    // Business Identity
    const [businessName, setBusinessName] = useState(trainerProfile?.business_name || '')
    const [trainerCategory, setTrainerCategory] = useState(trainerProfile?.trainer_category || '')
    const [primaryIndustry, setPrimaryIndustry] = useState(trainerProfile?.primary_industry || '')
    const [businessBio, setBusinessBio] = useState(trainerProfile?.business_bio || '')
    const [yearsInOperation, setYearsInOperation] = useState(trainerProfile?.years_in_operation?.toString() || '')
    const [showSaveBusiness, setShowSaveBusiness] = useState(false)

    // Verification & Trust
    const [cacNumber, setCacNumber] = useState(trainerProfile?.cac_number || '')
    const [tinNumber, setTinNumber] = useState(trainerProfile?.tin_number || '')
    const [businessRegDate, setBusinessRegDate] = useState(trainerProfile?.business_registration_date || '')
    const [bvnNumber, setBvnNumber] = useState(trainerProfile?.bvn_number || '')
    const [showSaveVerification, setShowSaveVerification] = useState(false)

    // Workspace & Facility
    const [physicalAddress, setPhysicalAddress] = useState(trainerProfile?.physical_address || '')
    const [facilityFeatures, setFacilityFeatures] = useState<string[]>(trainerProfile?.facility_features || [])
    const [teamSize, setTeamSize] = useState(trainerProfile?.team_size?.toString() || '')
    const [showSaveWorkspace, setShowSaveWorkspace] = useState(false)

    // Program Intent
    const [prentisAccreditation, setPrentisAccreditation] = useState<boolean | null>(trainerProfile?.prentis_accreditation ?? null)
    const [alternativeCertification, setAlternativeCertification] = useState(trainerProfile?.alternative_certification || '')
    const [generalProgramTypes, setGeneralProgramTypes] = useState<string[]>(trainerProfile?.general_program_types || [])
    const [avgProgramDuration, setAvgProgramDuration] = useState(trainerProfile?.avg_program_duration || '')
    const [typicalCommitment, setTypicalCommitment] = useState(trainerProfile?.typical_commitment || '')
    const [outcomeIntent, setOutcomeIntent] = useState<string[]>(trainerProfile?.outcome_intent || [])
    const [supportProvided, setSupportProvided] = useState<string[]>(trainerProfile?.support_provided || [])
    const [showSaveProgram, setShowSaveProgram] = useState(false)

    // Curriculum
    const [curriculumType, setCurriculumType] = useState(trainerProfile?.curriculum_type || '')
    const [curriculumNotes, setCurriculumNotes] = useState(trainerProfile?.curriculum_notes || '')
    const [showSaveCurriculum, setShowSaveCurriculum] = useState(false)

    // Teaching Team
    const [requestPrentisTeaching, setRequestPrentisTeaching] = useState<boolean | null>(trainerProfile?.request_prentis_teaching ?? null)
    const [showSaveTeaching, setShowSaveTeaching] = useState(false)

    const router = useRouter()


    async function fetchStates(countryName: string) {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                country: countryName
            })
        })
            .then(response => response.json())
            .then(data => {
                setstateList(data.data.states)
            })
            .catch(error => console.error('Error:', error));
    }

    function handleChange() {
        setshowSave1(true)
    }

    async function handleSave1() {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('Recruiters')
            .update({ "name": name, "gender": gender, "country": country, "state": state })
            .eq('uniqueid', user.id)

        if (error) {
            toast.error("Failed to update personal information")
            console.error(error)
        } else {
            toast.success("Personal information updated successfully")
            router.refresh()
        }
    }

    async function handleSave2() {
        if (logo) await uploadFiles()
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('CompanyInfo')
            .update({ "name": cname, "description": cdesc, "type": ctype, "website": cwebsite })
            .eq('unique_id', user.id)

        if (error) {
            toast.error("Failed to update company information")
            console.error(error)
        } else {
            toast.success("Company information updated successfully")
            router.refresh()
        }
    }
    async function uploadFiles() {
        const supabase = createClientComponentClient()
        const { data: uploadData, error: uploadError } = await supabase.storage.from('Docs').upload(`/CompanyLogo/logo-${user.id}`, logo, {
            upsert: true
        })

        if (uploadError) {
            toast.error("Failed to upload logo")
            console.error(uploadError)
            return
        }

        const { data } = supabase
            .storage
            .from('Docs')
            .getPublicUrl(`/CompanyLogo/logo-${user.id}`)

        const { error: insertError } = await supabase.from('Recruiters').update({ 'logo': data.publicUrl }).eq('uniqueid', user.id)

        if (insertError) {
            toast.error("Failed to save logo URL")
            console.error(insertError)
        }
    }

    useEffect(() => {
        fetchStates(country)
        fetchBanks()
        fetchExistingBankDetails()
    }, [])

    const fetchBanks = async () => {
        try {
            setFetchingBanks(true)
            const response = await fetch('/api/get-banks')
            const data = await response.json()

            if (!response.ok || !data.status) {
                throw new Error(data.error || 'Failed to fetch banks')
            }

            if (Array.isArray(data.data)) {
                setBanks(data.data)
            }
        } catch (error) {
            console.error('Failed to load banks:', error)
        } finally {
            setFetchingBanks(false)
        }
    }

    const fetchExistingBankDetails = async () => {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('RecruiterBankDetails')
            .select('*')
            .eq('recruiter_id', user.id)
            .single()

        if (data) {
            setExistingBankDetails(data)
            setAccountNumber(data.account_number)
            setAccountName(data.account_name)
            setBankName(data.bank_name)
            setBankCode(data.bank_code)
        }
    }

    const handleSaveBankDetails = async () => {
        if (!bankCode) {
            toast.error('Please select a bank')
            return
        }
        if (!accountNumber || accountNumber.length !== 10) {
            toast.error('Please enter a valid 10-digit account number')
            return
        }
        if (!accountName) {
            toast.error('Please enter account name')
            return
        }

        setBankLoading(true)
        try {
            const response = await fetch('/api/create-subaccount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account_number: accountNumber,
                    bank_code: bankCode,
                    business_name: accountName,
                    bank_name: bankName,
                    user_id: user.id
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process bank details')
            }

            toast.success(data.message)
            setShowSave3(false)
            fetchExistingBankDetails()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to process bank details')
        } finally {
            setBankLoading(false)
        }
    }

    // Save Trainer Profile sections
    async function handleSaveTrainerProfile(fields: Record<string, any>, successMessage: string) {
        const supabase = createClientComponentClient()
        const { error } = await supabase
            .from('TrainerProfiles')
            .update(fields)
            .eq('user_id', user.id)

        if (error) {
            toast.error("Failed to update")
            console.error(error)
            return false
        } else {
            toast.success(successMessage)
            router.refresh()
            return true
        }
    }

    async function handleSaveRegistrant() {
        const success = await handleSaveTrainerProfile({
            registrant_full_name: registrantFullName,
            registrant_position: registrantPosition,
            registrant_nin: registrantNIN,
            registrant_phone: registrantPhone
        }, "Registrant information updated successfully")
        if (success) setShowSaveRegistrant(false)
    }

    async function handleSaveBusinessIdentity() {
        const success = await handleSaveTrainerProfile({
            business_name: businessName,
            trainer_category: trainerCategory,
            primary_industry: primaryIndustry,
            business_bio: businessBio,
            years_in_operation: yearsInOperation ? parseInt(yearsInOperation) : null
        }, "Business identity updated successfully")
        if (success) setShowSaveBusiness(false)
    }

    async function handleSaveVerification() {
        const success = await handleSaveTrainerProfile({
            cac_number: cacNumber,
            tin_number: tinNumber,
            business_registration_date: businessRegDate,
            bvn_number: bvnNumber
        }, "Verification details updated successfully")
        if (success) setShowSaveVerification(false)
    }

    async function handleSaveWorkspace() {
        const success = await handleSaveTrainerProfile({
            physical_address: physicalAddress,
            facility_features: facilityFeatures,
            team_size: teamSize ? parseInt(teamSize) : null
        }, "Workspace details updated successfully")
        if (success) setShowSaveWorkspace(false)
    }

    async function handleSaveProgram() {
        const success = await handleSaveTrainerProfile({
            prentis_accreditation: prentisAccreditation,
            alternative_certification: alternativeCertification,
            general_program_types: generalProgramTypes,
            avg_program_duration: avgProgramDuration,
            typical_commitment: typicalCommitment,
            outcome_intent: outcomeIntent,
            support_provided: supportProvided
        }, "Program intent updated successfully")
        if (success) setShowSaveProgram(false)
    }

    async function handleSaveCurriculum() {
        const success = await handleSaveTrainerProfile({
            curriculum_type: curriculumType,
            curriculum_notes: curriculumNotes
        }, "Curriculum settings updated successfully")
        if (success) setShowSaveCurriculum(false)
    }

    async function handleSaveTeaching() {
        const success = await handleSaveTrainerProfile({
            request_prentis_teaching: requestPrentisTeaching
        }, "Teaching team settings updated successfully")
        if (success) setShowSaveTeaching(false)
    }

    // Helper to toggle array items
    function toggleArrayItem(array: string[], item: string, setArray: (arr: string[]) => void) {
        if (array.includes(item)) {
            setArray(array.filter(i => i !== item))
        } else {
            setArray([...array, item])
        }
    }

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            {/* Header Section - Fixed */}
            <div className="flex-shrink-0 px-4 py-6 lg:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Briefcase className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Company Profile</h1>
                </div>
                <p className="text-gray-600">Manage your personal and company information</p>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 lg:p-8">
                {/* My Subscription Card */}
                {subscription && (
                    <div
                        onClick={() => router.push('/recruiter/subscription')}
                        className={`rounded-2xl p-6 mb-6 cursor-pointer transition-all hover:shadow-lg ${
                            subscription.base_tier === 'Corporate'
                                ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200'
                                : 'bg-gradient-to-br from-[#14B8A6]/10 to-[#0D9488]/10 border-2 border-[#14B8A6]/20'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${
                                    subscription.base_tier === 'Corporate'
                                        ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                                        : 'bg-gradient-to-br from-[#14B8A6] to-[#0D9488]'
                                }`}>
                                    {subscription.base_tier === 'Corporate' ? (
                                        <Crown className="h-6 w-6 text-white" />
                                    ) : (
                                        <Sparkles className="h-6 w-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#0A1F44]">
                                        {subscription.base_tier || 'Artisan'} Plan
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-semibold text-[#0A1F44]">
                                            ₦{(subscription.total_amount || 0).toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 text-sm">/month</span>
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                            hasActiveSubscription
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {hasActiveSubscription ? 'Active' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="h-6 w-6 text-gray-400" />
                        </div>

                        {/* Features - List on mobile, Grid on desktop */}
                        <div className="flex flex-col sm:grid sm:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                                <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                    subscription.base_tier === 'Corporate' ? 'bg-green-100' : 'bg-green-100'
                                }`}>
                                    <Check size={12} className="text-green-600" />
                                </div>
                                <span className="text-sm text-gray-700">
                                    {subscription.base_tier === 'Corporate' ? 'Unlimited' : 'Up to 5'} Listings
                                </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                                {(subscription.teaching_team_amount || 0) > 0 ? (
                                    <>
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check size={12} className="text-green-600" />
                                        </div>
                                        <span className="text-sm text-gray-700">Teaching Team</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                            <XCircle size={12} className="text-gray-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">Teaching Team</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                                {(subscription.accreditation_amount || 0) > 0 ? (
                                    <>
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check size={12} className="text-green-600" />
                                        </div>
                                        <span className="text-sm text-gray-700">Accreditation</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                            <XCircle size={12} className="text-gray-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">Accreditation</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                                {(subscription.direct_hire_amount || 0) > 0 ? (
                                    <>
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check size={12} className="text-green-600" />
                                        </div>
                                        <span className="text-sm text-gray-700">Direct Hire</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                            <XCircle size={12} className="text-gray-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">Direct Hire</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                            Click to manage subscription
                            <ChevronRight size={12} />
                        </p>
                    </div>
                )}

                {/* Pending Approval Banner */}
                {!isAccountApproved && accountStatus === 'pending_review' && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-100 rounded-full p-3 flex-shrink-0">
                                <AlertCircle className="text-amber-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-800 mb-1">Account Pending Approval</h3>
                                <p className="text-amber-700 text-sm">
                                    Your account is currently under review. Information submitted during onboarding cannot be edited until your account is approved.
                                    You can still update your personal information, company details, and bank details.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {accountStatus === 'rejected' && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
                                <XCircle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-800 mb-1">Account Not Approved</h3>
                                <p className="text-red-700 text-sm">
                                    Your account application was not approved. Please contact support for more information.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Personal Information Card */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#14B8A6]/10 rounded-full p-3">
                            <User className="text-[#14B8A6]" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-[#0A1F44]">Personal Information</h2>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                onChange={(e) => { setname(e.target.value); handleChange() }}
                                value={name}
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => { setgender(e.target.value); handleChange() }}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white"
                            >
                                <option>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-[#14B8A6]" />
                                Country
                            </label>
                            <select
                                value={country}
                                onChange={(e) => {
                                    setcountry(e.target.value)
                                    fetchStates(e.target.value)
                                    handleChange()
                                }}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white"
                            >
                                <option>Select your country</option>
                                {countryList.map((country, index) => (
                                    <option key={index} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-[#14B8A6]" />
                                State
                            </label>
                            <select
                                value={state}
                                onChange={(e) => { setstate(e.target.value); handleChange() }}
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white"
                            >
                                <option>Select your state</option>
                                {stateList.map((state: any, index) => (
                                    <option key={index} value={state.name}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {showSave1 && (
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setshowSave1(false)}
                                className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={() => { handleSave1().then(() => { setshowSave1(false) }) }}
                                className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Company Information Card */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#0A1F44]/10 rounded-full p-3">
                            <Building2 className="text-[#0A1F44]" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-[#0A1F44]">Company Information</h2>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employer Name</label>
                            <input
                                onChange={(e) => { setcname(e.target.value); setshowSave2(true) }}
                                value={cname}
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position in Company</label>
                            <input
                                onChange={(e) => { setctype(e.target.value); setshowSave2(true) }}
                                value={ctype}
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Globe size={16} className="text-[#14B8A6]" />
                                Website
                            </label>
                            <input
                                onChange={(e) => { setcwebsite(e.target.value); setshowSave2(true) }}
                                value={cwebsite}
                                type="text"
                                placeholder="https://example.com"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Upload size={16} className="text-[#14B8A6]" />
                                Company Logo
                            </label>
                            <input
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setlogo(e.target.files[0]);
                                        setshowSave2(true)
                                    }
                                }}
                                type="file"
                                accept="image/*"
                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#14B8A6]/10 file:text-[#14B8A6] hover:file:bg-[#14B8A6]/20"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                        <textarea
                            rows={4}
                            onChange={(e) => { setsdesc(e.target.value); setshowSave2(true) }}
                            value={cdesc}
                            placeholder="Tell us about your company..."
                            className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {showSave2 && (
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setshowSave2(false)}
                                className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={() => { handleSave2().then(() => { setshowSave2(false) }) }}
                                className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* Bank Details Card */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#14B8A6]/10 rounded-full p-3">
                            <Wallet className="text-[#14B8A6]" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[#0A1F44]">Bank Details</h2>
                            <p className="text-sm text-gray-500">For receiving apprenticeship payments</p>
                        </div>
                    </div>

                    {fetchingBanks ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14B8A6]"></div>
                                <p className="text-[#14B8A6] font-medium text-sm">Loading banks...</p>
                            </div>
                        </div>
                    ) : banks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <p className="text-red-500 mb-4 text-sm">Failed to load banks</p>
                            <button
                                onClick={fetchBanks}
                                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2 rounded-lg text-sm transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                <select
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white"
                                    value={bankCode}
                                    onChange={(e) => {
                                        setBankCode(e.target.value)
                                        const selectedBank = banks.find(bank => bank.code === e.target.value)
                                        setBankName(selectedBank?.name || '')
                                        setShowSave3(true)
                                    }}
                                    disabled={bankLoading}
                                >
                                    <option value="">Select Bank</option>
                                    {banks.map((bank) => (
                                        <option key={bank.code} value={bank.code}>
                                            {bank.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <CreditCard size={16} className="text-[#14B8A6]" />
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
                                    value={accountNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '')
                                        setAccountNumber(value)
                                        setShowSave3(true)
                                    }}
                                    pattern="\d{10}"
                                    maxLength={10}
                                    disabled={bankLoading}
                                    placeholder="Enter 10-digit account number"
                                />
                            </div>

                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors"
                                    value={accountName}
                                    onChange={(e) => {
                                        setAccountName(e.target.value)
                                        setShowSave3(true)
                                    }}
                                    disabled={bankLoading}
                                    placeholder="Enter account holder's name"
                                />
                            </div>
                        </div>
                    )}

                    {showSave3 && banks.length > 0 && (
                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    setShowSave3(false)
                                    // Reset to existing values
                                    if (existingBankDetails) {
                                        setAccountNumber(existingBankDetails.account_number)
                                        setAccountName(existingBankDetails.account_name)
                                        setBankName(existingBankDetails.bank_name)
                                        setBankCode(existingBankDetails.bank_code)
                                    } else {
                                        setAccountNumber('')
                                        setAccountName('')
                                        setBankName('')
                                        setBankCode('')
                                    }
                                }}
                                className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                disabled={bankLoading}
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveBankDetails}
                                disabled={bankLoading}
                                className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30 disabled:opacity-50"
                            >
                                {bankLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        {existingBankDetails ? 'Update Details' : 'Save Bank Details'}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Registrant Information Card */}
                <div className={`bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm transition-shadow ${!isAccountApproved ? 'opacity-75' : 'hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                    <User className="text-[#14B8A6]" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0A1F44]">Registrant Information</h2>
                            </div>
                            {!isAccountApproved && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <Lock size={14} />
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    value={registrantFullName}
                                    onChange={(e) => { setRegistrantFullName(e.target.value); setShowSaveRegistrant(true) }}
                                    type="text"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Position/Role</label>
                                <input
                                    value={registrantPosition}
                                    onChange={(e) => { setRegistrantPosition(e.target.value); setShowSaveRegistrant(true) }}
                                    type="text"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">NIN</label>
                                <input
                                    value={registrantNIN}
                                    onChange={(e) => { setRegistrantNIN(e.target.value); setShowSaveRegistrant(true) }}
                                    type="text"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    value={registrantPhone}
                                    onChange={(e) => { setRegistrantPhone(e.target.value); setShowSaveRegistrant(true) }}
                                    type="tel"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {showSaveRegistrant && isAccountApproved && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSaveRegistrant(false)}
                                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveRegistrant}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                {/* Business Identity Card */}
                <div className={`bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm transition-shadow ${!isAccountApproved ? 'opacity-75' : 'hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                    <Building2 className="text-[#0A1F44]" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0A1F44]">Business Identity</h2>
                            </div>
                            {!isAccountApproved && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <Lock size={14} />
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                <input
                                    value={businessName}
                                    onChange={(e) => { setBusinessName(e.target.value); setShowSaveBusiness(true) }}
                                    type="text"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trainer Category</label>
                                <select
                                    value={trainerCategory}
                                    onChange={(e) => { setTrainerCategory(e.target.value); setShowSaveBusiness(true) }}
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select category</option>
                                    <option value="individual">Individual Trainer</option>
                                    <option value="small_business">Small Business (1-10 employees)</option>
                                    <option value="medium_business">Medium Business (11-50 employees)</option>
                                    <option value="large_business">Large Business (50+ employees)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Industry</label>
                                <select
                                    value={primaryIndustry}
                                    onChange={(e) => { setPrimaryIndustry(e.target.value); setShowSaveBusiness(true) }}
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select industry</option>
                                    {INDUSTRY_OPTIONS.map((industry) => (
                                        <option key={industry} value={industry}>{industry}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Years in Operation</label>
                                <input
                                    value={yearsInOperation}
                                    onChange={(e) => { setYearsInOperation(e.target.value); setShowSaveBusiness(true) }}
                                    type="number"
                                    min="0"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Bio</label>
                                <textarea
                                    value={businessBio}
                                    onChange={(e) => { setBusinessBio(e.target.value); setShowSaveBusiness(true) }}
                                    rows={3}
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    placeholder="Tell us about your business..."
                                />
                            </div>
                        </div>

                        {showSaveBusiness && isAccountApproved && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSaveBusiness(false)}
                                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveBusinessIdentity}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                {/* Verification & Trust Card */}
                <div className={`bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm transition-shadow ${!isAccountApproved ? 'opacity-75' : 'hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                    <Shield className="text-[#14B8A6]" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0A1F44]">Verification & Trust</h2>
                            </div>
                            {!isAccountApproved && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <Lock size={14} />
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">CAC Number</label>
                                <input
                                    value={cacNumber}
                                    onChange={(e) => { setCacNumber(e.target.value); setShowSaveVerification(true) }}
                                    type="text"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">TIN Number</label>
                                <input
                                    value={tinNumber}
                                    onChange={(e) => { setTinNumber(e.target.value); setShowSaveVerification(true) }}
                                    type="text"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">BVN Number</label>
                                <input
                                    value={bvnNumber}
                                    onChange={(e) => { setBvnNumber(e.target.value); setShowSaveVerification(true) }}
                                    type="text"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Registration Date</label>
                                <input
                                    value={businessRegDate}
                                    onChange={(e) => { setBusinessRegDate(e.target.value); setShowSaveVerification(true) }}
                                    type="date"
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {showSaveVerification && isAccountApproved && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSaveVerification(false)}
                                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveVerification}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                {/* Workspace & Facility Card */}
                <div className={`bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm transition-shadow ${!isAccountApproved ? 'opacity-75' : 'hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                    <MapPin className="text-[#0A1F44]" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0A1F44]">Workspace & Facility</h2>
                            </div>
                            {!isAccountApproved && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <Lock size={14} />
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
                                <textarea
                                    value={physicalAddress}
                                    onChange={(e) => { setPhysicalAddress(e.target.value); setShowSaveWorkspace(true) }}
                                    rows={2}
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                                <input
                                    value={teamSize}
                                    onChange={(e) => { setTeamSize(e.target.value); setShowSaveWorkspace(true) }}
                                    type="number"
                                    min="1"
                                    disabled={!isAccountApproved}
                                    className="w-full lg:w-1/2 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Facility Features</label>
                                <div className="flex flex-wrap gap-2">
                                    {FACILITY_FEATURES.map((feature) => (
                                        <button
                                            key={feature}
                                            type="button"
                                            onClick={() => { if (isAccountApproved) { toggleArrayItem(facilityFeatures, feature, setFacilityFeatures); setShowSaveWorkspace(true) } }}
                                            disabled={!isAccountApproved}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                                facilityFeatures.includes(feature)
                                                    ? 'bg-[#14B8A6] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                            }`}
                                        >
                                            {feature}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {showSaveWorkspace && isAccountApproved && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSaveWorkspace(false)}
                                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveWorkspace}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                {/* Program Intent Card */}
                <div className={`bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm transition-shadow ${!isAccountApproved ? 'opacity-75' : 'hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                    <GraduationCap className="text-[#14B8A6]" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0A1F44]">Program Intent & Certification</h2>
                            </div>
                            {!isAccountApproved && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <Lock size={14} />
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Prentis Accreditation</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => { if (isAccountApproved) { setPrentisAccreditation(true); setShowSaveProgram(true) } }}
                                        disabled={!isAccountApproved}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                            prentisAccreditation === true
                                                ? 'bg-[#14B8A6] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                        }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { if (isAccountApproved) { setPrentisAccreditation(false); setShowSaveProgram(true) } }}
                                        disabled={!isAccountApproved}
                                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                            prentisAccreditation === false
                                                ? 'bg-[#14B8A6] text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                        }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {prentisAccreditation === false && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Certification</label>
                                    <input
                                        value={alternativeCertification}
                                        onChange={(e) => { setAlternativeCertification(e.target.value); setShowSaveProgram(true) }}
                                        type="text"
                                        disabled={!isAccountApproved}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        placeholder="Describe your certification approach"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Program Types</label>
                                <div className="flex flex-wrap gap-2">
                                    {PROGRAM_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => { if (isAccountApproved) { toggleArrayItem(generalProgramTypes, type, setGeneralProgramTypes); setShowSaveProgram(true) } }}
                                            disabled={!isAccountApproved}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                                generalProgramTypes.includes(type)
                                                    ? 'bg-[#14B8A6] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Average Program Duration</label>
                                    <select
                                        value={avgProgramDuration}
                                        onChange={(e) => { setAvgProgramDuration(e.target.value); setShowSaveProgram(true) }}
                                        disabled={!isAccountApproved}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select duration</option>
                                        <option value="1-3 months">1-3 months</option>
                                        <option value="3-6 months">3-6 months</option>
                                        <option value="6-12 months">6-12 months</option>
                                        <option value="12+ months">12+ months</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Typical Commitment</label>
                                    <select
                                        value={typicalCommitment}
                                        onChange={(e) => { setTypicalCommitment(e.target.value); setShowSaveProgram(true) }}
                                        disabled={!isAccountApproved}
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select commitment</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="flexible">Flexible</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Outcome Intent</label>
                                <div className="flex flex-wrap gap-2">
                                    {OUTCOME_INTENTS.map((intent) => (
                                        <button
                                            key={intent}
                                            type="button"
                                            onClick={() => { if (isAccountApproved) { toggleArrayItem(outcomeIntent, intent, setOutcomeIntent); setShowSaveProgram(true) } }}
                                            disabled={!isAccountApproved}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                                outcomeIntent.includes(intent)
                                                    ? 'bg-[#14B8A6] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                            }`}
                                        >
                                            {intent}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Support Provided</label>
                                <div className="flex flex-wrap gap-2">
                                    {SUPPORT_PROVIDED.map((support) => (
                                        <button
                                            key={support}
                                            type="button"
                                            onClick={() => { if (isAccountApproved) { toggleArrayItem(supportProvided, support, setSupportProvided); setShowSaveProgram(true) } }}
                                            disabled={!isAccountApproved}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                                supportProvided.includes(support)
                                                    ? 'bg-[#14B8A6] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                            }`}
                                        >
                                            {support}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {showSaveProgram && isAccountApproved && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSaveProgram(false)}
                                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProgram}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                {/* Curriculum Card */}
                <div className={`bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm transition-shadow ${!isAccountApproved ? 'opacity-75' : 'hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#0A1F44]/10 rounded-full p-3">
                                    <BookOpen className="text-[#0A1F44]" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0A1F44]">Curriculum Settings</h2>
                            </div>
                            {!isAccountApproved && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <Lock size={14} />
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Type</label>
                                <select
                                    value={curriculumType}
                                    onChange={(e) => { setCurriculumType(e.target.value); setShowSaveCurriculum(true) }}
                                    disabled={!isAccountApproved}
                                    className="w-full lg:w-1/2 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select type</option>
                                    <option value="own">Own Curriculum</option>
                                    <option value="prentis">Prentis Curriculum</option>
                                    <option value="custom">Custom/Hybrid</option>
                                    <option value="later">Decide Later</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Notes</label>
                                <textarea
                                    value={curriculumNotes}
                                    onChange={(e) => { setCurriculumNotes(e.target.value); setShowSaveCurriculum(true) }}
                                    rows={3}
                                    disabled={!isAccountApproved}
                                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:border-[#14B8A6] focus:outline-none transition-colors resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                                    placeholder="Additional notes about your curriculum..."
                                />
                            </div>
                        </div>

                        {showSaveCurriculum && isAccountApproved && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSaveCurriculum(false)}
                                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveCurriculum}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                {/* Teaching Team Card */}
                <div className={`bg-white border-2 border-gray-100 rounded-2xl px-4 py-6 lg:p-8 mt-6 shadow-sm transition-shadow ${!isAccountApproved ? 'opacity-75' : 'hover:shadow-md'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#14B8A6]/10 rounded-full p-3">
                                    <Users className="text-[#14B8A6]" size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-[#0A1F44]">Teaching Team</h2>
                            </div>
                            {!isAccountApproved && (
                                <div className="flex items-center gap-1.5 text-amber-600 text-sm">
                                    <Lock size={14} />
                                    <span>Locked</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Request Prentis Teaching Support</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => { if (isAccountApproved) { setRequestPrentisTeaching(true); setShowSaveTeaching(true) } }}
                                    disabled={!isAccountApproved}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                        requestPrentisTeaching === true
                                            ? 'bg-[#14B8A6] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                    }`}
                                >
                                    Yes, I need support
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { if (isAccountApproved) { setRequestPrentisTeaching(false); setShowSaveTeaching(true) } }}
                                    disabled={!isAccountApproved}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                                        requestPrentisTeaching === false
                                            ? 'bg-[#14B8A6] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100'
                                    }`}
                                >
                                    No, I have my own team
                                </button>
                            </div>
                        </div>

                        {showSaveTeaching && isAccountApproved && (
                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setShowSaveTeaching(false)}
                                    className="flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors"
                                >
                                    <X size={18} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveTeaching}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0D9488] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-[#14B8A6]/30"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>
            </div>
        </div>
    )
}
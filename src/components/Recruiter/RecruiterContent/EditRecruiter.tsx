'use client'

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import CountryList from "@/lib/CountryList/CountryList"
import { useRouter } from "next/navigation"
import { useRecruiter } from "@/context/RecruiterContext"
import { User, Building2, Globe, MapPin, Upload, Briefcase, Save, X, Wallet, CreditCard } from "lucide-react"
import { toast } from "sonner"

export default function EditRecruiter() {
    const { user, recruiter, company } = useRecruiter()
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

    return (
        <div className='relative flex flex-col h-full w-full bg-white rounded-none lg:rounded-2xl border-0 lg:border border-gray-100 shadow-none lg:shadow-lg overflow-hidden'>
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.03] pointer-events-none -z-10" style={{ transform: 'translate(20%, -10%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            {/* Header Section - Fixed */}
            <div className="flex-shrink-0 p-6 lg:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Briefcase className="text-[#14B8A6]" size={28} />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0A1F44]">Company Profile</h1>
                </div>
                <p className="text-gray-600">Manage your personal and company information</p>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                {/* Personal Information Card */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
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
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
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
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 lg:p-8 mt-6 shadow-sm hover:shadow-md transition-shadow">
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
            </div>
        </div>
    )
}
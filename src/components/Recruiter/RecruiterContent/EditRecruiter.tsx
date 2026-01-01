'use client'

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import CountryList from "@/lib/CountryList/CountryList"
import { useRouter } from "next/navigation"
import { useRecruiter } from "@/context/RecruiterContext"
import { User, Building2, Globe, MapPin, Upload, Briefcase, Save, X } from "lucide-react"
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
    }, [])

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
            </div>
        </div>
    )
}
'use client'
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import CountryList from "@/lib/CountryList/CountryList"
import { useRouter } from "next/navigation"
import { User, GraduationCap, Briefcase, MapPin, Calendar, FileText, Upload } from "lucide-react"

type Props = {
    user: any
    seeker: any
    education: any
    experience: any
}

export default function EditSeeker(props: Props) {
    const [name, setname] = useState(props.seeker?.name)
    const [bio, setbio] = useState(props.seeker?.bio)
    const [gender, setgender] = useState(props.seeker?.gender)
    const [stateList, setstateList] = useState([])
    const [country, setcountry] = useState(props.seeker?.country)
    const [state, setstate] = useState(props.seeker?.state)
    const countryList = CountryList()

    const [ename, setename] = useState(props.education?.school_name)
    const [efield, setefield] = useState(props.education?.field)
    const [eyear, seteyear] = useState(props.education?.year)
    const [elevel, setelevel] = useState(props.education?.level)

    const [cname, setcname] = useState(props.experience?.company_name)
    const [sdate, setsdate] = useState<Date | undefined>(props.experience?.start_date)
    const [edate, setedate] = useState<Date | undefined>(props.experience?.end_date);
    const [ctitle, setctitle] = useState(props.experience?.title)
    const [cv, setcv] = useState<File | null>(null);
    const [cover, setcover] = useState<File | null>(null);

    const [showSave1, setshowSave1] = useState(false)
    const [showSave2, setshowSave2] = useState(false)
    const [showSave3, setshowSave3] = useState(false)

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
            .from('Seekers')
            .update({ "name": name, "gender": gender, "country": country, "state": state, "bio": bio })
            .eq('unique_id', props.user.id)

        console.log(error);
        console.log(data);
        router.refresh()
    }

    async function handleSave2() {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('Education')
            .update({ "school_name": ename, "level": elevel, "field": efield, "year": eyear })
            .eq('unique_id', props.user.id)

        console.log(error);
        console.log(data);
        router.refresh()
    }

    async function handleSave3() {
        const supabase = createClientComponentClient()
        if (cv || cover) uploadFiles()
        const { data, error } = await supabase
            .from('Experience')
            .upsert({ "company_name": cname, "title": ctitle, "start_date": sdate, "end_date": edate })
            .eq('unique_id', props.user.id)

        console.log(error);
        console.log(data);
        router.refresh()
    }

    async function uploadFiles() {
        const supabase = createClientComponentClient()
        if (cv) {
            const { data: uploadData, error: uploadError } = await supabase.storage.from('Docs').upload(`/CV/cv-${props.user.id}`, cv)

            const { data } = supabase
                .storage
                .from('Docs')
                .getPublicUrl(`/CV/cv-${props.user.id}`)

            const { data: insertData, error: insertError } = await supabase.from('Experience').upsert({ 'cv': data.publicUrl }).eq('unique_id', props.user.id)
            console.log(insertData);
            console.log(insertError);
            console.log(uploadData);

        }
        else {
            const { data: uploadData2, error: uploadError2 } = await supabase.storage.from('Docs').upload(`/CV/cover-${props.user.id}`, cover)
        }
    }

    useEffect(() => {
        fetchStates(country)
    }, [])

    return (
        <div className="relative min-h-screen">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[400px] h-[400px] opacity-[0.04] pointer-events-none -z-10" style={{ transform: 'translate(30%, -20%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute bottom-0 left-0 w-[350px] h-[350px] opacity-[0.05] pointer-events-none -z-10" style={{ transform: 'translate(-25%, 25%)' }}>
                <path fill="#0A1F44" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A1F44] mb-2">Edit Profile</h1>
                <p className="text-gray-600">Keep your information up to date</p>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <User className="text-[#14B8A6]" size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#0A1F44]">Personal Information</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            onChange={(e) => { setname(e.target.value); handleChange() }}
                            value={name}
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                        </label>
                        <select
                            value={gender}
                            onChange={(e) => { setgender(e.target.value); handleChange() }}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                        >
                            <option value="">Select gender</option>
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
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                        >
                            <option value="">Select your country</option>
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
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                        >
                            <option value="">Select your state</option>
                            {stateList.map((state, index) => (
                                <option key={index} value={state.name}>{state.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-[#14B8A6]" />
                            Bio
                        </label>
                        <textarea
                            rows={4}
                            onChange={(e) => { setbio(e.target.value); handleChange() }}
                            value={bio}
                            placeholder="Tell us about yourself..."
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors resize-none"
                        />
                    </div>
                </div>

                {showSave1 && (
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => { setshowSave1(false) }}
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { handleSave1().then(x => { setshowSave1(false) }) }}
                            className="px-6 py-2.5 bg-[#14B8A6] text-white rounded-xl font-medium hover:bg-[#0D9488] transition-colors shadow-lg shadow-[#14B8A6]/30"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <GraduationCap className="text-[#14B8A6]" size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#0A1F44]">Education</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            School Name
                        </label>
                        <input
                            onChange={(e) => { setename(e.target.value); setshowSave2(true) }}
                            value={ename}
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                            placeholder="Enter school name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Field of Study
                        </label>
                        <input
                            onChange={(e) => { setefield(e.target.value); setshowSave2(true) }}
                            value={efield}
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                            placeholder="e.g., Computer Science"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-[#14B8A6]" />
                            Year
                        </label>
                        <input
                            onChange={(e) => { seteyear(e.target.value); setshowSave2(true) }}
                            value={eyear}
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                            placeholder="e.g., 2020"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Level
                        </label>
                        <input
                            onChange={(e) => { setelevel(e.target.value); setshowSave2(true) }}
                            value={elevel}
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                            placeholder="e.g., Bachelor's Degree"
                        />
                    </div>
                </div>

                {showSave2 && (
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => { setshowSave2(false) }}
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { handleSave2().then(x => { setshowSave2(false) }) }}
                            className="px-6 py-2.5 bg-[#14B8A6] text-white rounded-xl font-medium hover:bg-[#0D9488] transition-colors shadow-lg shadow-[#14B8A6]/30"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Work Experience Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#14B8A6]/10 rounded-full p-3">
                        <Briefcase className="text-[#14B8A6]" size={24} />
                    </div>
                    <h2 className="text-2xl font-semibold text-[#0A1F44]">Work Experience</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name of Employer
                        </label>
                        <input
                            onChange={(e) => { setcname(e.target.value); setshowSave3(true) }}
                            value={cname}
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                            placeholder="Enter employer name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title
                        </label>
                        <input
                            onChange={(e) => { setctitle(e.target.value); setshowSave3(true) }}
                            value={ctitle}
                            type="text"
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                            placeholder="e.g., Software Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-[#14B8A6]" />
                            Start Date
                        </label>
                        <input
                            type="date"
                            onChange={(e) => { setsdate(e.target.value); setshowSave3(true) }}
                            value={sdate}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-[#14B8A6]" />
                            End Date
                        </label>
                        <input
                            type="date"
                            onChange={(e) => { setedate(e.target.value); setshowSave3(true) }}
                            value={edate}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Upload size={16} className="text-[#14B8A6]" />
                            CV / Resume
                        </label>
                        <input
                            type="file"
                            onChange={(e) => {
                                console.log(e.target.files[0]);
                                setcv(e.target.files[0]);
                                setshowSave3(true)
                            }}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#14B8A6]/10 file:text-[#14B8A6] hover:file:bg-[#14B8A6]/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Upload size={16} className="text-[#14B8A6]" />
                            Cover Letter
                        </label>
                        <input
                            type="file"
                            onChange={(e) => { setcover(e.target.files); setshowSave3(true) }}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#14B8A6] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#14B8A6]/10 file:text-[#14B8A6] hover:file:bg-[#14B8A6]/20"
                        />
                    </div>
                </div>

                {showSave3 && (
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={() => { setshowSave3(false) }}
                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { handleSave3().then(x => { setshowSave3(false) }) }}
                            className="px-6 py-2.5 bg-[#14B8A6] text-white rounded-xl font-medium hover:bg-[#0D9488] transition-colors shadow-lg shadow-[#14B8A6]/30"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

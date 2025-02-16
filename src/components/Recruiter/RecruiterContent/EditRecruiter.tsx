import { Input } from "@mui/material"
import { useEffect, useState } from "react"
import EditInput from "./EditInput"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import CountryList from "@/lib/CountryList/CountryList"
import { useRouter } from "next/navigation"
import { IoMdArrowRoundBack } from "react-icons/io"


type Props = {
    user: any
    recruiter: any
    company: any
    handleChangeTabIndex: (index: number) => void
}
export default function EditRecruiter(props: Props) {
    const [name, setname] = useState(props.recruiter?.name)
    const [gender, setgender] = useState(props.recruiter?.gender)
    const [stateList, setstateList] = useState([])
    const [showSave1, setshowSave1] = useState(false)
    const [showSave2, setshowSave2] = useState(false)
    const [country, setcountry] = useState(props.recruiter?.country)
    const [state, setstate] = useState(props.recruiter?.state)
    const [logo, setlogo] = useState<File | null>(null);
    const countryList = CountryList()

    const [cname, setcname] = useState(props.company?.name)
    const [ctype, setctype] = useState(props.company?.type)
    const [cwebsite, setcwebsite] = useState(props.company?.website)
    const [cdesc, setsdesc] = useState(props.company?.description)

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

    console.log(props.company);

    function handleChange() {
        setshowSave1(true)
    }

    async function handleSave1() {
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('Recruiters')
            .update({ "name": name, "gender": gender, "country": country, "state": state })
            .eq('uniqueid', props.user.id)

        console.log(error);
        console.log(data);
        router.refresh()
    }

    async function handleSave2() {
        if (logo) uploadFiles()
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
            .from('CompanyInfo')
            .update({ "name": cname, "description": cdesc, "type": ctype, "website": cwebsite })
            .eq('unique_id', props.user.id)

        console.log(error);
        console.log(data);
        router.refresh()
    }
    async function uploadFiles() {
        const supabase = createClientComponentClient()
        const { data: uploadData, error: uploadError } = await supabase.storage.from('Docs').upload(`/CompanyLogo/logo-${props.user.id}`, logo)

        const { data } = supabase
            .storage
            .from('Docs')
            .getPublicUrl(`/CompanyLogo/logo-${props.user.id}`)

        const { data: insertData, error: insertError } = await supabase.from('Recruiters').upsert({ 'logo': data.publicUrl }).eq('uniqueid', props.user.id)
        console.log(insertData);
        console.log(insertError);
        console.log(uploadData);

    }

    useEffect(() => {
        fetchStates(country)
    }, [])

    return (
        <div className="lg:py-8 lg:px-8 lg:bg-[#F5F5F5] h-[95%] w-full">
            <button
                onClick={() => props.handleChangeTabIndex(0)}
                className="lg:hidden flex items-center gap-2 text-[#4A2C84] hover:underline px-4 mb-6"
            >
                <IoMdArrowRoundBack className="text-xl" />
                <span>Back to Dashboard</span>
            </button>

            <div className="flex flex-col border-gray-300 border-[1px] h-full w-full rounded-xl bg-white p-3 lg:p-8 overflow-scroll">
                <h1 className="text-2xl font-bold text-[#4A2C84] mb-6">Edit Profile</h1>
                <div>
                    <div className="bg-white rounded-xl lg:mt-6">
                        <div>
                            <h1 className="text-xl font-[500] text-[#4A2C84]">Personal Information</h1>
                            <div className="my-6">
                                <div className="grid gap-y-2 lg:grid-cols-2 items-center gap-x-2 w-full">
                                    <div className="">
                                        <h2 className="mb-1 text-sm font-medium ">Name</h2>
                                        <input onChange={(e) => { setname(e.target.value); handleChange() }} value={name} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                    </div>
                                    <div className="">
                                        <p className="font-semibold text-sm my-1 text-[#515B6F]">Gender</p>
                                        <select value={gender} onChange={(e) => {
                                            setgender(e.target.value)
                                            handleChange()
                                        }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                            <option>Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div className="">
                                        <p className="font-semibold text-xs my-1 text-[#515B6F]">Country</p>
                                        <select value={country} onChange={(e) => {
                                            setcountry(e.target.value)
                                            fetchStates(e.target.value)
                                            handleChange()
                                        }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                            <option>Select your country</option>
                                            {
                                                countryList.map((country) => {
                                                    return <option value={country}>{country}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="">
                                        <p className="font-semibold text-xs my-1 text-[#515B6F]">State</p>
                                        <select value={state} onChange={(e) => {
                                            setstate(e.target.value)
                                            handleChange()
                                        }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                            <option>Select your state</option>
                                            {
                                                stateList.map((state) => {
                                                    return <option className="my-4" value={state.name}>{state.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {
                                showSave1 && <div className="flex w-full justify-end gap-4">
                                    <button onClick={() => { setshowSave1(false) }} className="border border-black rounded-lg px-4 py-1">Cancel</button>
                                    <button onClick={() => { handleSave1().then(x => { setshowSave1(false) }) }} className="bg-[#4A2C84] text-white px-4 py-1 rounded-lg">Save</button>
                                </div>
                            }
                        </div>
                        <div className="mt-10">
                            <h1 className="text-xl font-[500] text-[#4A2C84]">Company Information</h1>
                            <div className="my-6">
                                <div className="grid gap-y-2 lg:grid-cols-2 items-center gap-x-2 w-full">
                                    <div className="">
                                        <h2 className="mb-1 text-sm font-medium ">Employer Name</h2>
                                        <input onChange={(e) => { setcname(e.target.value); setshowSave2(true) }} value={cname} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                    </div>
                                    <div className="">
                                        <h2 className="mb-1 text-sm font-medium ">Position in Company</h2>
                                        <input onChange={(e) => { setctype(e.target.value); setshowSave2(true) }} value={ctype} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                    </div>

                                    <div className="">
                                        <h2 className="mb-1 text-sm font-medium ">Website</h2>
                                        <input onChange={(e) => { setcwebsite(e.target.value); setshowSave2(true) }} value={cwebsite} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                    </div>
                                    <div className="">
                                        <h2 className="mb-1 font-medium ">Logo</h2>
                                        <input onChange={(e) => {
                                            console.log(e.target.files[0]);
                                            setlogo(e.target.files[0]); setshowSave2(true)
                                        }} type="file" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                    </div>
                                </div>
                                <div className="my-2">
                                    <h2 className="mb-1 text-sm font-medium w-full">Description</h2>
                                    <textarea rows={4} onChange={(e) => { setsdesc(e.target.value); setshowSave2(true) }} value={cdesc} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                {
                                    showSave2 && <div className="flex w-full justify-end gap-4">
                                        <button onClick={() => { setshowSave2(false) }} className="border border-black rounded-lg px-4 py-1">Cancel</button>
                                        <button onClick={() => { handleSave2().then(x => { setshowSave2(false) }) }} className="bg-[#4A2C84] text-white px-4 py-1 rounded-lg">Save</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
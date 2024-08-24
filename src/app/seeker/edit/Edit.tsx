'use client'
import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import CountryList from "@/lib/CountryList/CountryList"
import { useRouter } from "next/navigation"

export const metadata: Metadata = {
    title: 'Edit Profile | Bloom'
}


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
            .update({ "name": name, "gender": gender, "country": country, "state": state })
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
        <div className="lg:py-8 lg:px-8 lg:bg-[#F5F5F5] h-[95%] w-full overflow-scroll">
            <h1 className="font-semibold text-xl ml-4 hidden lg:block">Edit Profile
            </h1>
            <p onClick={() => { }} className="my-4 px-4 lg:hidden hover:underline cursor-pointer text-xl font-semibold flex items-center gap-4">Edit Profile</p>
            <hr className="h-px lg:hidden bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>
            <div>
                <div className="bg-white rounded-xl p-6 lg:mt-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-[#4A2C84]">Personal Information</h1>
                        <div className="my-6">
                            <div className="grid gap-y-2 lg:grid-cols-2 items-center gap-x-2 w-fullflex gap-2 w-full">
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
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Bio</h2>
                                    <textarea rows={6} onChange={(e) => { setbio(e.target.value); handleChange() }} value={bio} placeholder="Add a short summary" type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
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
                        <h1 className="text-2xl font-semibold text-[#4A2C84]">Education</h1>
                        <div className="my-6">
                            <div className="grid gap-y-2 lg:grid-cols-2 items-center gap-x-2 w-full">
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">School Name</h2>
                                    <input onChange={(e) => { setename(e.target.value); setshowSave2(true) }} value={ename} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Field</h2>
                                    <input onChange={(e) => { setefield(e.target.value); setshowSave2(true) }} value={efield} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Year</h2>
                                    <input onChange={(e) => { seteyear(e.target.value); setshowSave2(true) }} value={eyear} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Level</h2>
                                    <input onChange={(e) => { setelevel(e.target.value); setshowSave2(true) }} value={elevel} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                            </div>
                            {
                                showSave2 && <div className="flex w-full justify-end gap-4">
                                    <button onClick={() => { setshowSave2(false) }} className="border border-black rounded-lg px-4 py-1">Cancel</button>
                                    <button onClick={() => { handleSave2().then(x => { setshowSave2(false) }) }} className="bg-[#4A2C84] text-white px-4 py-1 rounded-lg">Save</button>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="mt-10">
                        <h1 className="text-2xl font-semibold text-[#4A2C84]">Work experience</h1>
                        <div className="my-6">
                            <div className="grid gap-y-2 lg:grid-cols-2 items-center gap-x-2 w-full">
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Company Name</h2>
                                    <input onChange={(e) => { setcname(e.target.value); setshowSave3(true) }} value={cname} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Title</h2>
                                    <input onChange={(e) => { setctitle(e.target.value); setshowSave3(true) }} value={ctitle} type="text" className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>

                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Start date</h2>
                                    <input type="date" onChange={(e) => { setsdate(e.target.value); setshowSave3(true) }} value={sdate} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">End Date</h2>
                                    <input type="date" onChange={(e) => { setedate(e.target.value); setshowSave3(true) }} value={edate} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">CV</h2>
                                    <input type="file" onChange={(e) => {
                                        console.log(e.target.files[0]);
                                        setcv(e.target.files[0]); setshowSave3(true)
                                    }} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                                <div className="">
                                    <h2 className="mb-1 text-sm font-medium ">Cover letter</h2>
                                    <input type="file" onChange={(e) => { setcover(e.target.files); setshowSave3(true) }} className="w-full border rounded-lg px-4 py-2 text-sm" />
                                </div>
                            </div>
                            {
                                showSave3 && <div className="flex w-full justify-end gap-4">
                                    <button onClick={() => { setshowSave3(false) }} className="border border-black rounded-lg px-4 py-1">Cancel</button>
                                    <button onClick={() => { handleSave3().then(x => { setshowSave3(false) }) }} className="bg-[#4A2C84] text-white px-4 py-1 rounded-lg">Save</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
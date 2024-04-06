'use client'
import OptionsInput from "@/components/Input/Options";
import TextInput from "@/components/Input/Text";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import CountryList from "@/lib/CountryList/CountryList";
import PhoneInput from 'react-phone-number-input'
import Year from "@/lib/Years/Years";
import getUser from "@/lib/getUser/getUser";

export default function RightColomnRecruiter() {
    const [step, setStep] = useState(1);
    const supabase = createClientComponentClient()
    const router = useRouter()

    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [number, setnumber] = useState('')
    const [numberCode, setnumberCode] = useState('+234')
    const [date, setdate] = useState("")
    const [gender, setgender] = useState('')
    const [country, setcountry] = useState('')
    const [state, setstate] = useState('')


    const [level, setlevel] = useState('')
    const [schoolName, setschoolName] = useState('')
    const [field, setfield] = useState('')
    const [gradYear, setgradYear] = useState('')

    const [companyName, setcompanyName] = useState('')
    const [type, settype] = useState('')
    const [url, seturl] = useState('')
    const [desc, setdesc] = useState('')



    const countryList = CountryList()
    const [stateList, setstateList] = useState([])
    const year = Year()
    const [currentUser, setcurrentUser] = useState({})

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

    async function handleFirstNext() {
        if (name == "" || email == "" || number == "" || date == "" || gender == "" || country == "" || state == "") {
            console.log(country + state);
            alert("Please fill all fields");
            return
        }
        setStep(2);
    }

    async function step1() {
        const { data, error } = await supabase
            .from('Recruiters')
            .upsert({ name: name, email: currentUser?.email, number: number, dob: date, gender: gender, country: country, state: state })
            .select('uniqueid')

        if (error) {
            console.log(error);
        }
        if (data) return data[0]?.unique_id;

        console.log(error);
        console.log(data);
    }

    async function step2(uuid: any) {
        const { data, error } = await supabase
            .from('CompanyInfo')
            .insert({ unique_id: uuid, name: name, type: type, website: url, description: desc })
        console.log(error);
        console.log(data);
    }

    async function handleFinish() {
        await step1().then(data => {
            step2(data);
            console.log(data);
        });
        const { data, error } = await supabase
            .from('users')
            .insert({ name: name, email: currentUser?.email, type: "recruiter" })

        if (error) {
            console.log(error);
        }
        router.push('/recruiter')
    }

    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user;
    }
    useEffect(() => {
        getUser().then(user => {
            router.refresh();
            setcurrentUser(user);
        })
    }, [])


    return (
        <div className="lg:w-[55%]">
            {
                (step == 1) &&
                <div className="px-10 w-full lg:px-14 py-10 overflow-scroll lg:block flex flex-col justify-center">
                    <FaArrowLeft onClick={() => { router.push('/signup') }} className="cursor-pointer text-2xl mb-4" />
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-semibold">Create a Recruiter Account</h2>
                        <p className="text-xs font-semibold text-[#515B6F]">Step 1 of 2</p>
                    </div>
                    <div className="">
                        <div className="my-4">
                            <TextInput value={name} field="Full Name" type="text" placeholder="Enter your Full Name" handleChange={(e: any) => {
                                setname(e.target.value)
                            }} />
                        </div>
                        <div className="my-4">
                            <TextInput value={email} field="Email" type="text" placeholder="Enter your email" handleChange={(e: any) => {
                                setemail(e.target.value)
                            }} />
                        </div>
                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Phone Number</p>
                            <div className="flex gap-2">
                                <input value={numberCode} className="px-4 py-3 rounded-lg border placeholder:text-xs w-1/5 text-xs text-center" type="text" placeholder="Enter Code" onChange={(e) => { setnumberCode(e.target.value) }} />
                                <input value={number} className="px-4 py-3 rounded-lg border placeholder:text-xs w-4/5 text-xs" type="text" placeholder="Enter Phone Number" onChange={(e) => { setnumber(e.target.value) }} />
                            </div>
                        </div>
                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Date of Birth</p>
                            <input value={date} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="date" placeholder="Enter Date of Birth" onChange={(e) => { setdate(e.target.value) }} />
                        </div>
                        <div>
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Gender</p>
                            <select value={gender} onChange={(e) => {
                                setgender(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Country</p>
                            <select value={country} onChange={(e) => {
                                setcountry(e.target.value)
                                fetchStates(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select your country</option>
                                {
                                    countryList.map((country) => {
                                        return <option value={country}>{country}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">State</p>
                            <select value={state} onChange={(e) => {
                                setstate(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select your state</option>
                                {
                                    stateList.map((state) => {
                                        return <option className="bg-[#4A2C84] my-4" value={state.name}>{state.name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <button className="my-2 text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold text-xs" onClick={() => { handleFirstNext() }}>Next</button>

                    </div>

                </div>
            }
            {
                (step == 2) &&
                <div className="px-10 w-full lg:px-14 py-10 overflow-scroll lg:block flex flex-col justify-center">
                    <FaArrowLeft onClick={() => { setStep(1) }} className="cursor-pointer text-2xl mb-4" />
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-semibold flex items-center gap-2">Company Information</h2>
                        <p className="text-xs font-semibold text-[#515B6F]">Step 2 of 2</p>
                    </div>
                    <div className="">
                        <div className="my-4">
                            <TextInput field="Company Name" type="text" placeholder="Enter your company Name" handleChange={(e) => { setcompanyName(e.target.value) }} />
                        </div>
                        <div className="my-4">
                            <TextInput field="Type of Employer" type="text" placeholder="Enter Type" handleChange={(e) => { settype(e.target.value) }} />
                        </div>
                        <div className="my-4">
                            <TextInput field="Company Website (Optional)" type="text" placeholder="example.com" handleChange={(e) => { seturl(e.target.value) }} />
                        </div>
                        <div className="my-4">
                            <TextInput field="Company Description" type="text" placeholder="example.com" handleChange={(e) => { setdesc(e.target.value) }} />
                        </div>

                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 mb-4 text-[#515B6F]">Company Logo {"(Optional)"}</p>
                            <label htmlFor="cvupload" className="cursor-pointer text-xs px-6 py-4 rounded-lg bg-[#D6DDEB] my-4">Choose file
                                <input type="file" id="cvupload" hidden />
                            </label>
                            <p className="text-xs mt-5 text-[#A8ADB7]">Optionally upload a logo no larger than 10MB for file types .pdf .doc .docx
                                .</p>
                        </div>

                        <button onClick={() => { handleFinish() }} className=" text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold text-xs" >Finish</button>

                    </div>

                </div>
            }
        </div>
    );
}
'use client'
import TextInput from "@/components/Input/Text";
import CountryList from "@/lib/CountryList/CountryList";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Year from "@/lib/Years/Years";
import { toast } from "sonner";

export default function RightColumnSeeker(props: { redirectUrl: string }) {
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
    const [jobTitle, setjobTitle] = useState('')
    const [startDate, setstartDate] = useState('')
    const [endDate, setendDate] = useState('')


    const countryList = CountryList()
    const [stateList, setstateList] = useState([])
    const year = Year()
    const [currentUser, setcurrentUser] = useState({})

    const [terms, setTerms] = useState(false)
    const [privacy, setPrivacy] = useState(false)

    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user;
    }

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
        if (name == "" || number == "" || date == "" || gender == "" || country == "" || state == "") {
            alert("Please fill all fields");
            return;
        }
        setStep(2);
    }
    async function handleSecondNext() {
        console.log(level + schoolName + field + gradYear);
        if (level == "" || schoolName == "" || field == "" || gradYear == "") {
            console.log(level + schoolName + field + gradYear);
            alert("Please fill all fields");
            return
        }
        setStep(3)
    }

    async function step1() {
        const { data, error } = await supabase
            .from('Seekers')
            .upsert({ name: name, email: currentUser?.email, number: number, dob: date, gender: gender, country: country, state: state })
            .select('unique_id')

        if (error) {
            console.log(error);
        }
        if (data) return data[0]?.unique_id;
    }

    async function step2(uuid: string) {
        const { data, error } = await supabase
            .from('Education')
            .insert({ unique_id: uuid, level: level, school_name: schoolName, field: field, year: gradYear })

        if (error) {
            console.log(error);
        }
    }

    async function handleFinish() {
        console.log(terms);
        console.log(privacy);

        if (terms && privacy) {
            await step1().then(data => {
                step2(data);
                console.log(data);
            });

            const { data, error } = await supabase
                .from('users')
                .insert({ name: name, email: currentUser?.email, type: "seeker" })

            if (error) {
                console.log(error);
            }
            if (props.redirectUrl != "null")
                router.push('/all-jobs' + props.redirectUrl)
            else router.push('/all-jobs')
        }
        else {
            alert("Please agree to the terms and conditions and privacy policy")
        }
    }

    useEffect(() => {
        getUser().then(user => {
            setcurrentUser(user);
        })
    }, [])
    return (
        <div className="lg:w-[55%] w-full overflow-auto">
            {
                (step == 1) &&
                <div className="px-10 lg:px-14 py-10 ">
                    <FaArrowLeft onClick={() => { router.push('/signup') }} className="cursor-pointer text-2xl mb-4" />
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-semibold">Create a Job Seeker Account</h2>
                        <p className="text-xs font-semibold text-[#515B6F]">Step 1 of 3</p>
                    </div>
                    <div className="">
                        <div className="my-4">
                            <TextInput value={name} field="Full Name" type="text" placeholder="Enter your Full Name" handleChange={(e: any) => {
                                setname(e.target.value)
                            }} />
                        </div>
                        <div className="my-4">
                            <TextInput value={currentUser?.email}
                                extra="read"
                                field="Email" type="text" placeholder="Enter your email" handleChange={(e: any) => {
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
                                        return <option className="my-4" value={state.name}>{state.name}</option>
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
                <div className="w-full px-10 lg:px-14 py-10  overflow-scroll lg:block">
                    <FaArrowLeft onClick={() => { setStep(1) }} className="cursor-pointer text-2xl mb-4" />
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-semibold">Education</h2>
                        <p className="text-xs font-semibold text-[#515B6F]">Step 2 of 3</p>
                    </div>
                    <div className="">
                        <div>
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Highest Level of Education</p>
                            <select className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full" onChange={(e) => { setlevel(e.target.value) }}>
                                <option>Select option</option>
                                <option value="High School">High School</option>
                                <option value="Secondary School">Secondary School</option>
                                <option value="Graduation">Graduation</option>
                            </select>
                        </div>
                        <div className="my-4">
                            <TextInput field="School/University Name" type="text" placeholder="Enter School" handleChange={(e: any) => { setschoolName(e.target.value) }} />
                        </div>
                        <div className="my-4">
                            <TextInput field="Field of Study" type="text" placeholder="Enter your field of study" handleChange={(e: any) => { setfield(e.target.value) }} />
                        </div>
                        <div>
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Graduation Year</p>
                            <select className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full" onChange={(e) => { setgradYear(e.target.value) }}>
                                <option>Select year</option>
                                {
                                    year.map((year) => {
                                        return <option value={year}>{year}</option>
                                    })
                                }
                            </select>
                        </div>
                        <button className="my-4 text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold text-xs" onClick={() => { handleSecondNext() }}>Next</button>
                    </div>
                </div>
            }
            {
                (step == 3) &&
                <div className="px-10 w-full lg:px-14 py-10 overflow-scroll lg:block flex flex-col justify-center">
                    <FaArrowLeft onClick={() => { setStep(2) }} className="cursor-pointer text-2xl mb-4" />
                    <div className="flex justify-between items-baseline">

                        <h2 className="text-xl font-semibold flex items-center gap-2">Work Experience  <span className="text-xs font-normal"> (optional)</span></h2>
                        <p className="text-xs font-semibold text-[#515B6F]">Step 3 of 3</p>
                    </div>
                    <div className="">
                        <div className="my-4">
                            <TextInput field="Company Name" type="text" placeholder="Enter your company Name" handleChange={() => { }} />
                        </div>
                        <div className="my-4">
                            <TextInput field="Job Title" type="text" placeholder="Enter job title" handleChange={() => { }} />
                        </div>
                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Start date</p>
                            <input value={startDate} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="date" placeholder="Enter Start Date" onChange={(e) => { setstartDate(e.target.value) }} />
                        </div>
                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">End date</p>
                            <input value={endDate} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="date" placeholder="Enter End Date" onChange={(e) => { setendDate(e.target.value) }} />
                        </div>

                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 mb-4 text-[#515B6F]">Resume/CV Upload</p>
                            <label htmlFor="cvupload" className="cursor-pointer text-xs px-6 py-4 rounded-lg bg-[#D6DDEB] my-4">Choose file
                                <input type="file" id="cvupload" hidden />
                            </label>
                            <p className="text-xs mt-5 text-[#A8ADB7]">Optionally upload a CV no larger than 10MB for file types .pdf .doc .docx
                                Please note: You will need to upload a CV to apply for jobs, however
                                you can skip the CV upload on sign up.</p>
                        </div>
                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 mb-4 text-[#515B6F]">Cover letter Upload</p>
                            <label htmlFor="cvupload" className="cursor-pointer text-xs px-6 py-4 rounded-lg bg-[#D6DDEB] my-4">Choose file
                                <input type="file" id="cvupload" hidden />
                            </label>
                            <p className="text-xs mt-5 text-[#A8ADB7]">Optionally upload a Cover letter no larger than 10MB for file types .pdf .doc .docx . Please note: You will need to upload a Cover letter to apply for jobs, however you can skip the CV upload on sign up.</p>
                        </div>


                        <div className="flex gap-2 my-4">
                            <input onChange={(e) => { setTerms(e.target.checked) }} type="checkbox" />
                            <p className="text-xs text-[#515B6F]">I agree to the company's <a href="/privacy-policy" className="text-[#4A2C84] underline">Terms and Conditions</a></p>
                        </div>
                        <div className="flex gap-2 mb-5">
                            <input onChange={(e) => { setPrivacy(e.target.checked) }} type="checkbox" />
                            <p className="text-xs text-[#515B6F]">I agree to the company's <a href="/privacy-policy" className="text-[#4A2C84] underline">Privacy Policy</a></p>
                        </div>

                        <button disabled={!(privacy && terms)} onClick={() => { handleFinish() }} className={`text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold text-xs ${!(privacy && terms) && 'cursor-not-allowed'}`} >Finish</button>

                    </div>

                </div>
            }
        </div >
    )
}
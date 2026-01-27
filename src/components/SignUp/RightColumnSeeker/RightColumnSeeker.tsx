'use client'
import TextInput from "@/components/Input/Text";
import CountryList from "@/lib/constants/countries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Year from "@/lib/constants/years";
import { toast } from "sonner";
import getIP from "@/lib/api/getIP";
import UAParser from "ua-parser-js";
import { User } from '@supabase/supabase-js';

interface State {
    name: string;
    [key: string]: any;
}

export default function RightColumnSeeker(props: { redirectUrl: string }) {
    const [step, setStep] = useState(1);
    const supabase = createClientComponentClient()
    const router = useRouter()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setemail] = useState('')
    const [number, setnumber] = useState('')
    const [numberCode, setnumberCode] = useState('+234')
    const [day, setDay] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [gender, setgender] = useState('')
    const [country, setcountry] = useState('Nigeria')
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
    const [stateList, setstateList] = useState<State[]>([])
    const yearList = Year()
    const [currentUser, setcurrentUser] = useState<User | null>(null)

    const [terms, setTerms] = useState(false)
    const [privacy, setPrivacy] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (firstName == "" || lastName == "" || number == "" || day == "" || month == "" || year == "" || gender == "" || state == "") {
            toast("Please fill all fields");
            return;
        }
        setStep(2);
    }
    async function handleSecondNext() {
        console.log(level + schoolName + field + gradYear);
        if (level == "" || schoolName == "" || field == "" || gradYear == "") {
            console.log(level + schoolName + field + gradYear);
            toast("Please fill all fields");
            return
        }
        setStep(3)
    }

    async function step1() {
        // Validate inputs
        const fullName = `${firstName.trim()} ${lastName.trim()}`
        const dateOfBirth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

        if (!firstName || !lastName || !number || !day || !month || !year || !gender || !state) {
            toast.error("Please fill in all the required fields.");
            return null;
        }

        try {
            const { data, error } = await supabase
                .from('Seekers')
                .upsert({
                    name: fullName,
                    email: currentUser?.email,
                    number: number.trim(),
                    dob: dateOfBirth,
                    gender: gender.trim(),
                    country: country.trim(),
                    state: state.trim()
                })
                .select('unique_id');

            if (error) {
                console.error("Error inserting into Seekers:", error);
                throw new Error("Failed to insert Seeker details.");
            }
            return data?.[0]?.unique_id;
        } catch (error) {
            console.error("Unexpected error in step1:", error);
            toast.error("An unexpected error occurred. Please try again.");
            return null;
        }
    }

    async function step2(uuid: string) {
        if (!uuid) {
            toast.error("Invalid unique ID. Please try again.");
            return false;
        }

        // Validate educational inputs
        if (!level || !schoolName || !field || !gradYear) {
            toast.error("Please fill in all the required education fields.");
            return false;
        }

        try {
            const { error } = await supabase
                .from('Education')
                .insert({
                    unique_id: uuid,
                    level: level.trim(),
                    school_name: schoolName.trim(),
                    field: field.trim(),
                    year: gradYear.trim()
                });

            if (error) {
                console.error("Error inserting into Education:", error);
                throw new Error("Failed to insert Education details.");
            }
            return true;
        } catch (error) {
            console.error("Unexpected error in step2:", error);
            toast.error("An unexpected error occurred. Please try again.");
            return false;
        }
    }

    async function step3(uuid: string) {
        const fullName = `${firstName.trim()} ${lastName.trim()}`
        try {
            const { error} = await supabase
                .from('users')
                .insert({
                    name: fullName,
                    email: currentUser?.email,
                    type: "seeker"
                });

            if (error) {
                console.error("Error inserting into users:", error);
                throw new Error("Failed to complete your registration.");
            }
            return true;
        } catch (error) {
            console.error("Unexpected error in step3:", error);
            toast.error("An unexpected error occurred. Please try again.");
            return false;
        }
    }

    async function recordTosPP() {
        const ip = await getIP();
        const parser = new UAParser();
        const agent = parser.getResult();

        try {
            const { error: tosError } = await supabase
                .from('TermsOfService')
                .insert({
                    version: '1.0',
                    ip_address: ip,
                    agent: agent,
                });

            if (tosError) throw tosError;

            const { error: ppError } = await supabase
                .from('PrivacyPolicy')
                .insert({

                    version: '1.0',
                    ip_address: ip,
                    agent: agent,
                });

            if (ppError) throw ppError;

            return true;
        } catch (error) {
            console.error("Error in recordTosPP:", error);
            toast.error("Error occurred while saving Terms of Service and Privacy Policy agreements.");
            return false;
        }
    }

    async function rollback(uuid: string) {
        try {
            // Rollback ToS and Privacy Policy agreements
            await supabase
                .from('TermsOfService')
                .delete()
                .eq('unique_id', uuid);

            await supabase
                .from('PrivacyPolicy')
                .delete()
                .eq('unique_id', uuid);

            // Rollback Seeker data
            await supabase
                .from('Seekers')
                .delete()
                .eq('unique_id', uuid);

            // Rollback Education data
            await supabase
                .from('Education')
                .delete()
                .eq('unique_id', uuid);
        } catch (error) {
            console.error("Error during rollback:", error);
            toast.error("Failed to rollback the changes. Please contact support.");
        }
    }

    async function handleFinish() {
        if (isSubmitting) return;
        if (!terms || !privacy) {
            toast.error("Please agree to the terms and conditions and privacy policy.");
            return;
        }

        let uuid: string | null = null;
        setIsSubmitting(true);

        try {
            // Step 1: Insert Seeker data
            uuid = await step1();
            if (!uuid) throw new Error("Step 1 failed.");

            // Step 2: Insert Education data
            const educationSuccess = await step2(uuid);
            if (!educationSuccess) throw new Error("Step 2 failed.");

            // Step 3: Insert user data
            const userInsertSuccess = await step3(uuid);
            if (!userInsertSuccess) throw new Error("Step 3 failed.");

            // Step 4: Insert ToS/PP agreements
            const tosSuccess = await recordTosPP();
            if (!tosSuccess) throw new Error("Step 4 (Terms of Service and Privacy Policy agreements) failed.");

            toast.success("Registration complete!");
            const redirectPath = props.redirectUrl && props.redirectUrl !== "null" && props.redirectUrl !== "undefined"
                ? `/all-trainings${props.redirectUrl}`
                : '/all-trainings';
            router.push(redirectPath);
        } catch (error) {
            console.error("Error during registration process:", error);
            toast.error("An unexpected error occurred. Rolling back changes...");

            // Rollback all inserted data
            if (uuid) await rollback(uuid);
        } finally {
            setIsSubmitting(false);
        }
    }


    useEffect(() => {
        getUser().then(user => {
            setcurrentUser(user);
        })
        // Auto-load Nigeria states since country is locked to Nigeria
        fetchStates('Nigeria')
    }, [])
    return (
        <div className="w-full lg:w-[55%] flex flex-col min-h-screen">
            {
                (step == 1) &&
                <div className="px-6 lg:px-14 py-10 w-full max-w-[640px] mx-auto overflow-y-auto">
                    <FaArrowLeft onClick={() => { router.push('/signup') }} className="cursor-pointer text-2xl mb-4" />
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-semibold">Create a Job Seeker Account</h2>
                        <p className="text-xs font-semibold text-[#515B6F]">Step 1 of 3</p>
                    </div>
                    <div className="">
                        <div className="grid grid-cols-2 gap-4 my-4">
                            <TextInput
                                value={firstName}
                                extra=""
                                field="First Name"
                                type="text"
                                placeholder="Enter your first name"
                                handleChange={(e: any) => {
                                    setFirstName(e.target.value)
                                }}
                            />
                            <TextInput
                                value={lastName}
                                extra=""
                                field="Last Name"
                                type="text"
                                placeholder="Enter your last name"
                                handleChange={(e: any) => {
                                    setLastName(e.target.value)
                                }}
                            />
                        </div>
                        <div className="my-4">
                            <TextInput
                                value={currentUser?.email || ''}
                                extra="read"
                                field="Email"
                                type="text"
                                placeholder="Enter your email"
                                handleChange={(e: any) => {
                                    setemail(e.target.value)
                                }}
                            />
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
                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs"
                                >
                                    <option value="">Day</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <select
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs"
                                >
                                    <option value="">Month</option>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                                        <option key={i + 1} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                                <select
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs"
                                >
                                    <option value="">Year</option>
                                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
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
                            <div className="relative">
                                <input
                                    value={country}
                                    disabled
                                    className="px-4 py-3 rounded-lg border bg-gray-50 text-xs w-full cursor-not-allowed"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">🇳🇬</span>
                            </div>
                        </div>

                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">State</p>
                            <select value={state} onChange={(e) => {
                                setstate(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select your state</option>
                                {stateList.map((state, index) => (
                                    <option key={`state-${index}`} className="my-4" value={state.name}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                        <button className="my-2 text-white py-3 text-center bg-[#14B8A6] hover:bg-[#0D9488] transition-all duration-300 w-full rounded-lg font-semibold text-xs" onClick={() => { handleFirstNext() }}>Next</button>

                    </div>

                </div>
            }
            {
                (step == 2) &&
                <div className="px-6 lg:px-14 py-10 w-full max-w-[640px] mx-auto overflow-y-auto">
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
                            <TextInput 
                                value={schoolName}
                                extra=""
                                field="Name of Institution / School" 
                                type="text" 
                                placeholder="Enter School" 
                                handleChange={(e: any) => { 
                                    setschoolName(e.target.value) 
                                }} 
                            />
                        </div>
                        <div className="my-4">
                            <TextInput 
                                value={field}
                                extra=""
                                field="Field of Study" 
                                type="text" 
                                placeholder="Enter your field of study" 
                                handleChange={(e: any) => { 
                                    setfield(e.target.value) 
                                }} 
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Year of Graduation</p>
                            <select className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full" onChange={(e) => { setgradYear(e.target.value) }}>
                                <option>Select year</option>
                                {yearList.map((yearValue, index) => (
                                    <option key={`year-${index}`} value={yearValue}>{yearValue}</option>
                                ))}
                            </select>
                        </div>
                        <button className="my-4 text-white py-3 text-center bg-[#14B8A6] hover:bg-[#0D9488] transition-all duration-300 w-full rounded-lg font-semibold text-xs" onClick={() => { handleSecondNext() }}>Next</button>
                    </div>
                </div>
            }
            {
                (step == 3) &&
                <div className="px-6 lg:px-14 py-10 w-full max-w-[640px] mx-auto overflow-y-auto">
                    <FaArrowLeft onClick={() => { setStep(2) }} className="cursor-pointer text-2xl mb-4" />
                    <div className="flex justify-between items-baseline">

                        <h2 className="text-xl font-semibold flex items-center gap-2">Work Experience  <span className="text-xs font-normal"> (optional)</span></h2>
                        <p className="text-xs font-semibold text-[#515B6F]">Step 3 of 3</p>
                    </div>
                    <div className="">
                        <div className="my-4">
                            <TextInput 
                                value={companyName}
                                extra=""
                                field="Name of Employer" 
                                type="text" 
                                placeholder="Enter your company Name" 
                                handleChange={(e: any) => { 
                                    setcompanyName(e.target.value) 
                                }} 
                            />
                        </div>
                        <div className="my-4">
                            <TextInput 
                                value={jobTitle}
                                extra=""
                                field="Job Title" 
                                type="text" 
                                placeholder="Enter job title" 
                                handleChange={(e: any) => { 
                                    setjobTitle(e.target.value) 
                                }} 
                            />
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
                                Please note: You will need to upload a CV to enroll for jobs, however
                                you can skip the CV upload on sign up.</p>
                        </div>
                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 mb-4 text-[#515B6F]">Cover letter Upload</p>
                            <label htmlFor="cvupload" className="cursor-pointer text-xs px-6 py-4 rounded-lg bg-[#D6DDEB] my-4">Choose file
                                <input type="file" id="cvupload" hidden />
                            </label>
                            <p className="text-xs mt-5 text-[#A8ADB7]">Optionally upload a Cover letter no larger than 10MB for file types .pdf .doc .docx . Please note: You will need to upload a Cover letter to enroll for jobs, however you can skip the CV upload on sign up.</p>
                        </div>


                        <div className="flex gap-2 my-4">
                            <input onChange={(e) => { setTerms(e.target.checked) }} type="checkbox" />
                            <p className="text-xs text-[#515B6F]">I agree to the company&apos;s <a href="/terms-of-service" target="_blank" className="text-[#14B8A6] underline">Terms and Conditions</a></p>
                        </div>
                        <div className="flex gap-2 mb-5">
                            <input onChange={(e) => { setPrivacy(e.target.checked) }} type="checkbox" />
                            <p className="text-xs text-[#515B6F]">I agree to the company&apos;s <a target="_blank" href="/privacy-policy" className="text-[#14B8A6] underline">Privacy Policy</a></p>
                        </div>

                        <button 
                            disabled={!(privacy && terms) || isSubmitting} 
                            onClick={() => { handleFinish() }} 
                            className={`my-2 text-white py-3 text-center bg-[#14B8A6] hover:bg-[#0D9488] transition-all duration-300 w-full rounded-lg font-semibold text-xs ${
                                (!(privacy && terms) || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? "Submitting..." : "Finish"}
                        </button>

                    </div>

                </div>
            }
        </div >
    )
}
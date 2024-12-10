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
import { toast } from "sonner";
import getIP from "@/lib/getIP/getIP";
import UAParser from "ua-parser-js";

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


    const [companyName, setcompanyName] = useState('')
    const [url, seturl] = useState('')
    const [desc, setdesc] = useState('')

    const countryList = CountryList()
    const [stateList, setstateList] = useState([])
    const year = Year()
    const [currentUser, setcurrentUser] = useState({})
    const [terms, setTerms] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [position, setposiion] = useState('')
    const [industry, setIndustry] = useState('');

    const Industry = [
        "Agriculture & Farming",
        "Building & Construction",
        "Education & Tutoring",
        "Hospitality & Lodging",
        "Electronics Repair & Sales",
        "Mechanical Services & Repairs",
        "Textiles & Tailoring",
        "Transport & Logistics",
        "Information Technology & Mobile Services",
        "Handicrafts & Manufacturing",
        "Retail & Street Vending",
        "Automotive Repair & Services",
        "Energy & Solar Solutions",
        "Media & Entertainment",
        "Food & Beverage",
        "Community & Social Services",
        "Environmental & Recycling Services",
        "Creative Arts & Craftsmanship",
        "Sports & Recreation Services",
        "Chemical & Soap Making",
        "Biotechnology & Herbal Products",
        "Mining & Quarrying",
        "Fishing & Aquaculture",
        "Beauty & Cosmetology"
    ];

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
            toast.error("Please fill all fields");
            return;
        }
        setStep(2);
    }

    async function step1() {
        try {
            const { data, error } = await supabase
                .from('Recruiters')
                .upsert({ name: name, email: currentUser?.email, number: number, dob: date, gender: gender, country: country, state: state })
                .select('uniqueid');

            if (error) throw error;
            return data[0]?.uniqueid;
        } catch (error) {
            toast.error("Failed to save recruiter details.");
            console.log("Step 1 Error:", error);
            return null;
        }
    }

    async function step2(uuid: string) {
        try {
            const { error } = await supabase
                .from('CompanyInfo')
                .insert({ unique_id: uuid, name: companyName, industry: industry, website: url, description: desc, position_in_company: position });

            if (error) throw error;
            return true;
        } catch (error) {
            toast.error("Failed to save company details.");
            console.error("Step 2 Error:", error);
            return false;
        }
    }

    async function step3(uuid: string) {
        try {
            const { error } = await supabase
                .from('users')
                .insert({
                    name: name.trim(),
                    email: currentUser?.email,
                    type: "recruiter"
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

    async function handleToSAndPrivacy() {
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
            await supabase.from('Recruiters').delete().eq('uniqueid', uuid);
            await supabase.from('CompanyInfo').delete().eq('unique_id', uuid);
        } catch (error) {
            console.error("Error during rollback:", error);
        }
    }

    async function handleFinish() {
        if (companyName == "" || industry == "" || position == "" || desc == "") {
            toast.error("Please fill all fields");
            return;
        }
        if (!terms || !privacy) {
            toast.error("Please agree to the terms and privacy policy.");
            return;
        }

        let uuid: string | null = null;

        try {
            uuid = await step1();
            if (!uuid) throw new Error("Step 1 failed.");

            const companySaved = await step2(uuid);
            if (!companySaved) throw new Error("Step 2 failed.");

            const tosSuccess = await handleToSAndPrivacy();
            if (!tosSuccess) throw new Error("ToS/Privacy Policy agreement failed.");

            const userSaved = await step3(uuid);
            if (!userSaved) throw new Error("Step 3 failed.");

            toast.success("Registration complete!");
            router.push('/recruiter');
        } catch (error) {
            toast.error("Registration failed. Rolling back changes...");
            console.error("Error during registration:", error);
            if (uuid) await rollback(uuid);
        }
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
        <div className="lg:w-[55%] w-full overflow-auto">
            {
                (step == 1) &&
                <div className="px-10 w-full lg:px-14 py-10 lg:block flex flex-col justify-center">
                    <FaArrowLeft onClick={() => { router.push('/signup?type=recruiter') }} className="cursor-pointer text-2xl mb-4" />
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
                <div className="px-6 lg:px-14 py-10 w-full max-w-[640px] mx-auto overflow-y-auto">
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
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Industry</p>
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full"
                            >
                                <option>Select Industry</option>
                                {Industry.map((industry) => (
                                    <option key={industry} value={industry}>{industry}</option>
                                ))}
                            </select>
                        </div>

                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Position in Company</p>
                            <select value={position} onChange={(e) => {
                                setposiion(e.target.value)
                            }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                <option>Select Position</option>
                                {
                                    ["Business Owner", "C-Level: CEO / COO / CIO / CFO", "Recruiter", "Manager / Supervisor", "Other"].map((position) => {
                                        return <option className="my-4" value={position}>{position}</option>
                                    })
                                }
                            </select>
                        </div>

                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 text-[#515B6F]">Company Description</p>
                            <textarea placeholder="Brief Description of your company" rows={5} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full" onChange={(e) => { setdesc(e.target.value) }}></textarea>
                        </div>

                        <div className="my-4">
                            <TextInput field="Company Website (Optional)" type="text" placeholder="example.com" handleChange={(e) => { seturl(e.target.value) }} />
                        </div>

                        <div className="my-4">
                            <p className="font-semibold text-xs my-1 mb-4 text-[#515B6F]">Company Logo {"(Optional)"}</p>
                            <label htmlFor="cvupload" className="cursor-pointer text-xs px-6 py-4 rounded-lg bg-[#D6DDEB] my-4">Choose file
                                <input type="file" id="cvupload" hidden />
                            </label>
                            <p className="text-xs mt-5 text-[#A8ADB7]">Optionally upload a logo no larger than 10MB for file types .pdf .doc .docx
                                .</p>
                        </div>

                        <div className="my-4">
                            <div className="flex items-start gap-2">
                                <input type="checkbox" id="terms" checked={terms} onChange={() => setTerms(!terms)} />
                                <label htmlFor="terms" className="text-xs">
                                    I agree to the{" "}
                                    <a target="_blank" href="/terms-of-service" className="text-[#4A2C84]">Terms of Service</a>
                                </label>
                            </div>
                            <div className="flex items-start gap-2 mt-2">
                                <input type="checkbox" id="privacy" checked={privacy} onChange={() => setPrivacy(!privacy)} />
                                <label htmlFor="privacy" className="text-xs">
                                    I agree to the{" "}
                                    <Link target="_blank" href="/privacy-policy" className="text-[#4A2C84]">Privacy Policy</Link>
                                </label>
                            </div>
                        </div>

                        <button disabled={!(privacy && terms)} onClick={() => { handleFinish() }} className={`text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold text-xs ${!(privacy && terms) && 'cursor-not-allowed'}`} >Finish</button>

                    </div>

                </div>
            }
        </div>
    );
}
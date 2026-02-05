'use client'
import TextInput from "@/components/Input/Text";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "sonner";
import getIP from "@/lib/api/getIP";
import UAParser from "ua-parser-js";
import { User } from '@supabase/supabase-js';

interface State {
    name: string;
    [key: string]: any;
}

export default function RightColumnSeeker(props: { redirectUrl: string }) {
    const supabase = createClientComponentClient()
    const router = useRouter()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [number, setnumber] = useState('')
    const [numberCode, setnumberCode] = useState('+234')
    const [day, setDay] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [gender, setgender] = useState('')
    const [country, setcountry] = useState('Nigeria')
    const [state, setstate] = useState('')

    const [stateList, setstateList] = useState<State[]>([])
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

    async function insertSeeker() {
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
            console.error("Unexpected error in insertSeeker:", error);
            toast.error("An unexpected error occurred. Please try again.");
            return null;
        }
    }

    async function insertUser() {
        const fullName = `${firstName.trim()} ${lastName.trim()}`
        try {
            const { error } = await supabase
                .from('users')
                .upsert({
                    name: fullName,
                    email: currentUser?.email,
                    type: "seeker"
                }, { onConflict: 'uid' });

            if (error) {
                console.error("Error inserting into users:", error);
                throw new Error("Failed to complete your registration.");
            }
            return true;
        } catch (error) {
            console.error("Unexpected error in insertUser:", error);
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
            await supabase
                .from('TermsOfService')
                .delete()
                .eq('unique_id', uuid);

            await supabase
                .from('PrivacyPolicy')
                .delete()
                .eq('unique_id', uuid);

            await supabase
                .from('Seekers')
                .delete()
                .eq('unique_id', uuid);
        } catch (error) {
            console.error("Error during rollback:", error);
            toast.error("Failed to rollback the changes. Please contact support.");
        }
    }

    async function handleFinish() {
        if (isSubmitting) return;

        if (!firstName || !lastName || !number || !day || !month || !year || !gender || !state) {
            toast.error("Please fill in all the required fields.");
            return;
        }

        if (!terms || !privacy) {
            toast.error("Please agree to the terms and conditions and privacy policy.");
            return;
        }

        let uuid: string | null = null;
        setIsSubmitting(true);

        try {
            uuid = await insertSeeker();
            if (!uuid) throw new Error("Failed to create seeker profile.");

            const userInsertSuccess = await insertUser();
            if (!userInsertSuccess) throw new Error("Failed to create user record.");

            const tosSuccess = await recordTosPP();
            if (!tosSuccess) throw new Error("Failed to record Terms of Service and Privacy Policy agreements.");

            toast.success("Registration complete!");
            const redirectPath = props.redirectUrl && props.redirectUrl !== "null" && props.redirectUrl !== "undefined"
                ? `/all-trainings${props.redirectUrl}`
                : '/all-trainings';
            router.push(redirectPath);
        } catch (error) {
            console.error("Error during registration process:", error);
            toast.error("An unexpected error occurred. Rolling back changes...");

            if (uuid) await rollback(uuid);
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        getUser().then(user => {
            setcurrentUser(user);
        })
        fetchStates('Nigeria')
    }, [])
    return (
        <div className="w-full lg:w-[55%] flex flex-col min-h-screen">
            <div className="px-6 lg:px-14 py-10 w-full max-w-[640px] mx-auto overflow-y-auto">
                <FaArrowLeft onClick={() => { router.push('/signup') }} className="cursor-pointer text-2xl mb-4" />
                <div className="flex justify-between items-baseline">
                    <h2 className="text-xl font-semibold">Create an Apprentice Account</h2>
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
                            handleChange={() => {}}
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
                            {stateList.map((stateItem, index) => (
                                <option key={`state-${index}`} className="my-4" value={stateItem.name}>{stateItem.name}</option>
                            ))}
                        </select>
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
                        {isSubmitting ? "Submitting..." : "Create Account"}
                    </button>
                </div>
            </div>
        </div >
    )
}
'use client'
import Image from "next/image";
import sideImage from "../../../assets/images/SignIn/Mail sent-pana 1.png"
import Logo from '../../../assets/images/Logo.png'
import EmailSent from '../../../assets/images/SignIn/Emails-amico 1.png'
import { Suspense, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Verify() {
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
    const [token, setToken] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClientComponentClient()
    const searchParams = useSearchParams()
    const router = useRouter()
    const email = searchParams.get('email') as string
    const type = searchParams.get('type') as string

    async function verifyOTP() {
        try {
            setError('')
            setIsLoading(true)
            console.log(email, type)

            if (otpValues.some(value => !value)) {
                setError('Please enter the verification code')
                setIsLoading(false)
                return
            }

            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otpValues.join(''),
                type: 'email'
            })

            if (error) {
                setError(error.message)
                setIsLoading(false)
                return
            }

            // Check if user exists in respective tables
            if (type === 'seeker') {
                const { data: seekerData, error: seekerError } = await supabase
                    .from('Seekers')
                    .select('*')
                    .eq('email', email)
                    .maybeSingle()

                console.log('Seeker data:', seekerData)

                if (seekerError) {
                    console.error('Seeker error:', seekerError)
                    setError('Error fetching user data')
                    setIsLoading(false)
                    return
                }

                if (!seekerData) {
                    console.log('No seeker found, redirecting to complete profile')
                    await router.push('/signup/complete_profile')
                } else {
                    console.log('Seeker found, redirecting to all jobs')
                    await router.push('/all-jobs')
                }
            } else {
                const { data: recruiterData, error: recruiterError } = await supabase
                    .from('Recruiters')
                    .select()
                    .eq('email', email)
                    .maybeSingle()

                console.log(recruiterData)
                console.log(recruiterError)

                if (recruiterError) {
                    setError('Error fetching user data')
                    console.error('Error fetching user data:', recruiterError)
                    setIsLoading(false)
                    return
                }

                if (!recruiterData) {
                    await router.push('/signup/complete_recruiter_profile')
                } else {
                    await router.push('/recruiter')
                }
            }
        } catch (err) {
            console.error('Verification error:', err)
            setError('An unexpected error occurred')
            setIsLoading(false)
        }
    }

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        if (value.length > 1) {
            const digits = value.split('').slice(0, 6);
            const newOtpValues = [...otpValues];

            digits.forEach((digit, i) => {
                if (index + i < 6) {
                    newOtpValues[index + i] = digit;
                }
            });

            setOtpValues(newOtpValues);
            setToken(newOtpValues.join(''));

            const nextEmptyIndex = newOtpValues.findIndex((val, i) => !val && i > index);
            const inputToFocus = document.querySelector(
                `input[name='otp-${nextEmptyIndex > -1 ? nextEmptyIndex : 5}']`
            ) as HTMLInputElement;
            if (inputToFocus) inputToFocus.focus();

            return;
        }

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
        setToken(newOtpValues.join(''));

        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name='otp-${index + 1}']`) as HTMLInputElement;
            if (nextInput) {
                nextInput.focus();
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            const prevInput = document.querySelector(`input[name='otp-${index - 1}']`) as HTMLInputElement;
            if (prevInput) prevInput.focus();
        }
    }

    useEffect(() => {

    }), []

    return (
        <div className="h-screen w-full">
            <div className="flex h-full">
                <div className="py-8 px-10 bg-[#F5F5F5] w-[45%] flex flex-col">
                    <div className="flex items-center">
                        <Image src={Logo} alt="" width={60} />
                        <p className="text-3xl">Bloom</p>
                    </div>
                    <div className="py-10 flex justify-center">
                        <Image src={sideImage} alt="" width={500} />
                    </div>
                </div>
                <div className="flex items-center justify-center w-[55%]">
                    <div className="w-1/2 flex flex-col justify-center items-center">
                        <Image src={EmailSent} alt="" width={300} />
                        <h1 className="font-semibold text-2xl text-center my-4">Verify your email address</h1>
                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}
                        <p className="text-center text-sm font-light">
                            We have sent a verification code to the email
                            <span className="text-[#4A2C84] font-medium"> {searchParams.get('email')}</span>
                        </p>
                        <p className="text-center text-sm font-light my-2">
                            Enter the code below
                        </p>
                        <div className="flex gap-2 mb-4">
                            {otpValues.map((value, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name={`otp-${index}`}
                                    value={value}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 border rounded-lg text-center text-lg font-medium"
                                    maxLength={1}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                        <button
                            className={`relative bg-[#4A2C84] text-white rounded-lg px-8 py-2 text-sm 
                                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3a2266]'}`}
                            onClick={verifyOTP}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="opacity-0">Verify</span>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </>
                            ) : (
                                'Verify'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
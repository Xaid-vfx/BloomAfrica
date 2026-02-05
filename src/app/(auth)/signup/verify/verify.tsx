'use client'
import PrentisLogoWhite from '@/components/Logo/PrentisLogoWhite'
import { Mail } from 'lucide-react'
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
                    await router.push('/all-trainings')
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
                <div className="py-8 px-10 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] w-[45%] flex flex-col relative overflow-hidden">
                    {/* Decorative SVG Blob */}
                    <svg viewBox="0 0 500 500" className="absolute top-0 left-0 w-[400px] h-[400px] opacity-8 pointer-events-none" style={{ transform: 'translate(-20%, -20%)' }}>
                        <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
                    </svg>

                    <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                        <PrentisLogoWhite className="text-4xl mb-8" />
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md text-center">
                            <h2 className="text-white text-2xl font-semibold mb-4">Almost there!</h2>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Check your inbox for the verification code. Enter it on the right to complete your registration.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-[55%]">
                    <div className="w-1/2 flex flex-col justify-center items-center">
                        <div className="bg-[#14B8A6]/10 rounded-full p-6 mb-6">
                            <Mail className="w-12 h-12 text-[#14B8A6]" />
                        </div>
                        <h1 className="font-semibold text-2xl text-center text-[#0A1F44] mb-4">Verify your email address</h1>
                        {error && (
                            <p className="text-red-500 text-sm mb-4">{error}</p>
                        )}
                        <p className="text-center text-sm font-light">
                            We have sent a verification code to the email
                            <span className="text-[#14B8A6] font-medium"> {searchParams.get('email')}</span>
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
                                    className="w-12 h-12 border rounded-lg text-center text-lg font-medium focus:ring-2 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all duration-200"
                                    maxLength={1}
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                        <button
                            className={`relative bg-[#14B8A6] text-white rounded-lg px-8 py-2 text-sm
                                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0D9488]'} transition-all duration-300`}
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
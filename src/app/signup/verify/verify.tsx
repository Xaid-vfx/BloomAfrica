'use client'
import Image from "next/image";
import sideImage from "../../../assets/images/SignIn/Mail sent-pana 1.png"
import Logo from '../../../assets/images/Logo.png'
import EmailSent from '../../../assets/images/SignIn/Emails-amico 1.png'
import { Suspense, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function verify() {
    const [token, settoken] = useState('')

    const supabase = createClientComponentClient()
    const searchParams = useSearchParams()
    const router = useRouter()

    async function verifyOTP() {
        const email = searchParams.get('email') as string
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })

        if (error) return console.log('Error verifying OTP:', error.message)
        console.log(data)

        alert('Account Created!! Please Sign in')

        if (data?.session?.access_token != null) {
            router.push('/signup')
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
                        <p className="text-center text-sm font-light">
                            We have sent a verification code to the email
                            <span className="text-[#4A2C84] font-medium"> {searchParams.get('email')}</span>
                        </p>
                        <p className="text-center text-sm font-light my-2">
                            Enter the code below
                        </p>
                        <input type="text" className="border px-2 py-2 mb-4 rounded-xl text-center text-sm" onChange={(e) => { settoken(e.target.value) }} />
                        <button className="bg-[#4A2C84] text-white rounded-lg px-4 py-2 text-sm" onClick={() => { verifyOTP() }}>Verify</button>
                    </div>

                </div>
            </div>
        </div>
    )
}
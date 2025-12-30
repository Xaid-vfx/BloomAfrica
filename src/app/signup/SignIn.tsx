'use client'
// Hello World

import { Suspense, useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";
import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn"
import * as pixel from '../../lib/fpixel'

export default function SignIn() {

    const search = useSearchParams()
    const redirectUrl = search.get('continue')
    console.log(redirectUrl);

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [error, setError] = useState('')

    const [currentPage, setCurrentPage] = useState('signup')
    const [signUpUserTypeTab, setsignUpUserTypeTab] = useState(search.get('type') ? search.get('type') : 'seeker')

    const router = useRouter()
    const supabase = createClientComponentClient()
    const [user, setuser] = useState([])

    const currentUrl = globalThis.window?.location.href

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Animation Observer
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ShowAnimation')
                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.5 })

        const hiddenElements = document.querySelectorAll('.HiddenAnimation')
        hiddenElements.forEach((element) => observer.observe(element))

        return () => observer.disconnect()
    }, [])

    const handleSignUp = async () => {
        try {
            setError('') // Clear any previous errors
            if (email === "" || password === "" || confirmPassword === "") {
                setError("Please enter all fields")
                return;
            }
            else if (password != confirmPassword) {
                setError('Passwords should match')
                return;
            }
            else if (password.length < 6) {
                setError('Password should be atleast 6 characters long')
                return;
            }

            const res = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${location.origin}/all-trainings`,
                },
            })

            if (res.error) {
                if (res.error.message.includes('already registered')) {
                    setError('This email is already registered. Please sign in instead.')
                } else {
                    setError(`Sign up failed: ${res.error.message}`)
                }
                return;
            }

            if (!res.data?.user?.id) {
                setError('Sign up failed. Please try again.')
                return;
            }

            try {
                if (signUpUserTypeTab == "seeker") {
                    const { error } = await supabase.from('Seekers').insert([{
                        "unique_id": res.data.user.id,
                        "email": email
                    }])
                    if (error) {
                        if (error.code === '23505') {
                            setError('This email is already registered. Please sign in instead.')
                        } else {
                            throw error;
                        }
                        return;
                    }
                } else {
                    const { error } = await supabase.from('Recruiters').insert([{
                        "uniqueid": res.data.user.id,
                        "email": email
                    }])
                    if (error) {
                        if (error.code === '23505') {
                            setError('This email is already registered. Please sign in instead.')
                        } else {
                            throw error;
                        }
                        return;
                    }
                }
            } catch (error: any) {
                setError(`Failed to create user profile: ${error.message}`)
                return;
            }

            if (res.data.user.aud == "authenticated") {
                router.push(`signup/verify?email=${email}`)
            }
            router.refresh()
        } catch (error: any) {
            setError(`An unexpected error occurred: ${error.message}`)
        }
    }

    const signInWithGoogle = async () => {
        const isFacebookBrowser = /FB_IAB|FBAN|FBAV/.test(navigator.userAgent);

        if (isFacebookBrowser) {
            setIsRedirecting(true);
            const currentURL = window.location.href;

            if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
                window.location.href = `x-web-search://?${currentURL}`;
                setTimeout(() => {
                    window.location.href = currentURL;
                }, 500);
            } else {
                window.location.href = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
            }
            return;
        }

        // Track the event before initiating Google sign-in
        pixel.event('InitiateGoogleSignIn', {
            content_category: 'Authentication',
            content_name: signUpUserTypeTab == "seeker" ? 'Apprentice Google Sign In' : 'Trainer Google Sign In'
        });

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                },
                redirectTo: signUpUserTypeTab == "seeker" ?
                    `${location.origin}/auth/callback?route=/signup/complete_profile&type=seeker&next=${redirectUrl || ''}` :
                    `${location.origin}/auth/callback?route=/signup/complete_recruiter_profile&type=recruiter`
            },
        });
        console.log(data);
        console.log("error" + error);
    }

    const handleSignIn = async () => {
        try {
            setError('') // Clear any previous errors
            if (!email) {
                setError('Please enter your email address')
                return
            }

            setIsLoading(true) // Add loading state before API call

            const { data, error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${location.origin}/all-trainings`,
                }
            })

            if (error) {
                setError(`Failed to send OTP: ${error.message}`)
                return
            }

            // Redirect to verify page after sending OTP
            router.push(`signup/verify?email=${email}&type=${signUpUserTypeTab}`)
        } catch (error: any) {
            setError(`An unexpected error occurred: ${error.message}`)
        } finally {
            setIsLoading(false) // Reset loading state
        }
    }

    useEffect(() => {
        // console.log(searchParams.get('type'));

        // async function fetchUser() {
        //     const user = await getUser()
        //     return user
        // }
        // fetchUser().then(data => {
        //     if (data[0]) {
        //         if (data[1] == "seeker" || searchParams.get('type') == "seeker") {
        //             router.push('/all-trainings')
        //         }
        //         else if (data[1] == "recruiter" || searchParams.get('type') == "recruiter") {
        //             router.push('/recruiter')
        //         }
        //     }
        // })
    }, [])


    return (
        <div className="h-screen w-full">
            <div className="flex h-full">
                <LeftColomn userType={signUpUserTypeTab as 'seeker' | 'recruiter'} />
                <div className="w-full flex items-center justify-center lg:w-[55%] bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] relative overflow-hidden z-20">
                    <div className="lg:w-1/2 w-full px-4 md:px-6 lg:px-10 relative z-30">
                        {currentPage == "signin" ? <h1 className="text-2xl text-center mb-4 text-white font-semibold HiddenAnimation">Welcome Back</h1> :
                            <div>
                                <div className="mb-6 flex gap-2 rounded-2xl p-1 bg-white/5 border border-white/10 backdrop-blur-sm justify-center max-w-md mx-auto HiddenAnimation">
                                    <button className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${signUpUserTypeTab == 'seeker' ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/20" : "text-white/70 hover:text-white hover:bg-white/10"}`} onClick={() => { setsignUpUserTypeTab('seeker') }}>I'm an Apprentice</button>
                                    <button className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${signUpUserTypeTab == 'recruiter' ? "bg-[#14B8A6] text-white shadow-lg shadow-[#14B8A6]/20" : "text-white/70 hover:text-white hover:bg-white/10"}`} onClick={() => { setsignUpUserTypeTab('recruiter') }}>I'm a Trainer</button>
                                </div>
                                <h1 className="text-2xl text-center mb-4 text-white font-semibold HiddenAnimation">Create a {signUpUserTypeTab == "seeker" ? "Apprentices" : "Trainers"} Account</h1>
                            </div>
                        }
                        <div onClick={() => { signInWithGoogle() }} className="bg-white hover:bg-gray-50 rounded-xl py-4 px-6 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-sm max-w-md mx-auto cursor-pointer HiddenAnimation">
                            <FcGoogle size={20} />
                            Continue with Google
                        </div>
                        {/* <p className="text-xs text-[#97999B] my-5 text-center">Or {currentPage == "signin" ? "Login" : "sign up"} with email</p>

                        {error && (
                            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )} */}
                        {/* <div>
                            <p className="font-semibold text-xs my-1 text-[#97999B]">Email Address</p>
                            <input
                                className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs"
                                type="text"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => { setemail(e.target.value) }}
                            />
                        </div>

                        <button
                            className={`relative text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold mt-4 
                                ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#3a2266]'}`}
                            onClick={() => { handleSignIn() }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="opacity-0">Sign in with OTP</span>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </>
                            ) : (
                                'Sign in with OTP'
                            )}
                        </button> */}
                        {/* 
                        <div>
                            <p className="font-semibold text-xs my-1 text-[#97999B]">Email Address</p>
                            <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="text" placeholder="Enter email address" value={email} onChange={(e) => { setemail(e.target.value) }} />
                        </div>

                        <div>
                            <p className="font-semibold text-xs my-1 mt-4 text-[#97999B]">Password</p>
                            <input className="px-4 py-3 rounded-lg border placeholder:text-xs mb-4 w-full text-xs" type="password" placeholder="Enter password" value={password} onChange={(e) => { setpassword(e.target.value) }} />
                        </div>
                        {currentPage == "signin" ?
                            <div>
                                <button className="text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold" onClick={() => { handleSignIn() }}>Sign In</button>
                                <div className="my-4 text-center text-[#97999B] text-xs">Don't have an account? <span className="text-[#4A2C84] cursor-pointer" onClick={() => { setCurrentPage('signup') }}>Sign Up</span></div>
                            </div> :
                            <div>
                                <div>
                                    <p className="font-semibold text-xs my-1 text-[#97999B]">Re-enter Password</p>
                                    <input className="px-4 py-3 rounded-lg border placeholder:text-xs mb-4 w-full text-xs" type="password" placeholder="Enter password again" value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }} />
                                </div>
                                <button className="text-white py-3 text-center bg-[#4A2C84] w-full rounded-lg font-semibold" onClick={() => { handleSignUp() }}>Sign Up</button>
                                <div className="my-4 text-center text-[#97999B] text-xs">Already have an account? <span className="text-[#4A2C84] cursor-pointer" onClick={() => { setCurrentPage('signin') }}>Sign In</span></div>
                            </div>} */}

                    </div>
                </div>
            </div>

            {isRedirecting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg text-center">
                        <p className="text-sm mb-2">Opening in default browser...</p>
                        <div className="w-6 h-6 border-2 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            )}
        </div>
    )
}


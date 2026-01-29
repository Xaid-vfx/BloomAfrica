'use client'
// Hello World

import { Suspense, useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FcGoogle } from "react-icons/fc";
import LeftColumn from "@/components/SignUp/LeftColumn/LeftColumn"
import * as pixel from '@/lib/analytics/fpixel'

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
                    `${location.origin}/auth/callback?route=/recruiter&type=recruiter`
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
            if (!password) {
                setError('Please enter your password')
                return
            }

            setIsLoading(true)

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. Please try again.')
                } else if (error.message.includes('Email not confirmed')) {
                    setError('Please verify your email before signing in.')
                } else {
                    setError(`Sign in failed: ${error.message}`)
                }
                return
            }

            if (data?.user) {
                // Check if user is a seeker or recruiter and redirect accordingly
                const { data: seekerData } = await supabase
                    .from('Seekers')
                    .select('unique_id')
                    .eq('unique_id', data.user.id)
                    .single()

                if (seekerData) {
                    router.push(redirectUrl || '/all-trainings')
                } else {
                    router.push('/recruiter')
                }
                router.refresh()
            }
        } catch (error: any) {
            setError(`An unexpected error occurred: ${error.message}`)
        } finally {
            setIsLoading(false)
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
                <LeftColumn userType={signUpUserTypeTab as 'seeker' | 'recruiter'} />
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

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6 max-w-md mx-auto HiddenAnimation">
                            <div className="flex-1 h-px bg-white/20"></div>
                            <span className="text-white/50 text-sm">Or continue with email</span>
                            <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 rounded-xl border border-red-500/20 max-w-md mx-auto HiddenAnimation">
                                {error}
                            </div>
                        )}

                        {/* Email/Password Form */}
                        <div className="max-w-md mx-auto space-y-4 HiddenAnimation">
                            <div>
                                <input
                                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 w-full text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={(e) => { setemail(e.target.value) }}
                                />
                            </div>

                            <div>
                                <input
                                    className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 w-full text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => { setpassword(e.target.value) }}
                                />
                            </div>

                            {currentPage == "signup" && (
                                <div>
                                    <input
                                        className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 w-full text-sm focus:outline-none focus:border-[#14B8A6] transition-colors"
                                        type="password"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => { setconfirmPassword(e.target.value) }}
                                    />
                                </div>
                            )}

                            <button
                                className={`relative text-white py-3 text-center bg-[#14B8A6] hover:bg-[#0D9488] w-full rounded-xl font-semibold transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                onClick={() => { currentPage == "signup" ? handleSignUp() : handleSignIn() }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="opacity-0">{currentPage == "signup" ? "Create Account" : "Sign In"}</span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </>
                                ) : (
                                    currentPage == "signup" ? "Create Account" : "Sign In"
                                )}
                            </button>

                            {currentPage == "signup" ? (
                                <div className="text-center text-white/60 text-sm">
                                    Already have an account?{' '}
                                    <span className="text-[#14B8A6] cursor-pointer hover:underline" onClick={() => { setCurrentPage('signin'); setError(''); }}>
                                        Sign In
                                    </span>
                                </div>
                            ) : (
                                <div className="text-center text-white/60 text-sm">
                                    Don't have an account?{' '}
                                    <span className="text-[#14B8A6] cursor-pointer hover:underline" onClick={() => { setCurrentPage('signup'); setError(''); }}>
                                        Sign Up
                                    </span>
                                </div>
                            )}
                        </div>

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


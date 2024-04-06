'use client'
import { useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { usePathname, useRouter } from 'next/navigation'
import Image from "next/image"
import SideImage from '../../assets/images/SignIn/LeftIllustration.png'
import Logo from '../../assets/images/Logo.png'
import { FcGoogle } from "react-icons/fc";
import LeftColomn from "@/components/SignUp/LeftColomn/LeftColomn"

export default function signIn() {

    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')

    const [currentPage, setCurrentPage] = useState('signup')
    const [signUpUserTypeTab, setsignUpUserTypeTab] = useState('seeker')

    const router = useRouter()
    const supabase = createClientComponentClient()
    const [user, setuser] = useState([])

    const currentUrl = globalThis.window?.location.href
    console.log(currentUrl);



    const handleSignUp = async () => {

        if (email === "" || password === "" || confirmPassword === "") {
            alert("Please enter all fields")
            return;
        }
        else if (password != confirmPassword) {
            alert('Passwords should match')
            return;
        }
        else if (password.length < 6) {
            alert('Password should be atleast 6 characters long')
            return;
        }
        const res = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/all-jobs`,
            },
        })
        console.log(res);
        if (signUpUserTypeTab == "seeker") {
            console.log(res);

            const { data, error } = await supabase.from('Seekers').insert([{ "unique_id": res?.data?.user?.id, "email": email }])
            console.log(data);
            console.log(error);
        }
        else {
            const { data, error } = await supabase.from('Recruiters').insert([{ "uniqueid": res?.data?.user?.id, "email": email }])
            console.log(data);
            console.log(error);
        }
        if (res?.data?.user?.aud == "authenticated") {
            router.push(`signup/verify?email=${email}`)
        }
        router.refresh()
    }

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: signUpUserTypeTab == "seeker" ? currentUrl + '/complete_profile' : currentUrl + '/complete_recruiter_profile'
            },

        })
        console.log("data" + data);
        console.log("error" + error);
    }

    const handleSignIn = async () => {
        const res = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        console.log(res);

        if (res?.data?.user?.aud == "authenticated") {
            const id = res.data.user.id;
            const { data: d1, error: e1 } = await supabase.from('Seekers').select().eq('unique_id', id).single()
            const { data: d2, error: e2 } = await supabase.from('Recruiters').select().eq('uniqueid', id).single()

            console.log(d1);
            console.log(d2);

            if (d1) {
                router.push("/signup/complete_profile")
            }
            else if (d2) {
                router.push("/signup/complete_recruiter_profile")
            }
            else {
                console.log(e1);
                console.log(e2);
            }
        }
        router.refresh()
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
        //             router.push('/all-jobs')
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
                <LeftColomn />
                <div className="w-full flex items-center justify-center lg:w-[55%]">
                    <div className="lg:w-1/2 w-full px-10">
                        {currentPage == "signin" ? <h1 className="text-2xl text-center mb-4">Welcome Back</h1> :
                            <div>
                                <div className="mb-6 flex rounded-3xl justify-center ">
                                    <button className={`text-xs px-3 py-2 rounded-l-2xl lg:font-semibold ${signUpUserTypeTab == 'seeker' ? "text-[#4A2C84] bg-[#eae8fd]" : "text-[#97999B]"}`} onClick={() => { setsignUpUserTypeTab('seeker') }}>Job Seeker</button>
                                    <button className={`text-xs px-2 py-1 rounded-r-2xl  lg:font-semibold ${signUpUserTypeTab == 'recruiter' ? "text-[#4A2C84] bg-[#eae8fd]" : "text-[#97999B]"}`} onClick={() => { setsignUpUserTypeTab('recruiter') }}>Recruiters</button>
                                </div>
                                <h1 className="text-2xl text-center mb-4">Create a {signUpUserTypeTab == "seeker" ? "Job seeker" : "Recruiter"} Account</h1>
                            </div>
                        }
                        <div onClick={() => { signInWithGoogle() }} className="border rounded-lg py-2 text-xs text-center flex items-center justify-center gap-2 cursor-pointer"><FcGoogle />
                            {/* currentPage == "signin" ? "Login" : "Sign Up"} */}
                            Continue with Google</div>
                        <p className="text-xs text-[#97999B] my-5 text-center">Or {currentPage == "signin" ? "Login" : "sign up"} with email</p>

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
                            </div>}

                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"

export default function Dashboard() {

    const supabase = createClientComponentClient()
    const [currentUser, setcurrentUser] = useState({})
    const router = useRouter()

    async function getUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user;
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/signin')
        router.refresh()
    }

    useEffect(() => {
        getUser().then(user => {
            setcurrentUser(user);
            console.log(user);
        })
    }, [])

    return (
        <div className="flex justify-center items-center text-2xl font-bold h-screen flex-col">
            <div>Welcome {currentUser?.email} !!</div>
            <div onClick={() => { handleSignOut() }} className="border p-2 text-lg bg-black text-white rounded-2xl cursor-pointer">Sign out</div>
        </div>
    )
}
'use client'
import TextInput from "@/components/Input/Text";
import Header from "@/components/Recruiter/Header/Header";
import Sidebar from "@/components/Recruiter/Sidebar/Sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

export default function Post() {
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [type, settype] = useState("")
    const [loc, setloc] = useState("")
    const [res, setres] = useState("")
    const [wya, setwya] = useState("")
    const [extras, setextras] = useState("")
    const [salary, setsalary] = useState("")

    const supabase = createClientComponentClient()

    async function handleSubmit() {
        const { data, error } = await supabase
            .from('Jobs')
            .upsert({ title: title, description: desc, type: type, location: loc, responsibilities: res, who_you_are: wya, extras: extras, salary: salary })

        if (error) {
            console.log(error);
        }
        else {
            alert("Success!!")
        }
        console.log(data);
    }

    return (
        <div className="flex justify-between w-full overflow-hidden h-screen">
            <Sidebar />
            <div className="w-[82%] h-screen overflow-auto">
                <Header />
                <div className="">
                    <div className="py-10 px-10">
                        <div className="flex gap-4 items-center">
                            <Link href="/recruiter">
                                <FaArrowLeft className="cursor-pointer text-2xl" />
                            </Link>
                            <h1 className="text-2xl font-semibold">Post a Job</h1>
                        </div>

                        <div>

                        </div>


                        <div className="flex flex-col gap-2 my-6">
                            <TextInput field="Title" type="text" placeholder="Enter your title" handleChange={(e: any) => {
                                settitle(e.target.value)
                            }} />
                            <TextInput field="Description" type="text" placeholder="Enter  desc" handleChange={(e: any) => {
                                setdesc(e.target.value)
                            }} />
                            <TextInput field="type" type="text" placeholder="Enter  type" handleChange={(e: any) => {
                                settype(e.target.value)
                            }} />
                            <TextInput field="loc" type="text" placeholder="Enter  loc" handleChange={(e: any) => {
                                setloc(e.target.value)
                            }} />
                            <TextInput field="responsib" type="text" placeholder="Enter" handleChange={(e: any) => {
                                setres(e.target.value)
                            }} />
                            <TextInput field="who you are" type="text" placeholder="Enter " handleChange={(e: any) => {
                                setwya(e.target.value)
                            }} />
                            <TextInput field="extras" type="text" placeholder="Enter  extras" handleChange={(e: any) => {
                                setextras(e.target.value)
                            }} />
                            <TextInput field="salary" type="text" placeholder="Enter  salary" handleChange={(e: any) => {
                                setsalary(e.target.value)
                            }} />
                            <button type="submit" className="border rounded py-2 px-3 text-white bg-[#4A2C84]" onClick={() => { handleSubmit() }}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'
import TextInput from "@/components/Input/Text";
import Header from "@/components/Recruiter/Header/Header";
import Sidebar from "@/components/Recruiter/Sidebar/Sidebar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Post() {
    const [title, settitle] = useState("")
    const [desc, setdesc] = useState("")
    const [type, settype] = useState("")
    const [category, setcategory] = useState("")
    const [loc, setloc] = useState("")
    const [res, setres] = useState("")
    const [wya, setwya] = useState("")
    const [extras, setextras] = useState("")
    const [salary, setsalary] = useState("")
    const [skills, setskills] = useState("")
    const [duration, setduration] = useState("")

    const supabase = createClientComponentClient()
    const router = useRouter()

    async function handleSubmit() {
        const { data, error } = await supabase
            .from('Jobs')
            .upsert({ title: title, description: desc, type: type, category: category, location: loc, responsibilities: res, who_you_are: wya, extras: extras, salary: salary })

        if (error) {
            console.log(error);
        }
        else {
            alert("Success!!")
            router.refresh()
        }
        console.log(data);
    }

    return (
        <div className="py-8 px-8 bg-[#F5F5F5] h-[95%] w-full overflow-scroll">
            <p className="mb-4 hover:underline cursor-pointer text-sm flex items-center gap-1"><IoMdArrowRoundBack className="text-xl" />Back to job listing</p>
            <div>
                <div className="bg-white rounded-xl p-6 mt-6">

                    <h1 className="text-2xl font-semibold text-[#4A2C84]">General</h1>


                    <div className="flex flex-col gap-2 my-4">
                        <div className="mb-1">
                            <p className="font-[550] text-lg my-1">Job Title *</p>
                            <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="text" placeholder="e.g. Software Engineer" onChange={(e) => { settitle(e.target.value) }} />
                        </div>

                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Job Description *</p>
                            <textarea rows={8} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Description" onChange={(e) => { setdesc(e.target.value) }}></textarea>
                        </div>


                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Job Responsibilities *</p>
                            <textarea rows={8} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Responsibilities" onChange={(e) => { setres(e.target.value) }}></textarea>
                        </div>

                        <div className="my-2">
                            <p className="font-[550] text-lg my-1">Who we are *</p>
                            <textarea rows={8} className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Who we are" onChange={(e) => { setwya(e.target.value) }}></textarea>
                        </div>

                        {/* <div className="my-1">
                            <p className="font-semibold text-lg my-1">Job Type *</p>
                            <input value="" className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="text" placeholder="Select Job Type" onChange={(e) => { settype(e.target.value) }} />
                        </div> */}

                        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 p-0"></hr>

                        <h1 className="text-2xl font-semibold text-[#4A2C84]">Information</h1>


                        <div className="grid grid-cols-2 items-center gap-x-4">
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Job Type *</p>
                                <select onChange={(e) => {
                                    settype(e.target.value)
                                }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                    <option>Select category</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Electrical Engineering">Electrical Engineering</option>
                                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                                    <option value="Construction & Civil Engineering">Construction & Civil Engineering</option>
                                    <option value="Business & Entreprenuership">Business & Entreprenuership</option>
                                    <option value="Cosmetology">Cosmetology</option>
                                    <option value="Hospitality">Hospitality</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Food & Cullinary">Food & Cullinary</option>
                                </select>
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Application Deadline Date *</p>
                                <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="date" onChange={(e) => { }} />
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Min Salary {"(Optional)"}</p>
                                <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="text" placeholder="Minimum Salary" onChange={(e) => { setsalary(e.target.value) }} />
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Max Salary {"(Optional)"}</p>
                                <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" type="text" placeholder="Maximum Salary" onChange={(e) => { }} />
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Category</p>
                                <select onChange={(e) => {
                                    setcategory(e.target.value)
                                }} className="bg-white px-4 py-3 rounded-lg border placeholder:text-xs text-xs w-full">
                                    <option>Select category</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                </select>
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Required Skills*</p>
                                <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Required Skills" type="text" onChange={(e) => { setskills(e.target.value) }} />
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Job Location *</p>
                                <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Location" type="text" onChange={(e) => { setloc(e.target.value) }} />
                            </div>
                            <div className="my-2">
                                <p className="font-[550] text-lg my-1">Duration *</p>
                                <input className="px-4 py-3 rounded-lg border placeholder:text-xs w-full text-xs" placeholder="Enter Job Duration" type="text" onChange={(e) => { setduration(e.target.value) }} />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="border rounded-lg py-2 px-3 my-2 text-white bg-[#4A2C84]" onClick={() => { handleSubmit() }}>Submit</button>
            </div>
        </div>
    )
}
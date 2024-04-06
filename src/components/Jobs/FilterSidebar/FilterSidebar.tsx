'use client'

import { useState } from "react"

export default function FilterSidebar() {
    const [Categories, setCategories]: [string[], any] = useState([])
    const [type, settype]: [string[], any] = useState([])
    return (
        <div className="px-10">
            <div className="flex flex-col gap-3">
                <p className="font-semibold">Types of Employement</p>
                <div className="text-[#515B6F] flex flex-col gap-4">
                    <div className='flex'>
                        <input type='checkbox' value="Full Time" onChange={(e) => {
                            if (e.target.checked) settype([...type, e.target.value]);
                            else settype(type.filter(element => element !== e.target.value));
                            console.log(type);
                        }} /><p className="ml-3">Full Time</p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' value="Part Time" onChange={(e) => {
                            if (e.target.checked) settype([...type, e.target.value]);
                            else settype(type.filter(element => element !== e.target.value));
                            console.log(type);
                        }} /><p className="ml-3">Part Time</p>
                    </div>
                </div>

                <p className="font-semibold mt-8">Categories</p>
                <div className="text-[#515B6F] flex flex-col gap-4">
                    <div className='flex'>
                        <input type='checkbox' value="Software" onChange={(e) => {
                            if (e.target.checked) setCategories([...Categories, e.target.value]);
                            else setCategories(Categories.filter(element => element !== e.target.value));
                            console.log(Categories);
                        }} /><p className="ml-3">Software </p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' value="Electronics" onChange={(e) => {
                            if (e.target.checked) setCategories([...Categories, e.target.value]);
                            else setCategories(Categories.filter(element => element !== e.target.value));
                            console.log(Categories);
                        }} /><p className="ml-3">Electronics </p>
                    </div>

                </div>
            </div>
            <div className="my-4 flex w-full">
                <a href={'?' + type.map((type, index) => `type${index + 1}=${type}`).join('&') + '&' + Categories.map((category, index) => `category${index + 1}=${category}`).join('&')} className="text-sm bg-[#4A2C84] text-white px-4 py-2 mx-2 w-full text-center rounded-lg">Apply</a>
            </div>
        </div >
    )
}
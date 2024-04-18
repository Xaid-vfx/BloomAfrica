'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch, FaSearchLocation } from "react-icons/fa";
import { animateScroll } from 'react-scroll';

export default function Search() {
    const [query, setquery] = useState('')
    const [location, setlocation] = useState('')
    const router = useRouter()

    const options = {
        // Your options here, for example:
        duration: 500,
        smooth: true,
    };

    async function handleSearch() {

        router.push("/all-jobs?search=" + query + "&location=" + location)

        setTimeout(() => {
            animateScroll.scrollTo(500, options)
        }, 1000);

    }

    return (
        <div className="lg:bg-white lg:flex items-center box_shadow x lg:p-2 lg:pl-8 lg:rounded-3xl max-lg:shadow-none">
            <div className="hidden lg:block"><FaSearch /></div>
            <input onKeyDown={(e) => { e.key == "Enter" ? handleSearch() : "" }} onChange={(e) => { setquery(e.target.value) }} type="text" className="px-4 py-4 rounded-3xl placeholder:text-xs placeholder:font-medium mb-4 w-full text-sm box_shadow lg:shadow-none lg:mb-0 lg:rounded-r-none lg:placeholder:font-light lg:placeholder:text-sm lg:w-auto outline-none" placeholder="Job title or keywords" />
            <div className="hidden lg:block"><FaSearchLocation /></div>
            <input onKeyDown={(e) => { e.key == "Enter" ? handleSearch() : "" }} onChange={(e) => { setlocation(e.target.value) }} type="text" className="px-4 py-4 rounded-3xl outline-none placeholder:text-xs placeholder:font-medium mb-4 w-full text-sm box_shadow lg:shadow-none lg:mb-0 lg:rounded-l-none lg:rounded-r-none lg:placeholder:font-light lg:placeholder:text-sm lg:w-auto" placeholder="Lagos, Nigeria" />

            <button onClick={handleSearch} className=" text-white py-4 text-center bg-[#4A2C84] w-full  rounded-3xl font-semibold text-xs lg:text-sm lg:py-4 lg:px-10" >Search Job</button>

        </div>
    )
}
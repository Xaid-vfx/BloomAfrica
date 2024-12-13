'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSearch, FaSearchLocation } from "react-icons/fa";
import { animateScroll } from 'react-scroll';
import { CiSearch } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { GoLocation } from "react-icons/go";
import { LuSearch } from "react-icons/lu";

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
        <div className="bg-white p-4 w-[90%] lg:w-auto lg:mx-0 rounded-2xl lg:flex items-center box_shadow x lg:p-2 lg:pl-8 lg:rounded-3xl lg:max-w-none md:max-w-xl">
            <div className="flex gap-1 lg:items-center">
                <CiSearch className="text-3xl" />
                <input onKeyDown={(e) => { e.key == "Enter" ? handleSearch() : "" }} onChange={(e) => { setquery(e.target.value) }} type="text" className="border-b-[1px] lg:mx-2 px-4 pt-2 pb-1  placeholder:text-sm mb-4 w-full text-sm  lg:shadow-none lg:mb-0 lg:rounded-r-none lg:placeholder:font-light placeholder:text-[#7C8493] lg:placeholder:text-sm lg:w-auto outline-none" placeholder="Job title or keywords" />
            </div>
            <div className="flex gap-1 lg:items-center">
                <GoLocation className="text-2xl" />
                <input onKeyDown={(e) => { e.key == "Enter" ? handleSearch() : "" }} onChange={(e) => { setlocation(e.target.value) }} type="text" className="border-b-[1px] lg:mx-2 px-4 pt-2 pb-1 placeholder:text-sm mb-4 w-full text-sm  lg:shadow-none lg:mb-0 lg:rounded-r-none lg:placeholder:font-light placeholder:text-[#7C8493] lg:placeholder:text-sm lg:w-auto outline-none" placeholder="Lagos, Nigeria" />
            </div>
            <button onClick={handleSearch} className="min-w-max text-white py-4 text-center bg-[#4A2C84] w-full  rounded-3xl font-semibold text-xs lg:text-sm lg:py-4 lg:px-10" >Search Apprenticeships</button>
        </div>
    )
}
'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { animateScroll } from 'react-scroll';
import { CiSearch } from "react-icons/ci";
import { GoLocation } from "react-icons/go";

export default function Search() {
    const [query, setquery] = useState('')
    const [location, setlocation] = useState('')
    const router = useRouter()

    const options = {
        duration: 500,
        smooth: true,
    };

    async function handleSearch() {
        router.push("/all-trainings?search=" + query + "&location=" + location)

        setTimeout(() => {
            animateScroll.scrollTo(700, options)
        }, 1000);
    }

    return (
        <div className="relative bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] w-full py-16 px-6 overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-3">
                        Find Your Perfect Apprenticeship
                    </h1>
                    <p className="text-white/90 text-lg">
                        Search from hundreds of opportunities across Africa
                    </p>
                </div>

                <div className="bg-white p-3 rounded-xl shadow-lg lg:flex items-center gap-3 lg:p-4">
                    <div className="flex gap-2 items-center flex-1 mb-3 lg:mb-0">
                        <CiSearch className="text-2xl lg:text-3xl text-gray-600" />
                        <input
                            onKeyDown={(e) => { e.key == "Enter" ? handleSearch() : "" }}
                            onChange={(e) => { setquery(e.target.value) }}
                            type="text"
                            className="flex-1 px-2 py-2 text-sm lg:text-base placeholder:text-gray-500 outline-none"
                            placeholder="Title or keywords"
                        />
                    </div>

                    <div className="hidden lg:block w-px h-10 bg-gray-200"></div>

                    <div className="flex gap-2 items-center flex-1 mb-3 lg:mb-0">
                        <GoLocation className="text-xl lg:text-2xl text-gray-600" />
                        <input
                            onKeyDown={(e) => { e.key == "Enter" ? handleSearch() : "" }}
                            onChange={(e) => { setlocation(e.target.value) }}
                            type="text"
                            className="flex-1 px-2 py-2 text-sm lg:text-base placeholder:text-gray-500 outline-none"
                            placeholder="Lagos, Nigeria"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-full lg:w-auto min-w-max text-white py-3 px-8 text-center bg-[#14B8A6] rounded-lg font-semibold text-sm lg:text-base hover:bg-[#0D9488] transition-colors"
                    >
                        Search Apprenticeships
                    </button>
                </div>
            </div>
        </div>
    )
}

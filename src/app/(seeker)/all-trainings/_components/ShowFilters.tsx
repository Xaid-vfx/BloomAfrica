'use client'
import { IoFilter } from "react-icons/io5";
import FilterSidebar from "@/components/Jobs/FilterSidebar/FilterSidebar"
import { useEffect, useState } from "react"
import { IoCloseSharp } from "react-icons/io5";

export default function ShowFilters(props) {
    const [showfilter, setshowfilter] = useState(false)

    if (showfilter) {
        return (
            <div className="h-[200vh] m-0 w-full left-0 top-0 z-10 fixed bg-white overflow-scroll">
                <div onClick={() => { setshowfilter(false) }} className="flex justify-center items-center text-center pt-6 pb-10 text-base cursor-pointer text-red-700"><IoCloseSharp className="text-2xl" /><div>Close</div></div>
                <FilterSidebar handleCategoryChange={props.handleCategoryChange} handleTypeChange={props.handleTypeChange} />
            </div>
        )

    }
    return (
        <div>
            <p onClick={() => {
                setshowfilter(true)
            }} className="text-sm flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg cursor-pointer"><IoFilter className="text-xl" />Filters</p>
        </div>
    )
}
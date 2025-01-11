'use client'

import { useState } from "react"

export default function FilterSidebar(props: any) {
    const categories = [
        "Agriculture & Farming",
        "Building & Construction",
        "Hospitality",
        "Mechanical Engineering",
        "Electrical Engineering",
        "Textiles & Tailoring",
        "Retail & Business",
        "Food & Catering",
        "Arts & Craftsmanship",
        "Beauty & Cosmetology",
        "Other"
    ];

    const [showAll, setShowAll] = useState(false);

    const displayedCategories = showAll ? categories : categories.slice(0, categories.length);

    return (
        <div className="">
            
            
            <div className="flex flex-col gap-3   py-8 px-5">
            
                <p className="font-semibold ">Types of Employment</p>
                <div className="text-[#515B6F] flex flex-col gap-2">
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedTypes?.includes('Full Time')} value="Full Time" onChange={(e) => {
                            props.handleTypeChange("Full Time")
                        }} /><p className="ml-3 text-sm">Full Time</p>
                    </div>
                    <div className='flex'>
                        <input type='checkbox' checked={props.selectedTypes?.includes('Part Time')} value="Part Time" onChange={(e) => {
                            props.handleTypeChange("Part Time")
                        }} /><p className="ml-3 text-sm">Part Time</p>
                    </div>
                </div>

                <p className="font-semibold mt-8">Categories</p>
                <div className="text-[#515B6F] flex flex-col gap-2  overflow-y-auto">
                    {displayedCategories.map((category) => (
                        <div key={category} className='flex'>
                            <input
                                type='checkbox'
                                checked={props.selectedCategories?.includes(category)}
                                value={category}
                                onChange={() => props.handleCategoryChange(category)}
                            />
                            <p className="ml-3 text-sm">{category}</p>
                        </div>
                    ))}
                </div>
                {/* <button
                    className="mt-2 text-[#4A2C84] text-xs"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "Show Less" : "Show all"}
                </button> */}
            </div>
        </div>
    )
}

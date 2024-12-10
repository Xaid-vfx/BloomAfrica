'use client'

import { useState } from "react"

export default function FilterSidebar(props: any) {
    const categories = [
        "Agriculture & Farming",
        "Building & Construction",
        "Education & Tutoring",
        "Hospitality & Lodging",
        "Electronics Repair & Sales",
        "Mechanical Services & Repairs",
        "Textiles & Tailoring",
        "Transport & Logistics",
        "Information Technology & Mobile Services",
        "Handicrafts & Manufacturing",
        "Retail & Street Vending",
        "Automotive Repair & Services",
        "Energy & Solar Solutions",
        "Media & Entertainment",
        "Food & Beverage",
        "Community & Social Services",
        "Environmental & Recycling Services",
        "Creative Arts & Craftsmanship",
        "Sports & Recreation Services",
        "Chemical & Soap Making",
        "Biotechnology & Herbal Products",
        "Mining & Quarrying",
        "Fishing & Aquaculture",
        "Beauty & Cosmetology"
    ];

    const [showAll, setShowAll] = useState(false);

    const displayedCategories = showAll ? categories : categories.slice(0, 5);

    return (
        <div className="px-10">
            <div className="flex flex-col gap-3">
                <p className="font-semibold">Types of Employment</p>
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
                <div className="text-[#515B6F] flex flex-col gap-2 max-h-60 overflow-y-auto">
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
                <button
                    className="mt-2 text-[#4A2C84] text-xs"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "Show Less" : "Show all"}
                </button>
            </div>
        </div>
    )
}

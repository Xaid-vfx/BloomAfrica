'use client'

import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface Props {
    isOpen: boolean;
    onToggle: () => void;
    selectedTypes?: string[];
    selectedCategories?: string[];
    onTypeChange: (type: string) => void;
    onCategoryChange: (category: string) => void;
}

export default function FilterDropdown(props: Props) {
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

    const types = ["Full Time", "Part Time"];

    const activeFilterCount = (props.selectedTypes?.length || 0) + (props.selectedCategories?.length || 0);

    const handleClearAll = () => {
        // Clear all types
        props.selectedTypes?.forEach(type => props.onTypeChange(type));
        // Clear all categories
        props.selectedCategories?.forEach(category => props.onCategoryChange(category));
    };

    return (
        <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
            {/* Header/Toggle Button */}
            <button
                onClick={props.onToggle}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="text-sm bg-[#0A1F44] text-white px-2 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                    {/* Active filter badges */}
                    {activeFilterCount > 0 && !props.isOpen && (
                        <div className="flex gap-2 flex-wrap">
                            {props.selectedTypes?.map(type => (
                                <span key={type} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md">
                                    {type}
                                </span>
                            ))}
                            {props.selectedCategories?.slice(0, 2).map(category => (
                                <span key={category} className="text-xs bg-[#0A1F44]/10 text-[#0A1F44] px-2 py-1 rounded-md border border-[#0A1F44]/30">
                                    {category}
                                </span>
                            ))}
                            {(props.selectedCategories?.length || 0) > 2 && (
                                <span className="text-xs text-gray-500">
                                    +{(props.selectedCategories?.length || 0) - 2} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClearAll();
                            }}
                            className="text-sm text-[#0A1F44] hover:text-[#1E3A8A] font-medium"
                        >
                            Clear all
                        </span>
                    )}
                    {props.isOpen ? (
                        <IoChevronUp className="text-xl text-gray-600" />
                    ) : (
                        <IoChevronDown className="text-xl text-gray-600" />
                    )}
                </div>
            </button>

            {/* Collapsible Content */}
            <div
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${props.isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Types */}
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-gray-900">Types of Employment</p>
                            <div className="flex flex-col gap-2">
                                {types.map(type => (
                                    <div key={type} className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            className="accent-[#0A1F44] cursor-pointer"
                                            checked={props.selectedTypes?.includes(type)}
                                            onChange={() => props.onTypeChange(type)}
                                            id={`type-${type}`}
                                        />
                                        <label htmlFor={`type-${type}`} className="ml-3 text-sm text-[#515B6F] cursor-pointer">
                                            {type}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-col gap-3 flex-1">
                            <p className="font-semibold text-gray-900">Categories</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {categories.map(category => (
                                    <div key={category} className='flex items-center'>
                                        <input
                                            type='checkbox'
                                            className="accent-[#0A1F44] cursor-pointer"
                                            checked={props.selectedCategories?.includes(category)}
                                            onChange={() => props.onCategoryChange(category)}
                                            id={`category-${category}`}
                                        />
                                        <label htmlFor={`category-${category}`} className="ml-3 text-sm text-[#515B6F] cursor-pointer">
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

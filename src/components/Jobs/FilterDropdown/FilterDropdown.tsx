'use client'

import { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoClose } from "react-icons/io5";

interface Props {
    isOpen?: boolean;
    onToggle?: () => void;
    selectedTypes?: string[];
    selectedCategories?: string[];
    selectedModes?: string[];
    certificateOnly?: boolean;
    verifiedOnly?: boolean;
    onTypeChange: (type: string) => void;
    onCategoryChange: (category: string) => void;
    onModeChange?: (mode: string) => void;
    onCertificateChange?: (value: boolean) => void;
    onVerifiedChange?: (value: boolean) => void;
}

export default function FilterDropdown(props: Props) {
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [modeDropdownOpen, setModeDropdownOpen] = useState(false);

    const typeRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const modeRef = useRef<HTMLDivElement>(null);

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
    const modes = ["In-person", "Online", "Hybrid"];

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
                setTypeDropdownOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setCategoryDropdownOpen(false);
            }
            if (modeRef.current && !modeRef.current.contains(event.target as Node)) {
                setModeDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeAllDropdowns = () => {
        setTypeDropdownOpen(false);
        setCategoryDropdownOpen(false);
        setModeDropdownOpen(false);
    };

    const handleClearAll = () => {
        props.selectedTypes?.forEach(type => props.onTypeChange(type));
        props.selectedCategories?.forEach(category => props.onCategoryChange(category));
        props.selectedModes?.forEach(mode => props.onModeChange?.(mode));
        if (props.certificateOnly) props.onCertificateChange?.(false);
        if (props.verifiedOnly) props.onVerifiedChange?.(false);
    };

    const activeFilterCount =
        (props.selectedTypes?.length || 0) +
        (props.selectedCategories?.length || 0) +
        (props.selectedModes?.length || 0) +
        (props.certificateOnly ? 1 : 0) +
        (props.verifiedOnly ? 1 : 0);

    return (
        <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Type Dropdown Pill */}
            <div className="relative" ref={typeRef}>
                <button
                    onClick={() => {
                        setTypeDropdownOpen(!typeDropdownOpen);
                        setCategoryDropdownOpen(false);
                        setModeDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                        (props.selectedTypes?.length || 0) > 0
                            ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <span>Type</span>
                    {(props.selectedTypes?.length || 0) > 0 && (
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                            {props.selectedTypes?.length}
                        </span>
                    )}
                    <IoChevronDown className={`transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {typeDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[180px] py-2">
                        {types.map(type => (
                            <label
                                key={type}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-[#0A1F44] w-4 h-4 cursor-pointer"
                                    checked={props.selectedTypes?.includes(type)}
                                    onChange={() => props.onTypeChange(type)}
                                />
                                <span className="text-sm text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Category Dropdown Pill */}
            <div className="relative" ref={categoryRef}>
                <button
                    onClick={() => {
                        setCategoryDropdownOpen(!categoryDropdownOpen);
                        setTypeDropdownOpen(false);
                        setModeDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                        (props.selectedCategories?.length || 0) > 0
                            ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <span>Category</span>
                    {(props.selectedCategories?.length || 0) > 0 && (
                        <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                            {props.selectedCategories?.length}
                        </span>
                    )}
                    <IoChevronDown className={`transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[250px] py-2 max-h-[300px] overflow-y-auto">
                        {categories.map(category => (
                            <label
                                key={category}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="accent-[#0A1F44] w-4 h-4 cursor-pointer"
                                    checked={props.selectedCategories?.includes(category)}
                                    onChange={() => props.onCategoryChange(category)}
                                />
                                <span className="text-sm text-gray-700">{category}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Training Mode Dropdown Pill */}
            {props.onModeChange && (
                <div className="relative" ref={modeRef}>
                    <button
                        onClick={() => {
                            setModeDropdownOpen(!modeDropdownOpen);
                            setTypeDropdownOpen(false);
                            setCategoryDropdownOpen(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                            (props.selectedModes?.length || 0) > 0
                                ? 'bg-[#0A1F44] text-white border-[#0A1F44]'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <span>Mode</span>
                        {(props.selectedModes?.length || 0) > 0 && (
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                                {props.selectedModes?.length}
                            </span>
                        )}
                        <IoChevronDown className={`transition-transform ${modeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {modeDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[180px] py-2">
                            {modes.map(mode => (
                                <label
                                    key={mode}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="accent-[#0A1F44] w-4 h-4 cursor-pointer"
                                        checked={props.selectedModes?.includes(mode)}
                                        onChange={() => props.onModeChange?.(mode)}
                                    />
                                    <span className="text-sm text-gray-700">{mode}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Certificate Toggle */}
            {props.onCertificateChange && (
                <button
                    onClick={() => props.onCertificateChange?.(!props.certificateOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                        props.certificateOnly
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <span>Certificate</span>
                </button>
            )}

            {/* Verified Toggle */}
            {props.onVerifiedChange && (
                <button
                    onClick={() => props.onVerifiedChange?.(!props.verifiedOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                        props.verifiedOnly
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <span>Verified</span>
                </button>
            )}

            {/* Selected Filters */}
            {props.selectedTypes?.map(type => (
                <span
                    key={type}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-sm"
                >
                    {type}
                    <button
                        onClick={() => props.onTypeChange(type)}
                        className="hover:bg-green-200 rounded p-0.5"
                    >
                        <IoClose className="w-3.5 h-3.5" />
                    </button>
                </span>
            ))}

            {props.selectedCategories?.map(category => (
                <span
                    key={category}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1F44]/10 text-[#0A1F44] text-sm border border-[#0A1F44]/20"
                >
                    {category}
                    <button
                        onClick={() => props.onCategoryChange(category)}
                        className="hover:bg-[#0A1F44]/20 rounded p-0.5"
                    >
                        <IoClose className="w-3.5 h-3.5" />
                    </button>
                </span>
            ))}

            {props.selectedModes?.map(mode => (
                <span
                    key={mode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14B8A6]/10 text-[#0D9488] text-sm"
                >
                    {mode}
                    <button
                        onClick={() => props.onModeChange?.(mode)}
                        className="hover:bg-[#14B8A6]/20 rounded p-0.5"
                    >
                        <IoClose className="w-3.5 h-3.5" />
                    </button>
                </span>
            ))}

            {/* Clear All */}
            {activeFilterCount > 0 && (
                <button
                    onClick={handleClearAll}
                    className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
                >
                    Clear all
                </button>
            )}
        </div>
    );
}

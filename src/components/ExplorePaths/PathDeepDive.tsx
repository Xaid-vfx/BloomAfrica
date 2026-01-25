'use client'

import { useState } from 'react'
import { CheckCircle2, ChevronDown } from 'lucide-react'

type PathStep = {
    number: number
    title: string
    description: string
}

type PathDeepDiveProps = {
    variant: 'artisan' | 'company'
    title: string
    subtitle: string
    icon: React.ReactNode
    whatYouExperience: string[]
    typicalDay: string[]
    steps: PathStep[]
}

export default function PathDeepDive({
    variant,
    title,
    subtitle,
    icon,
    whatYouExperience,
    typicalDay,
    steps
}: PathDeepDiveProps) {
    const [expandedSections, setExpandedSections] = useState({
        experience: true,
        typicalDay: false
    })

    const toggleSection = (section: 'experience' | 'typicalDay') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const isArtisan = variant === 'artisan'
    const primaryColor = isArtisan ? '#14B8A6' : '#0A1F44'
    const bgGradient = isArtisan
        ? 'from-[#14B8A6]/5 via-white to-[#14B8A6]/5'
        : 'from-[#0A1F44]/5 via-white to-[#0A1F44]/5'

    return (
        <div className={`py-10 lg:py-20 px-4 lg:px-6 bg-gradient-to-b ${bgGradient} overflow-x-hidden`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-12">
                    <div
                        className="p-3 lg:p-4 rounded-2xl text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-[#0A1F44] xl:text-4xl">{title}</h2>
                        <p className="text-base lg:text-lg text-gray-600">{subtitle}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* Left Column - What You'll Experience */}
                    <div className="min-w-0">
                        {/* Mobile Accordion Header */}
                        <button
                            onClick={() => toggleSection('experience')}
                            className="lg:hidden w-full flex items-center justify-between text-lg font-bold text-[#0A1F44] mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 min-w-0"
                        >
                            <span className="truncate">What You'll Experience</span>
                            <ChevronDown
                                size={20}
                                className={`flex-shrink-0 transition-transform duration-300 ${expandedSections.experience ? 'rotate-180' : ''}`}
                                style={{ color: primaryColor }}
                            />
                        </button>
                        {/* Desktop Header */}
                        <h3 className="hidden lg:block text-xl font-bold text-[#0A1F44] mb-6">What You'll Experience</h3>

                        {/* Mobile Collapsible Content */}
                        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.experience ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="space-y-4 pb-4">
                                {whatYouExperience.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle2
                                            size={24}
                                            className="flex-shrink-0 mt-0.5"
                                            style={{ color: primaryColor }}
                                        />
                                        <p className="text-gray-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Desktop Always Visible Content */}
                        <div className="hidden lg:block space-y-4">
                            {whatYouExperience.map((item, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle2
                                        size={24}
                                        className="flex-shrink-0 mt-0.5"
                                        style={{ color: primaryColor }}
                                    />
                                    <p className="text-gray-700">{item}</p>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Accordion Header for Typical Day */}
                        <button
                            onClick={() => toggleSection('typicalDay')}
                            className="lg:hidden w-full flex items-center justify-between text-lg font-bold text-[#0A1F44] mt-4 mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 min-w-0"
                        >
                            <span className="truncate">A Typical Day</span>
                            <ChevronDown
                                size={20}
                                className={`flex-shrink-0 transition-transform duration-300 ${expandedSections.typicalDay ? 'rotate-180' : ''}`}
                                style={{ color: primaryColor }}
                            />
                        </button>
                        {/* Desktop Header */}
                        <h3 className="hidden lg:block text-xl font-bold text-[#0A1F44] mt-10 mb-6">A Typical Day</h3>

                        {/* Mobile Collapsible Content */}
                        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${expandedSections.typicalDay ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
                                <ul className="space-y-3">
                                    {typicalDay.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                {index + 1}
                                            </span>
                                            <p className="text-gray-700">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {/* Desktop Always Visible Content */}
                        <div className="hidden lg:block bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <ul className="space-y-3">
                                {typicalDay.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {index + 1}
                                        </span>
                                        <p className="text-gray-700">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Path to Success */}
                    <div className="min-w-0">
                        <h3 className="text-xl font-bold text-[#0A1F44] mb-4 lg:mb-6">
                            Your Path to {isArtisan ? 'Independence' : 'Employment'}
                        </h3>

                        {/* Mobile Horizontal Scroll Timeline */}
                        <div className="lg:hidden -mx-4 px-4">
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="w-[240px] flex-shrink-0 snap-start"
                                    >
                                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base mb-3"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                {step.number}
                                            </div>
                                            <h4 className="font-semibold text-[#0A1F44] mb-2 text-sm">{step.title}</h4>
                                            <p className="text-gray-600 text-xs">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Vertical Timeline */}
                        <div className="hidden lg:block relative">
                            {/* Vertical line */}
                            <div
                                className="absolute left-6 top-8 bottom-8 w-0.5"
                                style={{ backgroundColor: `${primaryColor}30` }}
                            />

                            <div className="space-y-8">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-6">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 z-10"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {step.number}
                                        </div>
                                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
                                            <h4 className="font-semibold text-[#0A1F44] mb-2">{step.title}</h4>
                                            <p className="text-gray-600 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

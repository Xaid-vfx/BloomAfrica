'use client'

import { Hammer, Building2 } from 'lucide-react'

type ComparisonRow = {
    aspect: string
    artisan: string
    company: string
}

export default function PathComparisonDetailed() {
    const comparisons: ComparisonRow[] = [
        {
            aspect: "Training Style",
            artisan: "One-on-one mentorship with a master craftsperson",
            company: "Team-based learning with structured curriculum"
        },
        {
            aspect: "Duration",
            artisan: "6-24 months depending on trade",
            company: "3-12 months depending on role"
        },
        {
            aspect: "Outcome",
            artisan: "Start your own business, self-employment",
            company: "Employment offer, career advancement"
        },
        {
            aspect: "Best For",
            artisan: "Entrepreneurs, independent workers",
            company: "Career seekers, team players"
        },
        {
            aspect: "Example Industries",
            artisan: "Tailoring, Welding, Automotive, Furniture",
            company: "Tech, Marketing, Logistics, Operations"
        }
    ]

    return (
        <div className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold lg:text-4xl text-[#0A1F44] mb-4">
                        Compare Your Options
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Understand the key differences between artisan and company training paths
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="grid grid-cols-3 bg-[#0A1F44] text-white">
                        <div className="p-4 font-semibold text-sm lg:text-base"></div>
                        <div className="p-4 font-semibold text-sm lg:text-base flex items-center gap-2 justify-center border-l border-white/20">
                            <Hammer size={18} />
                            <span>Artisan Path</span>
                        </div>
                        <div className="p-4 font-semibold text-sm lg:text-base flex items-center gap-2 justify-center border-l border-white/20">
                            <Building2 size={18} />
                            <span>Company Path</span>
                        </div>
                    </div>

                    {/* Rows */}
                    {comparisons.map((row, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                            <div className="p-4 font-semibold text-[#0A1F44] text-sm lg:text-base flex items-center">
                                {row.aspect}
                            </div>
                            <div className="p-4 text-gray-700 text-sm lg:text-base border-l border-gray-200">
                                {row.artisan}
                            </div>
                            <div className="p-4 text-gray-700 text-sm lg:text-base border-l border-gray-200">
                                {row.company}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

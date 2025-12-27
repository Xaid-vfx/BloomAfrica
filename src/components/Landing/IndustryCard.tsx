'use client'

import Link from 'next/link'

type IndustryCardProps = {
    icon: React.ReactNode
    title: string
    description: string
    href: string
    color?: string
}

export default function IndustryCard({ icon, title, description, href, color = '#3B82F6' }: IndustryCardProps) {
    return (
        <Link
            href={href}            className="border border-grey-200 rounded-lg p-6 bg-white hover:bg-grey-50 transition-all cursor-pointer flex flex-col items-center text-center"
            style={{ borderColor: 'rgb(233, 236, 239)' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = color}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgb(233, 236, 239)'}
        >
            <div className="mb-3" style={{ color }}>
                {icon}
            </div>
            <h3 className="text-sm md:text-base font-medium text-grey-900">
                {title}
            </h3>
            <p className="text-xs text-grey-600 mt-2 hidden md:block">
                {description}
            </p>
        </Link>
    )
}

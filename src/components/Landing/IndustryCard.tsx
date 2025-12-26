import Link from 'next/link'

type IndustryCardProps = {
    icon: React.ReactNode
    title: string
    description: string
    href: string
}

export default function IndustryCard({ icon, title, description, href }: IndustryCardProps) {
    return (
        <Link
            href={href}
            className="border border-grey-200 rounded-lg p-6 bg-white hover:border-[#4A2C84] hover:bg-grey-50 transition-all cursor-pointer flex flex-col items-center text-center"
        >
            <div className="text-[#4A2C84] mb-3">
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

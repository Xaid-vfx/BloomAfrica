import Link from 'next/link'

type TrackCardProps = {
    icon: React.ReactNode
    title: string
    description: string
    result: string[]
    ctaLink: string
}

export default function TrackCard({ icon, title, description, result, ctaLink }: TrackCardProps) {
    return (
        <div className="h-full border border-grey-200 rounded-xl p-8 bg-white hover:border-[#4A2C84] transition-colors flex flex-col">
            <div className="text-[#4A2C84] mb-6 flex justify-center">
                {icon}
            </div>

            <h3 className="text-2xl font-semibold text-grey-900 mb-6 text-center">
                {title}
            </h3>

            <div className="flex-grow">
                <p className="text-sm text-grey-700 leading-6">
                    {description}
                </p>
            </div>

            <ul className="space-y-3 mt-6 mb-6">
                {result.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <span className="text-[#4A2C84] text-xl font-bold leading-none">•</span>
                        <span className="text-base font-semibold text-grey-900 leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>

            <Link
                href={ctaLink}
                className="btn-primary px-6 py-3 rounded-lg text-center"
            >
                Find Apprenticeship
            </Link>
        </div>
    )
}

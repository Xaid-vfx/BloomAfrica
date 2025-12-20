type Props = {
    icon: React.ReactNode
    title: string
    description: string
}

export default function BenefitCard({ icon, title, description }: Props) {
    return (
        <div className="border border-grey-200 rounded-xl p-6 hover:border-[#4A2C84] transition-colors bg-white">
            <div className="text-[#4A2C84] mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-medium text-grey-900 mb-3">
                {title}
            </h3>
            <p className="text-sm text-grey-600 leading-6">
                {description}
            </p>
        </div>
    )
}

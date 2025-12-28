type Props = {
    icon: React.ReactNode
    title: string
    description: string
}

export default function BenefitCard({ icon, title, description }: Props) {
    return (
        <div className="border border-white/10 rounded-xl p-6 hover:border-[#14B8A6] transition-all bg-white/5 backdrop-blur-sm hover:bg-white/10">
            <div className="text-[#14B8A6] mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-medium text-white mb-3">
                {title}
            </h3>
            <p className="text-sm text-white/70 leading-6">
                {description}
            </p>
        </div>
    )
}

export default function StatsSection() {
    const stats = [
        {
            number: "500+",
            label: "Active Trainers",
            description: "Master Artisans and Companies trust Prentis"
        },
        {
            number: "10,000+",
            label: "Apprentices Trained",
            description: "Building the next generation of skilled professionals"
        },
        {
            number: "95%",
            label: "Hiring Success Rate",
            description: "Companies hire the apprentices they train"
        },
        {
            number: "12",
            label: "Industries",
            description: "From tech to automotive to hospitality"
        }
    ]

    return (
        <div className="pb-4 px-6 lg:pb-6 lg:px-12 relative overflow-hidden">
            <div className="max-w-[1500px] mx-auto relative z-10">
                {/* Stats Grid with Glass Background */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 lg:p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`text-center px-3 lg:px-4 ${
                                    index % 2 === 1 ? 'border-l border-white/20' : ''
                                } ${
                                    index >= 2 ? 'lg:border-l lg:border-white/20' : ''
                                }`}
                            >
                                <div className="text-xl lg:text-3xl font-bold text-[#14B8A6] mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-[11px] lg:text-sm font-semibold text-white mb-1">
                                    {stat.label}
                                </div>
                                <p className="text-[9px] lg:text-xs text-white/70 hidden lg:block">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

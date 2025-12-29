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
        <div className="py-20 px-6 lg:py-28 lg:px-12 bg-white relative overflow-hidden">
            {/* Decorative Blob */}
            <svg viewBox="0 0 400 400" className="absolute bottom-0 right-0 w-[250px] h-[250px] md:w-[350px] md:h-[350px] opacity-[0.04] pointer-events-none" style={{ transform: 'translate(25%, 25%)' }}>
                <path fill="#14B8A6" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>

            <div className="max-w-[1500px] mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-semibold text-[#1F2937] mb-4">
                        Join a Growing Community
                    </h2>
                    <p className="text-lg text-[#6B7280] lg:max-w-2xl mx-auto">
                        Thousands of trainers and apprentices are already building the future on Prentis
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="mb-3">
                                <div className="text-4xl lg:text-5xl font-bold text-[#14B8A6] mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-lg lg:text-xl font-semibold text-[#1F2937]">
                                    {stat.label}
                                </div>
                            </div>
                            <p className="text-sm text-[#6B7280]">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

import IndustryCard from './IndustryCard'
import { Car, Zap, Cpu, ShieldCheck, Shirt, Palette, Home, Video, TrendingUp, Truck, Briefcase, UtensilsCrossed } from 'lucide-react'

export default function IndustriesMaster() {
    const industries = [
        {
            id: "automotive-tech",
            title: "Automotive Tech",
            description: "Advanced diagnostics, engine repair, and bodywork.",
            icon: <Car size={40} strokeWidth={1.5} />
        },
        {
            id: "renewable-energy",
            title: "Renewable Energy",
            description: "Solar installation, electrical systems, and maintenance.",
            icon: <Zap size={40} strokeWidth={1.5} />
        },
        {
            id: "hardware-engineering",
            title: "Hardware Engineering",
            description: "Product prototyping, electronics, and manufacturing.",
            icon: <Cpu size={40} strokeWidth={1.5} />
        },
        {
            id: "industrial-safety",
            title: "Industrial Safety",
            description: "Health and safety standards for large-scale operations.",
            icon: <ShieldCheck size={40} strokeWidth={1.5} />
        },
        {
            id: "fashion-textiles",
            title: "Fashion & Textiles",
            description: "High-end tailoring, garment construction, and brand building.",
            icon: <Shirt size={40} strokeWidth={1.5} />
        },
        {
            id: "product-design",
            title: "Product Design",
            description: "Creating user-centered physical and digital products.",
            icon: <Palette size={40} strokeWidth={1.5} />
        },
        {
            id: "interior-finishing",
            title: "Interior Finishing",
            description: "Professional carpentry, masonry, and modern finishing.",
            icon: <Home size={40} strokeWidth={1.5} />
        },
        {
            id: "content-media",
            title: "Content & Media",
            description: "Digital storytelling, production, and brand operations.",
            icon: <Video size={40} strokeWidth={1.5} />
        },
        {
            id: "marketing-growth",
            title: "Marketing & Growth",
            description: "Strategy, sales, and market entry for new businesses.",
            icon: <TrendingUp size={40} strokeWidth={1.5} />
        },
        {
            id: "logistics-supply",
            title: "Logistics & Supply Chain",
            description: "Managing transport, warehousing, and distribution.",
            icon: <Truck size={40} strokeWidth={1.5} />
        },
        {
            id: "business-ops",
            title: "Business Operations",
            description: "Learning how to manage and scale a professional team.",
            icon: <Briefcase size={40} strokeWidth={1.5} />
        },
        {
            id: "hospitality",
            title: "Hospitality & Service",
            description: "Professional management for the tourism and service sectors.",
            icon: <UtensilsCrossed size={40} strokeWidth={1.5} />
        }
    ]

    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold lg:text-4xl text-grey-900">
                        Industries You Can Master
                    </h2>
                    <p className="text-grey-600 mt-4 text-lg max-w-2xl mx-auto">
                        Explore apprenticeships across diverse industries
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {industries.map((industry, index) => {
                        const colors = ['#3B82F6', '#14B8A6', '#FF6B6B', '#8B5CF6', '#F59E0B']
                        const color = colors[index % colors.length]
                        return (
                            <IndustryCard
                                key={industry.id}
                                icon={industry.icon}
                                title={industry.title}
                                description={industry.description}
                                href={`/all-trainings?search=${encodeURIComponent(industry.title)}`}
                                color={color}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

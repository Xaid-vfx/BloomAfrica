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
        <div className="relative bg-white py-20 px-6 overflow-hidden">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 500 500" className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[500px] md:h-[500px] opacity-[0.08] pointer-events-none" style={{ transform: 'translate(40%, -40%)' }}>
                <path fill="#0A1F44" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>
            <svg viewBox="0 0 250 250" className="absolute top-1/2 left-0 w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-10 pointer-events-none" style={{ transform: 'translate(-40%, -50%)' }}>
                <path fill="#1A3A64" d="M213.3,109.7c-7.7,29.9-30.6,52.8-60.5,60.5c-29.9,7.7-60.9-2.8-82.1-27.6c-21.1-24.9-28.3-58.9-18.9-89.6c9.4-30.8,32-52.8,58.9-53.9c26.9-1.1,57.4,17.8,72.4,46.9C197.6,75.6,221,79.8,213.3,109.7z"/>
            </svg>

            <div className="max-w-6xl mx-auto relative z-10">
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
                        const colors = ['#14B8A6', '#0A1F44', '#2DD4BF', '#1A3A64', '#0D9488']
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

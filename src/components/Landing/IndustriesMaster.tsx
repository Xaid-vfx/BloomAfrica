import IndustryCard from './IndustryCard'
import { Car, Zap, Cpu, ShieldCheck, Shirt, Palette, Home, Radio, Sprout, Mountain, Truck, UtensilsCrossed } from 'lucide-react'

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
            id: "construction",
            title: "Construction",
            description: "Professional carpentry, masonry, and modern finishing.",
            icon: <Home size={40} strokeWidth={1.5} />
        },
        {
            id: "logistics-supply",
            title: "Logistics & Supply Chain",
            description: "Managing transport, warehousing, and distribution.",
            icon: <Truck size={40} strokeWidth={1.5} />
        },
        {
            id: "hospitality",
            title: "Hospitality & Service",
            description: "Professional management for the tourism and service sectors.",
            icon: <UtensilsCrossed size={40} strokeWidth={1.5} />
        },
        {
            id: "telecommunications",
            title: "Telecommunications",
            description: "Network infrastructure, fiber optics, and wireless systems.",
            icon: <Radio size={40} strokeWidth={1.5} />
        },
        {
            id: "agritech",
            title: "Agritech",
            description: "Modern farming technology, irrigation, and sustainable agriculture.",
            icon: <Sprout size={40} strokeWidth={1.5} />
        },
        {
            id: "mining-geological",
            title: "Mining & Geological",
            description: "Mineral extraction, surveying, and geological analysis.",
            icon: <Mountain size={40} strokeWidth={1.5} />
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
            <svg viewBox="0 0 350 350" className="absolute bottom-10 right-1/4 w-[180px] h-[180px] md:w-[220px] md:h-[220px] opacity-[0.07] pointer-events-none" style={{ transform: 'translate(50%, 30%)' }}>
                <path fill="#0A1F44" d="M283.9,142.8c-10.2,39.6-40.6,70-80.2,80.2c-39.6,10.2-80.6-3.7-108.9-36.6c-28.3-32.9-37.5-78.1-25.1-118.8c12.4-40.8,42.4-70,78-71.4c35.6-1.5,76,23.5,96,62.1C265.5,98.7,294.1,103.2,283.9,142.8z"/>
            </svg>
            <svg viewBox="0 0 400 400" className="absolute top-1/3 right-1/4 w-[160px] h-[160px] md:w-[200px] md:h-[200px] opacity-[0.06] pointer-events-none">
                <path fill="#14B8A6" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>
            <svg viewBox="0 0 300 300" className="absolute bottom-1/4 left-1/4 w-[140px] h-[140px] md:w-[180px] md:h-[180px] opacity-[0.05] pointer-events-none" style={{ transform: 'translate(-50%, 20%)' }}>
                <path fill="#1A3A64" d="M246.4,123.3c-8.8,34.2-35,60.4-69.2,69.2c-34.2,8.8-69.6-3.2-94-31.6c-24.4-28.4-32.4-67.4-21.6-102.5c10.8-35.2,36.6-60.4,67.3-61.6c30.7-1.3,65.6,20.3,82.8,53.6C227,84.4,255.2,89.1,246.4,123.3z"/>
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

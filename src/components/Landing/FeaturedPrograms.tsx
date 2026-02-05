import FeaturedCard from "./FeaturedCard";
import { FaArrowRightLong } from "react-icons/fa6";

export default function FeaturedPrograms() {
    const programs = [
        {
            title: "Full-Stack Engineering Fellowship",
            location: "Lagos (Hybrid)",
            type: "Full-Time",
            partner: "Series A Fintech Startup",
            duration: "6 months",
            technologies: ["React", "Node.js", "PostgreSQL", "AWS"],
            description: "Build production features for a live financial platform serving 10,000+ users. Work on payment systems, user authentication, and data analytics..."
        },
        {
            title: "Mobile Engineering Fellowship",
            location: "Remote",
            type: "Full-Time",
            partner: "Growth-Stage EdTech Company",
            duration: "6 months",
            technologies: ["React Native", "TypeScript", "Firebase"],
            description: "Develop mobile features for an education app with 50,000+ downloads. Build cross-platform features, optimize performance..."
        },
        {
            title: "Data Engineering Fellowship",
            location: "Abuja (Hybrid)",
            type: "Full-Time",
            partner: "Early-Stage HealthTech",
            duration: "6 months",
            technologies: ["Python", "AWS", "Apache Spark"],
            description: "Design data pipelines and analytics infrastructure for health data platform. Work with large-scale data processing..."
        },
        {
            title: "Product Design Fellowship",
            location: "Remote",
            type: "Full-Time",
            partner: "B2B SaaS Startup",
            duration: "6 months",
            technologies: ["Figma", "User Research", "Prototyping"],
            description: "Design user interfaces and experiences for enterprise software. Conduct user research, create prototypes, and collaborate with engineers..."
        },
        {
            title: "Backend Engineering Fellowship",
            location: "Lagos (On-site)",
            type: "Full-Time",
            partner: "Series B Logistics Startup",
            duration: "6 months",
            technologies: ["Python", "Django", "PostgreSQL", "Redis"],
            description: "Build scalable backend systems for logistics platform. Design APIs, optimize database queries, implement caching strategies..."
        },
        {
            title: "Frontend Engineering Fellowship",
            location: "Remote",
            type: "Full-Time",
            partner: "E-commerce Platform",
            duration: "6 months",
            technologies: ["Vue.js", "Tailwind CSS", "GraphQL"],
            description: "Create responsive user interfaces for e-commerce platform. Build reusable components, optimize performance, implement accessibility..."
        },
        {
            title: "DevOps Engineering Fellowship",
            location: "Ibadan (Hybrid)",
            type: "Full-Time",
            partner: "Cloud Infrastructure Startup",
            duration: "6 months",
            technologies: ["Kubernetes", "Docker", "Terraform", "AWS"],
            description: "Manage cloud infrastructure and deployment pipelines. Implement CI/CD, monitor system health, automate deployments..."
        },
        {
            title: "AI/ML Engineering Fellowship",
            location: "Remote",
            type: "Full-Time",
            partner: "AI Research Startup",
            duration: "6 months",
            technologies: ["Python", "TensorFlow", "PyTorch", "MLOps"],
            description: "Build machine learning models for production. Train models, optimize performance, deploy ML systems at scale..."
        }
    ];

    return (
        <div className="bg-white py-16 px-4 lg:py-24">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold lg:text-4xl text-grey-900">Featured Fellowship Programs</h1>
                <p className="text-base my-3 lg:text-lg text-grey-600">
                    Explore our current fellowship opportunities and start building
                </p>
            </div>
            <div className="my-12 ms-auto me-auto max-w-[1500px]">
                <p className="flex items-center gap-2 justify-end text-[#14B8A6] text-sm text-right lg:px-8 mb-6">
                    <a href="/all-trainings" className="hover:underline cursor-pointer font-medium">View All Programs</a>
                    <FaArrowRightLong />
                </p>
                <div className="hidden lg:grid grid-cols-4 justify-center px-8 gap-6">
                    {
                        programs.map((program, index) => {
                            return (
                                <FeaturedCard
                                    key={index}
                                    id={index.toString()}
                                    title={program.title}
                                    location={program.location}
                                    type={program.type}
                                    description={program.description}
                                    diploma={program.duration}
                                    company={program.partner}
                                    technologies={program.technologies}
                                />
                            )
                        })
                    }
                </div>
                <div className="my-4 lg:hidden space-y-4">
                    {
                        programs.slice(0, 2).map((program, index) => {
                            return (
                                <FeaturedCard
                                    key={index}
                                    id={index.toString()}
                                    title={program.title}
                                    location={program.location}
                                    type={program.type}
                                    description={program.description}
                                    diploma={program.duration}
                                    company={program.partner}
                                    technologies={program.technologies}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

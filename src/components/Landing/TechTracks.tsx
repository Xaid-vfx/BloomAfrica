import CategoryCard from "./CategoryCard";
import { FaArrowRightLong } from "react-icons/fa6";

export default function TechTracks() {
    const tracks = [
        {
            title: "Software Engineering",
            description: "Build full-stack web applications with modern frameworks and technologies. Master frontend and backend development."
        },
        {
            title: "Mobile Development",
            description: "Create cross-platform mobile apps with React Native and Flutter. Deploy to iOS and Android app stores."
        },
        {
            title: "Data Science & Engineering",
            description: "Work with large-scale data pipelines, analytics, and machine learning systems in production environments."
        },
        {
            title: "Product Design (UI/UX)",
            description: "Design user interfaces and experiences for web and mobile applications. Conduct user research and prototyping."
        },
        {
            title: "DevOps & Cloud Engineering",
            description: "Manage cloud infrastructure, implement CI/CD pipelines, and ensure system reliability at scale."
        },
        {
            title: "AI/ML Engineering",
            description: "Build and deploy machine learning models. Work on NLP, computer vision, and recommendation systems."
        },
        {
            title: "Backend Engineering",
            description: "Design scalable APIs and microservices. Optimize database performance and build distributed systems."
        },
        {
            title: "Frontend Engineering",
            description: "Create responsive, accessible web interfaces. Master modern JavaScript frameworks and state management."
        }
    ];

    return (
        <div className="hidden lg:block py-16 px-4 bg-grey-50 lg:py-24">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-semibold lg:text-4xl text-grey-900">Explore by Tech Track</h1>
                <p className="text-base my-3 lg:text-lg text-grey-600">
                    Find the specialization that matches your goals
                </p>
            </div>
            <div className="my-12 ms-auto me-auto max-w-[1500px]">
                <p className="flex items-center gap-2 justify-end text-[#14B8A6] text-sm text-right px-8 mb-6">
                    <a href="/all-trainings" className="hover:underline cursor-pointer font-medium">View All Tracks</a>
                    <FaArrowRightLong />
                </p>
                <div className="grid grid-cols-4 justify-center px-8 gap-6">
                    {
                        tracks.map((track, index) => {
                            return (
                                <CategoryCard
                                    key={index}
                                    id={index.toString()}
                                    title={track.title}
                                    location="Remote / Hybrid"
                                    salary=""
                                    type="Full-Time"
                                    description={track.description}
                                    extras=""
                                    responsibilities=""
                                    who_you_are=""
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

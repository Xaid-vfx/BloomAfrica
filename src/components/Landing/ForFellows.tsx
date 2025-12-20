import Link from "next/link"
import BenefitCard from "./BenefitCard"
import { Code2, Users, BookOpen, TrendingUp } from "lucide-react"

export default function ForFellows() {
    return (
        <div className="bg-white py-20 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold lg:text-4xl text-grey-900">
                        Why Join the Fellowship?
                    </h2>
                    <p className="text-grey-600 mt-4 text-lg max-w-2xl mx-auto">
                        Build real products, work with experienced engineers, and launch your tech career
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <BenefitCard
                        icon={<Code2 size={48} strokeWidth={1.5} />}
                        title="Real Product Experience"
                        description="Don't just learn to code—ship features to production. Build your portfolio with verified contributions to live products used by real customers."
                    />
                    <BenefitCard
                        icon={<Users size={48} strokeWidth={1.5} />}
                        title="Expert Mentorship"
                        description="Work alongside senior engineers and product leaders. Get code reviews, career guidance, and industry insights from experienced professionals."
                    />
                    <BenefitCard
                        icon={<BookOpen size={48} strokeWidth={1.5} />}
                        title="Structured Curriculum"
                        description="Follow our proven 6-month learning path. Master full-stack development, system design, and professional engineering practices."
                    />
                    <BenefitCard
                        icon={<TrendingUp size={48} strokeWidth={1.5} />}
                        title="Career Launch"
                        description="95% of fellows get hired within 3 months. Build relationships with hiring managers at partner startups and graduate with certifications companies value."
                    />
                </div>

                <div className="text-center mt-12">
                    <Link href="/all-trainings" className="btn-primary px-8 py-3 rounded-lg inline-block">
                        Apply Now
                    </Link>
                </div>
            </div>
        </div>
    )
}

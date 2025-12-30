type Props = {
    heading?: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
}

export default function GetStarted({
    heading = "Ready to Build Your Future?",
    subtitle = "Join Africa's premier technical fellowship. Get embedded in real startups, build production features, and launch your tech career with verified experience.",
    ctaText = "Apply to Fellowship",
    ctaLink = "/all-trainings"
}: Props) {
    return (
        <div className="relative py-20 px-6 lg:py-28 lg:px-12 text-white flex flex-col justify-center items-center max-w-[1500px] mx-auto overflow-hidden">
            <h2 className="text-2xl font-semibold mb-6 lg:text-4xl text-center relative z-10">{heading}</h2>
            <p className="text-base leading-relaxed text-center lg:text-lg lg:w-2/3 px-1 sm:px-10 md:px-40 lg:px-0 text-grey-100 relative z-10">
                {subtitle}
            </p>
            <a href={ctaLink} className="mt-10 text-white bg-[#14B8A6] px-8 py-3 font-medium rounded-lg hover:bg-[#0D9488] transition-colors relative z-10">
                {ctaText}
            </a>
        </div>
    )
}

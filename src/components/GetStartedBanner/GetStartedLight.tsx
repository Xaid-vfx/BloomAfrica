type Props = {
    heading?: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
}

export default function GetStartedLight({
    heading = "Ready to Get Started?",
    subtitle = "Join Prentis and start training apprentices today.",
    ctaText = "Create Your Account",
    ctaLink = "/signup?type=recruiter"
}: Props) {
    return (
        <div className="relative bg-white py-20 px-6 lg:py-28 lg:px-12 overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-[#14B8A6]/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-[#0A1F44]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#14B8A6]/5 rounded-full blur-2xl"></div>

            {/* Content */}
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-3xl font-bold mb-6 lg:text-5xl text-[#0A1F44]">
                    {heading}
                </h2>
                <p className="text-lg leading-relaxed lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    {subtitle}
                </p>
                <a
                    href={ctaLink}
                    className="inline-block text-white bg-[#0A1F44] hover:bg-[#14B8A6] px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 transform"
                >
                    {ctaText}
                </a>

                {/* Decorative dots pattern */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-20">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#0A1F44]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                </div>
            </div>
        </div>
    )
}

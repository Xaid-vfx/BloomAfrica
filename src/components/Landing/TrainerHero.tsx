import Link from "next/link"

export default function TrainerHero() {
    return (
        <div className='relative overflow-hidden w-full'>
            {/* Content */}
            <div className='lg:px-12 lg:pt-12 py-12 px-6 ms-auto me-auto max-w-[1500px] relative z-10'>
                <div className="flex flex-col justify-center items-center">
                    {/* Badge */}
                    <div className="flex items-center w-full justify-center">
                        <div className="px-4 py-2 text-xs lg:text-sm rounded-full text-white bg-white/10 font-medium border border-white/20 backdrop-blur-sm">
                            For Master Artisans & Companies in Nigeria  
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-[2.2rem] leading-[2.5rem] sm:text-4xl lg:text-5xl sm:leading-tight my-4 lg:my-5 text-center font-semibold lg:leading-tight lg:max-w-4xl text-white hero-fade-in">
                        Train and Manage Your Apprenticeships <span className="text-[#14B8A6]">All in One Place</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base text-white/90 leading-relaxed text-center px-2 lg:px-0 lg:text-lg lg:max-w-2xl hero-fade-in-delay">
                        Become an accredited vocational training institution. Offer HND, ND, B.Tech, and NABTEB-certified programs to apprentices across Nigeria.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function GetStarted() {
    return (
        <div className="relative my-10 mx-4 rounded-3xl bg-[#0A1F44] text-white px-5 py-24 flex flex-col justify-center items-center lg:ms-auto lg:me-auto lg:py-28 max-w-[1500px] overflow-hidden">
            {/* Decorative Blobs */}
            <svg viewBox="0 0 400 400" className="absolute top-4 left-4 w-[280px] h-[280px] md:w-[350px] md:h-[350px] opacity-12 pointer-events-none">
                <path fill="#14B8A6" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
            </svg>
            <svg viewBox="0 0 250 250" className="absolute bottom-4 right-4 w-[200px] h-[200px] md:w-[250px] md:h-[250px] opacity-10 pointer-events-none">
                <path fill="#2DD4BF" d="M213.3,109.7c-7.7,29.9-30.6,52.8-60.5,60.5c-29.9,7.7-60.9-2.8-82.1-27.6c-21.1-24.9-28.3-58.9-18.9-89.6c9.4-30.8,32-52.8,58.9-53.9c26.9-1.1,57.4,17.8,72.4,46.9C197.6,75.6,221,79.8,213.3,109.7z"/>
            </svg>

            <h2 className="text-2xl font-semibold mb-6 lg:text-4xl text-center relative z-10">Ready to Build Your Future?</h2>
            <p className="text-base leading-relaxed text-center lg:text-lg lg:w-2/3 px-1 sm:px-10 md:px-40 lg:px-0 text-grey-100 relative z-10">
                Join Africa's premier technical fellowship. Get embedded in real startups, build production features, and launch your tech career with verified experience.
            </p>
            <a href="/all-trainings" className="mt-10 text-white bg-[#14B8A6] px-8 py-3 font-medium rounded-lg hover:bg-[#0D9488] transition-colors relative z-10">
                Apply to Fellowship
            </a>
        </div>
    )
}

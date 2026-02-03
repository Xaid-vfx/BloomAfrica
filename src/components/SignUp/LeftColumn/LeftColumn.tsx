import PrentisLogoWhite from '@/components/Logo/PrentisLogoWhite'

export default function LeftColumn() {
    return (
        <div className="hidden lg:flex py-8 px-10 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] w-[45%] flex-col relative overflow-hidden">
            {/* Decorative SVG Blob */}
            <svg viewBox="0 0 500 500" className="absolute top-0 left-0 w-[400px] h-[400px] opacity-8 pointer-events-none" style={{ transform: 'translate(-20%, -20%)' }}>
                <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
            </svg>

            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
                <PrentisLogoWhite className="text-4xl mb-8" />
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md text-center">
                    <h2 className="text-white text-2xl font-semibold mb-4">Welcome to Prentis</h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Join thousands of apprentices and trainers building their careers and businesses on our platform.
                    </p>
                </div>
            </div>
        </div>
    )
}
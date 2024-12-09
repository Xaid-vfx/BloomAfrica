import Image from "next/image";
import VBall from "../../assets/images/VBalls.png";
import VBallDesktop from "../../assets/images/VBallsDesktop.png";

export default function GetStarted() {
    return (
        <div className="my-10 mx-4 relative rounded-[3rem] bg-[#171c1f] text-white px-5 py-24 flex flex-col justify-center items-center overflow-hidden lg:ms-auto lg:me-auto lg:py-28 max-w-[1500px]">

            <h2 className="text-lg font-medium mb-8 lg:text-2xl">Get Started with Bloom</h2>
            <p className="text-sm leading-6 text-center lg:text-md m lg:w-2/3 px-1 sm:px-10 md:px-40 lg:px-0 ">
                Bloom connects aspiring apprentices with top Ogas & mentors, offering hands-on learning, professional development, and career growth.
                <br /> <br />
                Start your apprenticeship journey today. Connect, learn, and grow with the right opportunities to shape your future.
            </p>
            <a href="/signup" className="mt-10 text-black bg-white px-6 py-3 font-medium rounded-3xl">Get Started</a>
            <div className="absolute top-0 left-0 lg:hidden">
                <Image src={VBall} alt="balls" width={60} className="rotate-180 " />
            </div>
            <div className="absolute bottom-0 right-0 lg:hidden">
                <Image src={VBall} alt="balls" width={60} />
            </div>
            <div className="absolute top-0 left-0 hidden lg:block">
                <Image src={VBallDesktop} alt="balls" width={150} className="rotate-180 " />
            </div>
            <div className="absolute bottom-0 right-0 hidden lg:block">
                <Image src={VBallDesktop} alt="balls" width={150} />
            </div>
        </div>
    )
}
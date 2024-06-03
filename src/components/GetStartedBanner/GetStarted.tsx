import Image from "next/image";
import VBall from "../../assets/images/VBalls.png";
import VBallDesktop from "../../assets/images/VBallsDesktop.png";

export default function GetStarted() {
    return (
        <div className="my-10 mx-4 relative rounded-[3rem] bg-[#171c1f] text-white px-5 py-24 flex flex-col justify-center items-center overflow-hidden lg:mx-20 lg:py-28">

            <h2 className="text-lg font-medium mb-8 lg:text-2xl">Get Started with Bloom</h2>
            <p className="text-xs leading-6 text-center lg:text-sm lg:w-2/3">
                Bloom's platform offers a comprehensive suite of features and benefits designed to empower both job seekers and recruiters in their respective career goals and recruitment needs.
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
import Image from "next/image"
import Girl from "../../assets/images/SmilingWoman.png"

export default function Beliefs() {
    return (
        <div className="bg-[#171c1f] text-white flex w-full">
            <div className="bg-[#897DD3] flex justify-center py-6 w-[45%]">
                <Image src={Girl} alt="girl" width={500} height={100} />
            </div>
            <div className="w-[55%] text-center flex flex-col gap-10 px-20 justify-center items-center">
                <h1 className="text-4xl font-semibold">Our Mission</h1>
                <p className="text-sm leading-7">At Bloom, our mission is to empower young Nigerians by connecting them with valuable apprenticeship opportunities that pave the way for fulfilling and successful careers. We believe in the transformative power of hands-on experience and mentorship, and we are dedicated to bridging the gap between aspiring professionals and leading organizations across various industries. Our mission is to empower Africans by creating accessible local opportunities for personal and economic growth.</p>
            </div>
        </div>
    )
}
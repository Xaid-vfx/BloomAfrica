import Image from "next/image"
import Girl from "../../assets/images/SmilingWoman.png"

export default function Beliefs() {
    return (
        <div className="bg-[#171c1f] text-white lg:flex w-full h-fit">
            <div className="bg-[#897DD3] flex justify-center py-8 lg:py-14 lg:w-[45%]">
                <Image src={Girl} alt="girl" width={350} height={100} className="hidden lg:block" />
                <Image src={Girl} alt="girl" width={300} height={100} className="lg:hidden" />
            </div>
            <div className="lg:w-[55%] py-14 text-justify flex flex-col gap-6 px-4 lg:px-20 justify-center items-center">
                <h1 className="text-2xl lg:text-4xl font-semibold">Our Mission</h1>
                <p className="text-sm leading-7">At Prentis, our mission is to empower Africans by creating accessible local opportunities for personal and economic growth. We envision an Africa where the informal economy, alternative education, and non-traditional career paths are democratized, becoming vibrant and sustainable engines of growth.
                    <br /><br />
                    We believe that harnessing Africa's informal economy can entirely reshape the global narrative. Our platform serves as a catalyst for change, enabling users to upskill themselves, grow their businesses, and connect with a world of employment opportunities.</p>
            </div>
        </div>
    )
}
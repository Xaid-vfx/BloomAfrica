import BeliefCard from "./BeliefCard";
import Mission from "../../assets/images/Mission.png"
import Vision from "../../assets/images/Vision.png"
import Value from "../../assets/images/Value.png"

export default function Beliefs() {
    return (
        <div className="bg-[#171c1f] text-white py-20 lg:h-[100vh]">
            <p className="text-center text-xl lg:text-4xl lg:font-semibold">We are driven by <br className="md:hidden" />our beliefs</p>

            <div className="px-6 flex flex-col my-10 lg:flex-row lg:mt-20 lg:mx-16">
                <BeliefCard image={Mission} name="Mission" para="Our mission is to empower Africans by creating accessible local opportunities for personal and economic growth." />
                <BeliefCard image={Vision} name="Vision" para="Our vision is to become the global leader in providing innovative education solutions that empower informal workers and MSME owners in emerging economies to unlock their full potential. " />
                <BeliefCard image={Value} name="Value" para="We believe in creating opportunities for professionals from all backgrounds. Inclusivity is not just a goal; it's a fundamental principle that guides our platform." />
            </div>
        </div>
    )
}
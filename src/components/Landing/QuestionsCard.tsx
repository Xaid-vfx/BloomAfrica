import { useState } from "react"
import arrow from '../../assets/images/Arrow.png'
import Image from "next/image"

type Props = {
    id: Number;
    question: string;
    answer: string;
}

export default function QuestionsCard(props: Props) {

    const [show, setshow] = useState(false)

    function displayAnswer() {
        const object = document.getElementById(`${props.id}`)
        const arrowobject = document.getElementById(`arrow${props.id}`)
        if (object?.classList.contains('hidden')) {
            object?.classList.add('block')
            object?.classList.remove('hidden')
            arrowobject?.classList.add('rotate-180')
        }
        else {
            object?.classList.add('hidden')
            object?.classList.remove('block')
            arrowobject?.classList.remove('rotate-180')
        }
    }

    return (
        <div className="cursor-pointer rounded-2xl bg-white py-8 px-6 my-4 lg:py-10 lg:px-10" onClick={() => { displayAnswer() }}>
            <div className="flex justify-between items-center">
                <p className="text-sm w-2/3 leading-6 lg:text-lg font-medium">
                    How does Prentis integrate my current job with personalized learning?
                </p>
                <Image src={arrow} alt="" width={25} id={`arrow${props.id}`} className="transition-all" />
            </div>
            <p id={`${props.id}`} className="text-sm mt-4 font-light text-[#656262] lg:w-4/5 tracking-wide hidden transition-all">
                Prentis seamlessly integrates your current job with personalized learning by analyzing the details you provide about your industry, role, and location.
            </p>
        </div>
    )
}
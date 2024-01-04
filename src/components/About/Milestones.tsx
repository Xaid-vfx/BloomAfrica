'use client'

import { useEffect, useState } from "react";

export default function Milestones() {

    const [year, setyear] = useState(2023);
    const [focus, setfocus] = useState(2023);

    const setYearValue = (value: number) => {
        setyear(value)
        setfocus(value)
        console.log(year);
    }

    return (
        <div className="my-20 flex flex-col-reverse lg:flex-row-reverse items-center gap-20 lg:justify-between text-white">

            {year == 2023 ? <p className="text-xl font-light lg:font-extralight lg:w-2/3 lg:mt-5 lg:text-2xl">
                <ul style={{ listStyleType: 'circle' }}>
                    <li>Identify a problem or opportunity in the market.</li>
                    <li>Assemble a team with the necessary skills and experience.</li>
                    <li>Validate the idea through market research and user interviews.</li>
                </ul>
            </p> : ""}

            {year == 2024 ? <p className="text-xl font-light lg:font-extralight lg:w-2/3 lg:mt-5 lg:text-2xl">
                <ul style={{ listStyleType: 'circle' }}>
                    <li>Define product requirements and specifications.</li>
                    <li>Develop a minimum viable product (MVP) that addresses the core problem.</li>
                    <li>Conduct thorough testing to ensure the product functions correctly and meets user needs.</li>
                </ul>
            </p> : ""}

            {year == 2025 ? <p className="text-xl font-light lg:font-extralight lg:w-2/3 lg:mt-5 lg:text-2xl"><ul style={{ listStyleType: 'circle' }}>
                <li>Define product requirements and specifications.</li>
                <li>Develop a minimum viable product (MVP) that addresses the core problem.</li>
                <li>Conduct thorough testing to ensure the product functions correctly and meets user needs.</li>
            </ul> </p> : ""}

            {year == 2026 ? <p className="text-xl font-light lg:font-extralight lg:w-2/3 lg:mt-5 lg:text-2xl">
                <ul style={{ listStyleType: 'circle' }}>
                    <li>Establish partnerships with universities and educators to enhance the quality of educational programs.</li>
                    <li>Collaborate with industry experts to gain valuable insights and guidance.</li>
                </ul></p> : ""}

            {year == 2027 ? <p className="text-xl font-light lg:font-extralight lg:w-2/3 lg:mt-5 lg:text-2xl">

                <ul style={{ listStyleType: 'circle' }}>
                    <li>Launch the MVP to a limited audience for feedback and refinement.</li>
                    <li>Expand marketing efforts to reach a wider target market.</li>
                    <li>Acquire and engage customers to build a loyal user base.</li>
                </ul>
            </p> : ""}

            {year == 2028 ? <p className="text-xl text-center font-light lg:font-extralight lg:w-2/3 lg:mt-5 lg:text-2xl">2028 Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa dolorum officia sunt eveniet, quaerat repellat ea, rerum magnam, nemo saepe porro vero corporis vel tenetur earum explicabo esse voluptates excepturi? </p> : ""}

            <div className="lg:flex lg:mt-10 lg:flex-col lg:text-sm gap-4  text-xs grid grid-cols-3">
                <div
                    className={` lg:px-8 lg:py-3 cursor-pointer px-4 py-2 rounded ${focus == 2023 ? "border font-bold" : ""}`}
                    onClick={(e) => { setYearValue(2023) }}>Ideation and Team Formation</div>

                <div
                    className={` lg:px-8 lg:py-3  cursor-pointer px-4 py-2 rounded ${focus == 2024 ? "border font-bold" : ""}`}
                    onClick={(e) => { setYearValue(2024) }}>Product Development and Testing</div>

                <div
                    className={` lg:px-8 lg:py-3  cursor-pointer px-4 py-2 rounded ${focus == 2025 ? "border font-bold" : ""}`}
                    onClick={(e) => { setYearValue(2025) }}>MVP Soft launch</div>

                <div
                    className={` lg:px-8 lg:py-3  cursor-pointer px-4 py-2 rounded ${focus == 2026 ? "border font-bold" : ""}`}
                    onClick={(e) => { setYearValue(2026) }}>Partnerships and Collaborations</div>

                <div
                    className={` lg:px-8 lg:py-3  cursor-pointer px-4 py-2 rounded ${focus == 2027 ? "border font-bold" : ""}`}
                    onClick={(e) => { setYearValue(2027) }}>Market Launch and Customer Acquisition</div>

                <div
                    className={` lg:px-8 lg:py-3  cursor-pointer px-4 py-2 rounded ${focus == 2028 ? "border font-bold" : ""}`}
                    onClick={(e) => { setYearValue(2028) }}>Growth and Expansion</div>
            </div>
        </div>
    );
}
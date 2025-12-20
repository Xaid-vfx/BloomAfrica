'use client'
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CarouselSpacing } from "./CenterMode";

export default function Testimonials() {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    return (
        <div className="gradient2">
            <div className="w-full py-20 flex flex-col justify-center items-center overflow-hidden ms-auto me-auto max-w-[1600px]">
                <h1 className="text-center text-2xl lg:text-3xl font-semibold text-grey-900 flex justify-center pb-4 w-[90%] lg:w-[60%]">
                    What Our Fellows Say
                </h1>
                <p className="text-center text-grey-600 pb-12 max-w-xl">
                    Hear from alumni who transformed their careers through our fellowship program
                </p>
                <CarouselSpacing />
            </div>
        </div>
    )
}

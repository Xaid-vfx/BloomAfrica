'use client'
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CarouselSpacing } from "./CenterMode";

export default function Testimonials() {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    return (
        <div className="gradient2 ">
            <div className=" w-full py-20 flex flex-col justify-center items-center overflow-hidden ms-auto me-auto max-w-[1600px] ">
            <h1 className="text-center text-xl lg:text-2xl font-semibold flex justify-center pb-8 w-[90%] lg:w-[60%]">
                In Your Own Words . . .
            </h1>
            <CarouselSpacing />
            </div>
        </div>
        
    )
}

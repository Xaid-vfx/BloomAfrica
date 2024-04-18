'use client'
import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CarouselSpacing } from "./CenterMode";

export default function Testimonials() {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    return (
        <div className="w-full py-20 gradient2 flex flex-col justify-center items-center overflow-hidden">
            <h1 className="text-center text-xl lg:text-2xl font-semibold flex justify-center pb-14">
                <p className="w-[90%] lg:w-[60%]">
                    Discover how Bloom has transformed the careers and lives of
                    individuals just like you.
                </p>
            </h1>
            <CarouselSpacing />
        </div>
    )
}

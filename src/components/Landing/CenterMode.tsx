import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"


export function CarouselSpacing() {
    const reviews = [
        "If properly managed, this initiative will have our universities decongested. \
        Also, it would revolutionize our youths to combine both formal education and \
        technical education which will make them a force to be reckoned with.",

        "The apprenticeship system remains the most efficient local mentorship and \
        business development system in Nigeria. Many people became rich through the \
        system, but that doesn't mean there are no grey areas. Some Ogas are toxic \
        while many are super.",

        "The Igbo apprenticeship system is working for a reason. If we analyze these \
        systems, we can create a system for skills development and empowerment that \
        rivals these systems.",

        "Wow! I love this. I've been waiting for it in Africa. Germany has been \
        operating this for many years."
    ]

    return (
        <Carousel className="w-[95%] lg:w-[90%] lg:mx-20">
            <CarouselContent className="-ml-1 flex">
                {reviews.map((review, index) => (
                    <CarouselItem 
                        key={index} 
                        className="pl-1 mx-4 cursor-pointer md:basis-1/2 lg:basis-[40%]"
                    >
                        <Card className="h-full border-0">
                            <CardContent 
                                className="flex h-full flex-col justify-center px-5 py-6 
                                         text-xs leading-5 text-[#515B6F] lg:px-10 lg:py-12"
                            >
                                <p>&quot;{review}&quot;</p>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
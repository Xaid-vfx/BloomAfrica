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
    const testimonials = [
        {
            quote: "The fellowship gave me real production experience that no bootcamp could match. I shipped features to 50,000 users and got hired by the same startup after graduating.",
            author: "Chioma O.",
            role: "Software Engineer",
            program: "Full-Stack Fellowship, 2024"
        },
        {
            quote: "I learned more in 6 months building live products than I did in 2 years of side projects. The structured curriculum plus real work was the perfect combination.",
            author: "Tunde A.",
            role: "Mobile Developer",
            program: "Mobile Engineering Fellowship, 2023"
        },
        {
            quote: "Working alongside senior engineers taught me professional workflows and best practices I couldn't learn anywhere else. The mentorship was invaluable.",
            author: "Amara N.",
            role: "Backend Engineer",
            program: "Backend Fellowship, 2024"
        },
        {
            quote: "I went from self-taught developer to shipping production code in a matter of months. Having real projects in my portfolio made job interviews so much easier.",
            author: "Ibrahim K.",
            role: "Full-Stack Developer",
            program: "Software Engineering Fellowship, 2023"
        },
        {
            quote: "The fellowship didn't just teach me how to code—it taught me how to think like an engineer. I'm now confident tackling complex problems in production.",
            author: "Ngozi E.",
            role: "Data Engineer",
            program: "Data Engineering Fellowship, 2024"
        }
    ]

    return (
        <Carousel className="w-[95%] lg:w-[90%] lg:mx-20">
            <CarouselContent className="-ml-1 flex">
                {testimonials.map((testimonial, index) => (
                    <CarouselItem
                        key={index}
                        className="pl-1 mx-4 cursor-pointer md:basis-1/2 lg:basis-[40%]"
                    >
                        <Card className="h-full border-grey-200">
                            <CardContent
                                className="flex h-full flex-col justify-between px-6 py-8
                                         text-base leading-relaxed lg:px-10 lg:py-12"
                            >
                                <p className="text-grey-700 mb-6">&quot;{testimonial.quote}&quot;</p>
                                <div className="border-t border-grey-200 pt-4">
                                    <p className="font-semibold text-grey-900">{testimonial.author}</p>
                                    <p className="text-sm text-grey-600 mt-1">{testimonial.role}</p>
                                    <p className="text-xs text-grey-500 mt-1">{testimonial.program}</p>
                                </div>
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

import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import User from '../../assets/images/user.jpg'

export function CarouselSpacing() {
    const content = [
        "If properly managed, this initiative will have our universities decongested. Also, it would revolutionise our youths to combine both formal education and technical education which will make them a force to be reckoned with.",
        "The apprenticeship system remains the most efficient local mentorship, business development system in nigeria. Many people became rich through the system, but that doesnt mean theyre no grey areas. Some oga are toxic while many are super.",
        "The igbo apprenticeship system system is all working for a reason. If we analyse these systems, we can create a system for skills development and empowerment that rivals these systems.",
        "Wow! I love this. I’ve been waiting for it in africa. Germany has been operating this for many years."
    ]
    return (
        <Carousel className="lg:w-[90%] lg:mx-20 w-[95%]">
            <CarouselContent className="-ml-1 flex">
                {content.map((_, index) => (
                    <CarouselItem key={index} className="pl-1 mx-4 md:basis-1/2 lg:basis-[40%] cursor-pointer">
                        <div className="h-full">
                            <Card className="border-0 h-full">
                                <CardContent className="flex border-0 h-full flex-col text-xs leading-5 justify-center px-5 lg:px-10 py-6 lg:py-12 text-[#515B6F]">
                                    <p className="">
                                        &quot;{_}&quot;
                                    </p>
                                    {/* <div className="flex items-center lg:mt-4 mt-0 gap-4">
                                        <Image src={User} alt="user" width={40} />
                                         <div>
                                            <h1 className="lg:text-lg text-sm text-[#4A2C84] font-medium">Software Engineer</h1>
                                            <p>XXXX XXXX</p>
                                        </div>
                                    </div> */}
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
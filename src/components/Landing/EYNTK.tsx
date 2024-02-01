'use client'
import QuestionsCard from "./QuestionsCard";

export default function EYNTK() {
    return (
        <div className="py-14 lg:py-16 bg-[#F0F0FB]">
            <h1 className="text-xl lg:text-3xl font-semibold text-center">Everything You need to know</h1>
            <p className="mt-4 mb-8 lg:my-8 text-center text-sm px-20">
                Here are the most questions people always ask about.
            </p>
            <div className="mx-4 lg:mx-16">
                <QuestionsCard id={1} question="" answer="" />
                <QuestionsCard id={2} question="" answer="" />
                <QuestionsCard id={3} question="" answer="" />
                <QuestionsCard id={4} question="" answer="" />
            </div>
        </div>
    )
}
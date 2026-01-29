'use client'
import QuestionsCard from "./QuestionsCard";

export default function EYNTK() {
    const faqs = [
        {
            id: 1,
            question: "What qualifications can I earn through Prentis apprenticeships in Nigeria?",
            answer: "Through Prentis, you can earn nationally recognized qualifications including Higher National Diploma (HND), National Diploma (ND), and NABTEB (National Business and Technical Examinations Board) certifications. These credentials are valued by employers across Nigeria and West Africa, giving you the official recognition you need for employment or starting your own business."
        },
        {
            id: 2,
            question: "Where are Prentis programs available in Nigeria?",
            answer: "Prentis apprenticeship programs are available across Nigeria, with strong presence in major cities like Lagos, Abuja, Port Harcourt, Kano, and Ibadan. We're expanding to cover all 36 states, connecting apprentices with master artisans and companies throughout the country. Whether you're in the North, South, East, or West, there's a Prentis program near you."
        },
        {
            id: 3,
            question: "How is Prentis different from traditional polytechnic education?",
            answer: "Unlike traditional polytechnic education that focuses primarily on classroom theory, Prentis emphasizes hands-on, practical training within real businesses. You learn directly from master artisans and industry professionals while still earning HND, ND, or NABTEB qualifications. This means you graduate with both the official credentials and the real-world experience employers are looking for."
        },
        {
            id: 4,
            question: "How do I become an accredited trainer on Prentis?",
            answer: "To become an accredited trainer on Prentis, you need demonstrated expertise in your trade and the ability to offer structured training programs. Master artisans, companies, and TVET institutions can apply to join our platform. We partner with you to align your programs with HND, ND, and NABTEB certification requirements, helping you become an officially recognized vocational training provider in Nigeria."
        }
    ];

    return (
        <div className="py-14 lg:py-16 bg-[#F0F0FB]">
            <h1 className="text-xl lg:text-3xl font-semibold text-center">Everything You Need to Know</h1>
            <p className="mt-4 mb-8 lg:my-8 text-center text-sm px-20">
                Here are the most common questions about apprenticeships in Nigeria.
            </p>
            <div className="mx-4 lg:mx-16">
                {faqs.map((faq) => (
                    <QuestionsCard key={faq.id} id={faq.id} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>
    )
}
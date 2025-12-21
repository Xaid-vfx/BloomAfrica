import Footer from "@/components/Footer/Footer";
import GetStarted from "@/components/GetStartedBanner/GetStarted";
import PricingCard from "@/components/Pricing/PricingCard";
import PricingHero from "@/components/Pricing/PricingHero";
import Navbar from "@/components/navbar/Navbar";
import { Metadata } from "next";
import { useState } from "react";

export const metadata: Metadata = {
    title: 'Pricing | Prentis'
}

export default function Pricing() {
    return (
        <div>
            <Navbar />
            <PricingHero />
            <div className="px-4 py-10"><GetStarted /></div>
            <Footer />
        </div>
    )
}
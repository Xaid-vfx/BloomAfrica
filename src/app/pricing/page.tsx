'use client'
import Footer from "@/components/Footer/Footer";
import GetStarted from "@/components/GetStartedBanner/GetStarted";
import PricingCard from "@/components/Pricing/PricingCard";
import Navbar from "@/components/navbar/Navbar";
import { Metadata } from "next";
import { useState } from "react";

export default function Pricing() {

    const [activeTab, setActiveTab] = useState(1)


    return (
        <div>
            <Navbar />
            <div className="py-10 px-4 text-center">
                <div className="lg:flex lg:items-center lg:flex-col">
                    <p className="text-sm lg:text-base lg:font-medium lg:text-[#4A2C84]">Pricing</p>
                    <h1 className="mt-6 mb-10 text-xl font-semibold lg:text-3xl">
                        Pricing offers and their associated features for <br className="hidden lg:block" /> Bloom
                    </h1>

                    <div className="flex rounded-3xl justify-center lg:mt-14 box_shadow p-1">
                        <button className={`text-sm px-6 py-2 rounded-3xl lg:font-medium lg:px-10 ${activeTab == 1 ? "text-white bg-[#4A2C84]" : ""}`} onClick={() => { setActiveTab(1) }}>Monthly</button>
                        <button className={`text-sm px-6 py-2 rounded-3xl lg:font-medium lg:px-10 ${activeTab == 2 ? "text-white bg-[#4A2C84]" : ""}`} onClick={() => { setActiveTab(2) }}>Yearly</button>
                    </div>
                </div>


                {
                    (activeTab == 1) ?
                        <div className="mt-10 lg:flex lg:justify-between lg:px-10">
                            <PricingCard color="#897DD3" name="Basic" description="Free Basic Plan" />
                            <PricingCard color="#1B2124" name="Basic" description="Free Basic Plan" />
                            <PricingCard color="#84BBCF" name="Basic" description="Free Basic Plan" />
                        </div> : ""
                }

                {
                    (activeTab == 2) ? <div className="mt-10 lg:flex lg:justify-between lg:px-10">
                        <PricingCard color="#897DD3" name="Basic" description="Free Basic Plan" />
                        <PricingCard color="#1B2124" name="Basic" description="Free Basic Plan" />
                        <PricingCard color="#84BBCF" name="Basic" description="Free Basic Plan" />
                    </div> : ""
                }

                {
                    (activeTab == 3) ? <div></div> : ""
                }

            </div>

            <div className="px-4 py-10"><GetStarted /></div>
            <Footer />
        </div>
    )
}
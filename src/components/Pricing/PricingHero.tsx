import { useState } from "react"
import PricingCard from "./PricingCard"

export default function PricingHero() {

    const [activeTab, setActiveTab] = useState(1)

    return (
        <div>
            <div className="py-10 px-4 text-center">
                <div className="flex items-center flex-col">
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
        </div>
    )
}
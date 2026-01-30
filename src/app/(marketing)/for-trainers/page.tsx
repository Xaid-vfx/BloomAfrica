import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import { Metadata } from 'next'
import TrainerHero from '@/components/Landing/TrainerHero'
import GetStartedLight from '@/components/GetStartedBanner/GetStartedLight'
import TrainerTypesComparison from '@/components/Landing/TrainerTypesComparison'
import HowItWorksTrainers from '@/components/Landing/HowItWorksTrainers'
import AccreditationSection from '@/components/Landing/AccreditationSection'
import TrainerPricingSection from '@/components/Landing/TrainerPricingSection'

export const metadata: Metadata = {
  title: 'Become a Trainer | Offer HND, ND & B.Tech Certified Programs',
  description: 'Become an accredited training provider on Prentis. Offer HND, ND, B.Tech, and NABTEB-certified vocational programs as a master artisan or TVET institution. Train apprentices across Nigeria and build your professional brand.',
}

export default function ForTrainersPage() {
  return (
    <main className="flex flex-col overflow-x-hidden w-full">
      <Navbar color="light" />

      <div className="bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] overflow-x-hidden w-full">
        <TrainerHero />

        {/* Who Can Train + Benefits (Merged Section) */}
        <TrainerTypesComparison />

        {/* Accreditation Section */}
        <AccreditationSection />

        {/* How It Works Section */}
        <HowItWorksTrainers />
      </div>

      {/* Pricing Section */}
      <TrainerPricingSection />

      <div className="bg-gradient-to-br from-[#0A1F44] to-[#0F2B54]">
        {/* Final CTA */}
        <GetStartedLight
          heading="Ready to Get Started?"
          subtitle="Join Prentis and start training apprentices today."
          ctaText="Create Your Account"
          ctaLink="/signup?type=recruiter"
        />
      </div>

      <Footer />
    </main>
  )
}

import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Navbar/Navbar'
import { Metadata } from 'next'
import TrainerHero from '@/components/Landing/TrainerHero'
import GetStartedLight from '@/components/GetStartedBanner/GetStartedLight'
import TrainerTypesComparison from '@/components/Landing/TrainerTypesComparison'
import HowItWorksTrainers from '@/components/Landing/HowItWorksTrainers'
import AccreditationSection from '@/components/Landing/AccreditationSection'

export const metadata: Metadata = {
  title: 'Become a Trainer | Prentis - Share Your Expertise, Earn Income',
  description: 'Join Prentis as a Master Artisan or Company trainer. Build your professional brand, earn from accredited training programs, and shape the next generation of skilled professionals across Africa.',
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

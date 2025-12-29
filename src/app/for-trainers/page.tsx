import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import { Metadata } from 'next'
import TrainerHero from '@/components/Landing/TrainerHero'
import GetStarted from '@/components/GetStartedBanner/GetStarted'
import TrackCard from '@/components/Landing/TrackCard'
import BenefitCard from '@/components/Landing/BenefitCard'
import HowItWorksTrainers from '@/components/Landing/HowItWorksTrainers'
import BottomLineComparison from '@/components/Landing/BottomLineComparison'
import StatsSection from '@/components/Landing/StatsSection'
import { Hammer, Building2, TrendingUp, Award, Users, Target, ShieldCheck, Wallet } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Become a Trainer | Prentis - Share Your Expertise, Earn Income',
  description: 'Join Prentis as a Master Artisan or Company trainer. Build your professional brand, earn from accredited training programs, and shape the next generation of skilled professionals across Africa.',
}

export default function ForTrainersPage() {
  return (
    <main className="flex flex-col">
      <div className='bg-white'>
        <Navbar color="light" />
        <TrainerHero />
      </div>

      {/* Who Can Train Section */}
      <div className="py-20 px-6 lg:py-28 lg:px-12 bg-gradient-to-br from-[#0A1F44] to-[#0F2B54] relative overflow-hidden">
        {/* Decorative Blobs */}
        <svg viewBox="0 0 500 500" className="absolute top-0 left-0 w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] opacity-8 pointer-events-none" style={{ transform: 'translate(-25%, -25%)' }}>
          <path fill="#14B8A6" d="M432.7,219.4c-15.4,59.7-61.3,105.6-121,121c-59.7,15.4-121.9-5.6-164.1-55.3c-42.2-49.7-56.6-117.7-37.7-179.2C129,44.4,175,2.5,231.2,0.2c56.2-2.3,114.8,35.6,144.8,93.8C406,152.2,448.1,159.7,432.7,219.4z"/>
        </svg>

        <div className="max-w-[1500px] mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
              Who Can Become a Trainer on Prentis?
            </h2>
            <p className="text-lg text-white/70 lg:max-w-3xl mx-auto">
              Whether you're a seasoned craftsperson or a growing business, Prentis provides the platform to share your expertise and build the next generation.
            </p>
          </div>

          {/* Track Cards */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <TrackCard
              icon={<Hammer size={48} />}
              title="Master Artisans (Ogas)"
              description="Independent experts, workshop owners, and craft masters who have honed their skills through years of real-world experience. Whether you run a tailoring shop, mechanic workshop, welding studio, or any other craft-based business, share your expertise and earn."
              result={[
                "Perfect for: Workshop owners, craft masters, independent professionals",
                "Trades: Tailoring, automotive repair, welding, carpentry, plumbing, electrical work, and more"
              ]}
              ctaLink="/signup?type=recruiter"
              ctaText="Get Started"
              color="#14B8A6"
            />
            <TrackCard
              icon={<Building2 size={48} />}
              title="Companies & Businesses"
              description="Startups to large corporations across all professional sectors looking to build a talent pipeline. Train apprentices to your exact standards and hire the best performers directly into your team."
              result={[
                "Perfect for: Tech startups, manufacturing firms, service companies, established enterprises",
                "Industries: Technology, marketing, logistics, engineering, hospitality, and more"
              ]}
              ctaLink="/signup?type=recruiter"
              ctaText="Get Started"
              color="#14B8A6"
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 px-6 lg:py-28 lg:px-12 bg-[#0A1F44] relative overflow-hidden">
        {/* Decorative Blobs */}
        <svg viewBox="0 0 400 400" className="absolute bottom-0 right-0 w-[250px] h-[250px] md:w-[350px] md:h-[350px] opacity-10 pointer-events-none" style={{ transform: 'translate(30%, 30%)' }}>
          <path fill="#2DD4BF" d="M340.5,175.5c-12.3,47.8-49,84.5-96.8,96.8c-47.8,12.3-97.5-4.5-131.3-44.2c-33.8-39.8-45.3-94.2-30.2-143.4c15.1-49.2,51.2-84.5,94.2-86.2c43-1.8,91.8,28.5,115.8,75C316.2,121,352.8,127.7,340.5,175.5z"/>
        </svg>

        <div className="max-w-[1500px] mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold text-white mb-4">
              Why Train on Prentis?
            </h2>
            <p className="text-lg text-white/70 lg:max-w-3xl mx-auto">
              Unlock unique advantages for your business or craft
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={<TrendingUp size={32} />}
              title="Command Higher Fees"
              description="Accredited qualifications mean prestige. Apprentices know they're learning from certified professionals, allowing you to charge premium rates for quality training."
            />
            <BenefitCard
              icon={<Award size={32} />}
              title="Professional Branding"
              description="Get a verified platform presence that showcases your expertise. Build your reputation as a master trainer and attract more serious learners to your workshop."
            />
            <BenefitCard
              icon={<Users size={32} />}
              title="Vetted Talent Pipeline"
              description="Access ambitious, high-grit individuals who have been pre-screened by our platform. No more wading through unqualified resumes—get learners ready to prove themselves."
            />
            <BenefitCard
              icon={<Target size={32} />}
              title="Train to Your Own Standards"
              description="Shape apprentices from day one according to your company's processes, culture, and technical requirements. Build team members who already understand your business."
            />
            <BenefitCard
              icon={<ShieldCheck size={32} />}
              title="Reduced Hiring Risk"
              description="Real-world trial before hiring. Evaluate apprentices over months of actual work, not just a few interview rounds. Hire with confidence."
            />
            <BenefitCard
              icon={<Wallet size={32} />}
              title="Monetization Made Simple"
              description="Set your enrollment fees, get paid directly, and manage all learners through one easy dashboard. We handle the platform, you focus on teaching."
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorksTrainers />

      {/* Bottom Line Comparison */}
      <BottomLineComparison />

      {/* Stats Section */}
      <StatsSection />

      {/* Final CTA */}
      <div className="px-4 bg-white">
        <GetStarted
          heading="Ready to Start Training?"
          subtitle="Join Prentis as a trainer and turn your expertise into income and impact. Build your legacy while shaping the future of skilled work in Africa."
          ctaText="Become a Trainer Now"
          ctaLink="/signup?type=recruiter"
        />
      </div>

      <Footer />
    </main>
  )
}

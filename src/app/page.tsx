import Footer from '@/components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import Hero from '@/components/Landing/Hero/Hero'
import { Metadata } from 'next'
import HowItWorks from '@/components/Landing/HowItWorks'
import GetStarted from '@/components/GetStartedBanner/GetStarted'
import FeaturedPrograms from '@/components/Landing/FeaturedPrograms'
import TechTracks from '@/components/Landing/TechTracks'
import ForFellows from '@/components/Landing/ForFellows'
import Testimonials from '@/components/Landing/Testimonials'
import FacebookBrowserRedirect from '@/components/FacebookBrowserRedirect'

export const metadata: Metadata = {
  title: 'Bloom Africa - Technical Fellowship Program'
}

export default function Home() {
  return (
    <main className="flex flex-col">
      <FacebookBrowserRedirect />
      <div className='bg-white'>
        <Navbar color="white" />
        <Hero />
      </div>
      <HowItWorks />
      <FeaturedPrograms />
      <TechTracks />
      <ForFellows />
      <Testimonials />
      <div className="px-4 bg-white"><GetStarted /></div>
      <Footer />
    </main>
  )
}
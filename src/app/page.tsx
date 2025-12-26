import Footer from '@/components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import Hero from '@/components/Landing/Hero/Hero'
import { Metadata } from 'next'
import GetStarted from '@/components/GetStartedBanner/GetStarted'
import Testimonials from '@/components/Landing/Testimonials'
import FacebookBrowserRedirect from '@/components/FacebookBrowserRedirect'
import ChooseCareerPath from '@/components/Landing/ChooseCareerPath'
import CertificationSection from '@/components/Landing/CertificationSection'
import IndustriesMaster from '@/components/Landing/IndustriesMaster'
import WhyChoosePrentis from '@/components/Landing/WhyChoosePrentis'

export const metadata: Metadata = {
  title: 'Prentis - The Home of Real Apprenticeships'
}

export default function Home() {
  return (
    <main className="flex flex-col">
      <FacebookBrowserRedirect />
      <div className='bg-white'>
        <Navbar color="white" />
        <Hero />
      </div>
      <ChooseCareerPath />
      <CertificationSection />
      <IndustriesMaster />
      <WhyChoosePrentis />
      <Testimonials />
      <div className="px-4 bg-white"><GetStarted /></div>
      <Footer />
    </main>
  )
}
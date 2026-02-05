import Footer from '@/components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'
import Hero from '@/components/Landing/Hero/Hero'
import { Metadata } from 'next'
import FacebookBrowserRedirect from '@/components/FacebookBrowserRedirect'
import ChooseCareerPath from '@/components/Landing/ChooseCareerPath'
import CertificationSection from '@/components/Landing/CertificationSection'
import IndustriesMaster from '@/components/Landing/IndustriesMaster'
import WhyChoosePrentis from '@/components/Landing/WhyChoosePrentis'

export const metadata: Metadata = {
  title: 'Prentis - HND, ND & B.Tech Apprenticeship Programs Nigeria | Learn a Trade',
  description: 'Find HND, ND, B.Tech, and NABTEB-certified apprenticeship programs in Lagos, Abuja, and across Nigeria. Learn a trade with master artisans and top companies through hands-on vocational training and skills acquisition programs.',
}

export default function Home() {
  return (
    <main className="flex flex-col">
      <FacebookBrowserRedirect />
      <div className='bg-white relative h-screen min-h-[600px]'>
        <div className="absolute top-0 left-0 right-0 z-20">
          <Navbar color="light" />
        </div>
        <Hero />
      </div>
      <ChooseCareerPath />
      <IndustriesMaster />
      <CertificationSection />
      <WhyChoosePrentis />
      <Footer />
    </main>
  )
}
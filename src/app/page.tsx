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
  title: 'Prentis - HND & ND Apprenticeship Programs Nigeria | Learn a Trade',
  description: 'Find HND, ND, and NABTEB-certified apprenticeship programs in Lagos, Abuja, and across Nigeria. Learn a trade with master artisans and top companies through hands-on vocational training and skills acquisition programs.',
}

export default function Home() {
  return (
    <main className="flex flex-col">
      <FacebookBrowserRedirect />
      <div className='bg-white'>
        <Navbar color="light" />
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
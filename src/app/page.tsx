import Footer from '@/components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import Hero from '@/components/Landing/Hero/Hero'
import { Metadata } from 'next'
import Demo from '@/components/Demo/Demo'
import HowItWorks from '@/components/Landing/HowItWorks'
import HowItWorks2 from '@/components/Landing/HowItWorks2'
import GetStarted from '@/components/GetStartedBanner/GetStarted'
import MoreReasons from '@/components/Landing/MoreReasons'
import EYNTK from '@/components/Landing/EYNTK'

export const metadata: Metadata = {
  title: 'Bloom'
}

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className='gradient'>
        <Navbar />
        <Hero />
      </div>
      <HowItWorks />
      <HowItWorks2 />
      <MoreReasons />
      <div className="px-4 pb-16 bg-[#ffffff]"><GetStarted /></div>
      <Footer />
    </main>
  )
}
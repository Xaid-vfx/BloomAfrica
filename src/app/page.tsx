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
import FeaturedJobs from '@/components/Landing/FeaturedJobs'
import ExploreCategory from '@/components/Landing/ExploreCategory'
import ForSeekersRecruiters from '@/components/Landing/ForSeekersRecruiters'
import Testimonials from '@/components/Landing/Testimonials'
import Banner from '@/components/Landing/Banner'

export const metadata: Metadata = {
  title: 'Bloom'
}

export default function Home() {
  return (
    <main className="flex flex-col ">
      <div className='hidden lg:block gradient'>
        <Navbar />
        <Hero />
        <Banner />
      </div>
      <div className='lg:hidden gradientmobile'>
        <Navbar />
        <Hero />
        <Banner />
      </div>
      <HowItWorks />
      <FeaturedJobs />
      <ExploreCategory />
      <ForSeekersRecruiters />
      <Testimonials />
      {/* <MoreReasons /> */}
      <div className="px-4 bg-[#ffffff]"><GetStarted /></div>
      <Footer />
    </main>
  )
}
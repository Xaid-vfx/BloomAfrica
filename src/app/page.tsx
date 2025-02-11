'use client'

import { useEffect } from 'react'
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
  useEffect(() => {
    // Check if user is in Facebook's in-app browser
    const isFacebookBrowser = /FB_IAB|FBAN|FBAV/.test(navigator.userAgent);

    if (isFacebookBrowser) {
      const currentURL = window.location.href;

      // For iOS
      if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.location.href = `x-web-search://?${currentURL}`;
        // Fallback to Safari if x-web-search doesn't work
        setTimeout(() => {
          window.location.href = currentURL;
        }, 500);
      }
      // For Android
      else {
        window.location.href = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
      }
    }
  }, []);

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
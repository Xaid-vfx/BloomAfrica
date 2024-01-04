import Footer from '@/components/Footer/Footer'
import Navbar from '../components/navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import { Metadata } from 'next'
import Demo from '@/components/Demo/Demo'

export const metadata: Metadata = {
  title: 'Bloom'
}

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <Navbar />
      <Hero />
      <Demo />
      <Footer />
    </main>
  )
}

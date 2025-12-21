import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

import { Open_Sans, Roboto_Mono, Montserrat } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import FacebookPixel from '@/components/FacebookPixel'
const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-opensans'
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prentis - Connect with Top Ogas & Mentors',
  description: 'Prentis connects aspiring apprentices with top Ogas & mentors, offering hands-on learning, professional development, and career growth opportunities across Africa.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data for Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Prentis",
            "url": "https://www.prentis.ng",
            "logo": "https://www.prentis.ng/logo.jpeg"
          })
        }} />
      </head>
      <body className={`${montserrat.className} ${robotoMono.variable} font-sans ${inter.className}`}>
        {children}
        <Toaster />
        <GoogleAnalytics gaId="G-D068BXV1ZQ" />
        <FacebookPixel />
      </body>
    </html>
  )
}

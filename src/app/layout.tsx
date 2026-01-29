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
  metadataBase: new URL('https://www.prentis.ng'),
  title: {
    default: 'Prentis - HND & ND Apprenticeship Programs in Nigeria',
    template: '%s | Prentis Nigeria',
  },
  description: 'Earn HND, ND, and NABTEB qualifications through hands-on apprenticeship programs in Nigeria. Connect with master artisans and companies in Lagos, Abuja, and across all 36 states for vocational training and skills acquisition.',
  keywords: [
    'apprenticeship programs Nigeria',
    'HND programs Nigeria',
    'ND diploma Nigeria',
    'vocational training Nigeria',
    'vocational training Lagos',
    'vocational training Abuja',
    'learn a trade Nigeria',
    'skills acquisition Nigeria',
    'NABTEB certification',
    'become a trainer Nigeria',
    'accredited training provider',
    'vocational training institution',
    'TVET trainer Nigeria',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Prentis Nigeria',
    title: 'Prentis - HND & ND Apprenticeship Programs in Nigeria',
    description: 'Earn HND, ND, and NABTEB qualifications through hands-on apprenticeship programs. Connect with master artisans and companies across Nigeria.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prentis - Nigeria\'s Premier Apprenticeship Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prentis - HND & ND Apprenticeship Programs in Nigeria',
    description: 'Earn HND, ND, and NABTEB qualifications through hands-on apprenticeship programs in Nigeria.',
    images: ['/og-image.png'],
  },
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
            "@type": ["Organization", "EducationalOrganization"],
            "name": "Prentis",
            "url": "https://www.prentis.ng",
            "logo": "https://www.prentis.ng/logo.jpeg",
            "description": "Nigeria's premier apprenticeship platform offering HND, ND, and NABTEB-certified vocational training programs.",
            "areaServed": {
              "@type": "Country",
              "name": "Nigeria"
            },
            "sameAs": [
              "https://www.facebook.com/prentisng",
              "https://www.instagram.com/prentisng",
              "https://twitter.com/prentisng",
              "https://www.linkedin.com/company/prentisng"
            ]
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

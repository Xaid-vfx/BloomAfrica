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
  title: 'Bloom',
  description: 'Bloom is a platform that helps you find the perfect apprenticeship for you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} ${robotoMono.variable} font-sans ${inter.className}`}>{children}</body>
      <Toaster />
      <GoogleAnalytics gaId="G-D068BXV1ZQ" />
      <FacebookPixel />
    </html>
  )
}

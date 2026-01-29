import { Metadata } from 'next'
import AboutUsContent from './AboutUsContent'

export const metadata: Metadata = {
    title: 'About Us | HND & ND Apprenticeships in Nigeria',
    description: 'Discover why Prentis is Nigeria\'s leading apprenticeship platform. Earn HND, ND, and NABTEB qualifications through hands-on vocational training with vetted master artisans and companies across Lagos, Abuja, and all 36 states.',
}

export default function AboutUsPage() {
    return <AboutUsContent />
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/recruiter/', '/seeker/', '/admin/', '/signup/verify', '/signup/complete_profile', '/signup/complete_recruiter_profile'],
      },
    ],
    sitemap: 'https://www.prentis.ng/sitemap.xml',
  }
}

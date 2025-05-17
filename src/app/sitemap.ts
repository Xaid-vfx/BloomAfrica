import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://bloom.africa' // Replace with your actual domain

    // Public routes that should be indexed
    const routes = [
        '', // Homepage
        '/about',
        '/pricing',
        '/faqs',
        '/privacy-policy',
        '/terms-of-service',
        '/signup',
        '/signup/verify',
        '/all-trainings',
        '/certified',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
} 
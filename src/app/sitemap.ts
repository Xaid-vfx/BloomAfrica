import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.prentis.ng'

    // Define routes with their priorities
    const routeConfig: { path: string; priority: number }[] = [
        { path: '', priority: 1.0 }, // Homepage
        { path: '/for-trainers', priority: 0.9 },
        { path: '/all-trainings', priority: 0.9 },
        { path: '/how-it-works', priority: 0.8 },
        { path: '/about-us', priority: 0.8 },
        { path: '/about', priority: 0.7 },
        { path: '/pricing', priority: 0.7 },
        { path: '/faqs', priority: 0.7 },
        { path: '/privacy-policy', priority: 0.5 },
        { path: '/terms-of-service', priority: 0.5 },
        { path: '/signup', priority: 0.6 },
        { path: '/certified', priority: 0.7 },
    ]

    const routes = routeConfig.map(({ path, priority }) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority,
    }))

    return routes
} 
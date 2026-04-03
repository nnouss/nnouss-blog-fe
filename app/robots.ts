import { MetadataRoute } from 'next';
import { getPublicSiteUrl } from '@/lib/site-url';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const siteUrl = await getPublicSiteUrl();

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/write/', '/post/*/edit/'],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}

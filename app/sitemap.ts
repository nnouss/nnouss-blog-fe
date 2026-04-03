import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/apis/main';
import { getPublicSiteUrl } from '@/lib/site-url';

// ISR 설정: 1일마다 재생성 (86400초 = 24시간)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = await getPublicSiteUrl();

    // 정적 페이지들
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${siteUrl}/signin`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${siteUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // 동적 게시글 페이지들
    const postPages: MetadataRoute.Sitemap = [];

    try {
        // 모든 게시글을 한 번에 가져오기
        const posts = await getAllPosts();

        // 각 게시글을 사이트맵에 추가
        postPages.push(
            ...posts.map((post) => ({
                url: `${siteUrl}/post/${post.slug}`,
                lastModified: new Date(post.createdAt),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }))
        );
    } catch (error) {
        // API 오류 시 정적 페이지만 반환
        console.error('사이트맵 생성 중 오류:', error);
    }

    return [...staticPages, ...postPages];
}

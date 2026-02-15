import { getPost } from '@/lib/apis/post';
import { PostDetailHeader } from '@/components/post/post-detail-header';
import { PostDetailContent } from '@/components/post/post-detail-content';
import { PostDetailActions } from '@/components/post/post-detail-actions';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PostDetailPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// SEO를 위한 동적 메타데이터 생성
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return {
            title: '게시글을 찾을 수 없습니다',
            description: '요청하신 게시글을 찾을 수 없습니다.',
        };
    }

    // HTML 태그 제거 및 요약 생성
    const plainContent = post.content
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    const description =
        plainContent.length > 160 ? `${plainContent.slice(0, 160)}...` : plainContent;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.slas.kr';
    const url = `${siteUrl}/post/${slug}`;
    const imageUrl = post.thumbnail || `${siteUrl}/og-image.png`;

    return {
        title: post.title,
        description,
        keywords: post.tags.join(', '),
        authors: [{ name: post.author.nickname }],
        openGraph: {
            title: post.title,
            description,
            url,
            siteName: 'Slas.log',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            locale: 'ko_KR',
            type: 'article',
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            authors: [post.author.nickname],
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
    const { slug } = await params;

    const post = await getPost(slug);

    // 404 처리
    if (!post) {
        notFound();
    }

    return (
        <article className='space-y-8'>
            <PostDetailHeader post={post} />
            <PostDetailContent content={post.content} />
            <PostDetailActions authorId={post.author.id} id={post.id} slug={post.slug} />
        </article>
    );
}

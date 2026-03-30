'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPostDate } from '@/lib/utils';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { Post } from '@/lib/apis/main';
import type { PostType } from '@/lib/apis/write';

interface PostCardProps {
    post: Post;
    postType?: PostType;
}

const MAX_TAGS_TO_SHOW = 3;

/** 카드 외곽·썸네일·태그 배지 공통 모서리 둥글기 */
const POST_CARD_RADIUS_CLASS = 'rounded-[4px]';

function getCategoryTagClasses(postType: PostType) {
    // Badge 기본 스타일에 hover/focus 시 강조가 섞일 수 있어, 태그에서는 이를 고정/제거합니다.
    const base =
        `text-[10px] md:text-xs px-2 py-1 ${POST_CARD_RADIUS_CLASS} border-0 transition-none ` +
        'focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0';

    if (postType === 'dev') {
        return [
            base,
            // 배경은 연한 톤, 텍스트는 더 진한 톤(흰색 고정 금지)
            'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
        ].join(' ');
    }

    return [
        base,
        'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    ].join(' ');
}

function getCategoryCountClass(postType: PostType) {
    if (postType === 'dev') {
        return 'text-sky-700 dark:text-sky-200';
    }
    return 'text-rose-700 dark:text-rose-200';
}

export function PostCard({ post, postType }: PostCardProps) {
    const router = useRouter();
    const resolvedPostType: PostType = postType ?? post.type ?? 'dev';
    const tagClasses = getCategoryTagClasses(resolvedPostType);
    const tagCountClass = getCategoryCountClass(resolvedPostType);

    const handleClick = () => {
        router.push(`/post/${post.slug}`);
    };

    return (
        <Card
            className={`cursor-pointer border-0 shadow-none transition-colors p-3 h-full flex flex-col overflow-hidden ${POST_CARD_RADIUS_CLASS} bg-muted/35 hover:bg-muted/45 dark:bg-card dark:hover:bg-card`}
            onClick={handleClick}
        >
            <CardHeader className='p-0 flex flex-col gap-2'>
                {/* 썸네일 */}
                <div
                    className={`relative w-full aspect-video overflow-hidden bg-muted ${POST_CARD_RADIUS_CLASS}`}
                >
                    {post.thumbnail ? (
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className='object-cover'
                        />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                            <ImageIcon className='w-12 h-12 text-muted-foreground' />
                        </div>
                    )}
                </div>

                {/* 태그 */}
                {post.tags && post.tags.length > 0 && (
                    <div className='text-xs md:text-sm'>
                        <div className='flex flex-wrap items-center gap-1.5'>
                            {post.tags.slice(0, MAX_TAGS_TO_SHOW).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant='outline'
                                    className={tagClasses}
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {post.tags.length > MAX_TAGS_TO_SHOW && (
                                <span
                                    className={`text-[10px] md:text-xs ${tagCountClass}`}
                                >
                                    +{post.tags.length - MAX_TAGS_TO_SHOW}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 작성일 */}
                <div className='text-muted-foreground text-xs md:text-sm'>
                    {formatPostDate(post.createdAt)}
                </div>

                {/* 제목 영역 */}
                <div>
                    <div className='flex items-start gap-1'>
                        <CardTitle className='m-0 text-base md:text-lg font-semibold leading-snug line-clamp-2 flex-1 min-w-0'>
                            {post.title}
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}

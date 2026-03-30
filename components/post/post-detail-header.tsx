'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatPostDetailDate } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import type { PostDetail } from '@/lib/apis/post';
import type { PostType } from '@/lib/apis/write';

interface PostDetailHeaderProps {
    post: PostDetail;
}

const MAX_TAGS_TO_SHOW = 3;

/** 카드 외곽·썸네일·태그 배지 공통 모서리 둥글기 */
const POST_CARD_RADIUS_CLASS = 'rounded-[4px]';

function getCategoryTagClasses(postType: PostType) {
    const base =
        `text-[10px] md:text-xs px-2 py-1 ${POST_CARD_RADIUS_CLASS} border-0 transition-none ` +
        'focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0';

    if (postType === 'dev') {
        return [
            base,
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

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
    const resolvedPostType: PostType = post.type ?? 'dev';
    const tagClasses = getCategoryTagClasses(resolvedPostType);
    const tagCountClass = getCategoryCountClass(resolvedPostType);

    return (
        <div className='space-y-6'>
            {/* 제목 */}
            <div>
                <h1 className='text-3xl md:text-4xl font-bold mb-4'>{post.title}</h1>
            </div>

            {/* 상세정보 */}
            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                    <span>{post.author.nickname}</span>
                    <span>•</span>
                    <span>{formatPostDetailDate(post.createdAt)}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div className='text-xs md:text-sm'>
                        <div className='flex flex-wrap items-center gap-1.5'>
                            {post.tags.slice(0, MAX_TAGS_TO_SHOW).map((tag) => (
                                <Badge key={tag} variant='outline' className={tagClasses}>
                                    {tag}
                                </Badge>
                            ))}
                            {post.tags.length > MAX_TAGS_TO_SHOW && (
                                <span className={`text-[10px] md:text-xs ${tagCountClass}`}>
                                    +{post.tags.length - MAX_TAGS_TO_SHOW}
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 썸네일 이미지 */}
            {post.thumbnail && (
                <div className='relative w-full aspect-video overflow-hidden rounded-lg bg-muted border border-border'>
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className='object-cover'
                        priority
                    />
                </div>
            )}
            {!post.thumbnail && (
                <div className='relative w-full aspect-video overflow-hidden rounded-lg bg-muted border border-border flex items-center justify-center'>
                    <ImageIcon className='w-16 h-16 text-muted-foreground' />
                </div>
            )}
        </div>
    );
}

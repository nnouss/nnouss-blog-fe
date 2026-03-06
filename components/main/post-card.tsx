'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPostDate } from '@/lib/utils';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { Post } from '@/lib/apis/main';

interface PostCardProps {
    post: Post;
}

const MAX_TAGS_TO_SHOW = 3;

export function PostCard({ post }: PostCardProps) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/post/${post.slug}`);
    };

    return (
        <Card
            className='cursor-pointer hover:shadow-md transition-shadow p-0 h-full flex flex-col overflow-hidden'
            onClick={handleClick}
        >
            <CardHeader className='p-0 space-y-0'>
                {/* 썸네일 */}
                <div className='relative w-full aspect-video overflow-hidden bg-muted'>
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

                {/* 제목 영역 */}
                <div className='px-3 py-0'>
                    <div className='flex items-center gap-1'>
                        <CardTitle className='m-0 text-sm md:text-base font-semibold leading-snug line-clamp-1 flex-1 min-w-0'>
                            {post.title}
                        </CardTitle>
                        {post.commentCount > 0 && (
                            <span className='text-[10px] md:text-xs text-red-500 dark:text-red-400 font-semibold flex-shrink-0'>
                                [{post.commentCount}]
                            </span>
                        )}
                    </div>
                </div>

                {/* 메타 + 태그 영역 */}
                <div className='px-3 py-1 space-y-1 text-xs md:text-sm'>
                    {/* 작성자 */}
                    <div className='text-foreground text-[11px] md:text-sm'>
                        {post.author.nickname}
                    </div>

                    {/* 날짜 · 조회수 */}
                    <div className='text-muted-foreground text-[10px] md:text-xs'>
                        <span>{formatPostDate(post.createdAt)}</span>
                        <span className='mx-1'>·</span>
                        <span>조회 {post.views}</span>
                    </div>

                    {/* 태그 (최대 MAX_TAGS_TO_SHOW개 + 나머지 개수 표기) */}
                    {post.tags && post.tags.length > 0 && (
                        <div className='flex flex-wrap items-center gap-1.5'>
                            {post.tags.slice(0, MAX_TAGS_TO_SHOW).map((tag) => (
                                <Badge
                                    key={tag}
                                    variant='outline'
                                    className='text-[9px] md:text-[11px] border-sky-400 dark:border-sky-500 text-sky-900 dark:text-sky-50 px-1.5 py-0.5'
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {post.tags.length > MAX_TAGS_TO_SHOW && (
                                <span className='text-[9px] md:text-[11px] text-muted-foreground'>
                                    +{post.tags.length - MAX_TAGS_TO_SHOW}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>
        </Card>
    );
}

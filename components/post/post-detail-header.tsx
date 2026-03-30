'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { formatPostDate } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import type { PostDetail } from '@/lib/apis/post';

interface PostDetailHeaderProps {
    post: PostDetail;
}

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
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
                    <span>{formatPostDate(post.createdAt)}</span>
                </div>
                {post.tags && post.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant='outline'>
                                {tag}
                            </Badge>
                        ))}
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

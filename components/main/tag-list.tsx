'use client';

import { useQuery } from '@tanstack/react-query';
import { getTags } from '@/lib/apis/main';
import type { PostType } from '@/lib/apis/write';
import { Badge } from '@/components/ui/badge';
import { TagListSkeleton } from '@/components/loading';
import { cn } from '@/lib/utils';

interface TagListProps {
    selectedTag?: string;
    onTagSelect?: (tag: string | undefined) => void;
    variant?: 'vertical' | 'horizontal';
    type?: PostType;
}

export function TagList({ selectedTag, onTagSelect, variant = 'vertical', type }: TagListProps) {
    const { data: tags, isLoading } = useQuery({
        queryKey: ['tags', type],
        queryFn: () => getTags({ type }),
    });

    if (isLoading) {
        return <TagListSkeleton variant={variant} />;
    }

    if (variant === 'horizontal') {
        return (
            <div className='w-full min-w-0'>
                <h2 className='text-sm font-semibold mb-2'>태그</h2>
                {tags && tags.length > 0 ? (
                    <div className='w-full min-w-0 overflow-x-auto pb-2 scrollbar-hide'>
                        <div className='flex gap-2 min-w-max'>
                            <button
                                onClick={() => onTagSelect?.(undefined)}
                                className={cn(
                                    'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0',
                                    !selectedTag
                                        ? 'bg-sky-400/15 dark:bg-sky-500/15 text-sky-900 dark:text-sky-50 font-medium'
                                        : 'bg-background hover:bg-sky-400/10 dark:hover:bg-sky-500/10 hover:text-sky-800 dark:hover:text-sky-200'
                                )}
                            >
                                전체
                            </button>
                            {tags.map((tag) => (
                                <button
                                    key={tag.name}
                                    onClick={() => onTagSelect?.(tag.name)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1.5',
                                        selectedTag === tag.name
                                            ? 'bg-sky-400/15 dark:bg-sky-500/15 text-sky-900 dark:text-sky-50 font-medium'
                                            : 'bg-background hover:bg-sky-400/10 dark:hover:bg-sky-500/10 hover:text-sky-800 dark:hover:text-sky-200'
                                    )}
                                >
                                    <span>{tag.name}</span>
                                    <Badge variant='secondary' className='text-xs px-1.5 py-0'>
                                        {tag._count.posts}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className='text-sm text-muted-foreground'>태그가 없습니다.</p>
                )}
            </div>
        );
    }

    return (
        <div className='space-y-2'>
            <h2 className='text-lg font-semibold mb-4'>태그</h2>
            {tags && tags.length > 0 ? (
                <div className='flex flex-col gap-2'>
                    <button
                        onClick={() => onTagSelect?.(undefined)}
                        className={cn(
                            'text-left px-3 py-2 rounded-md transition-colors cursor-pointer',
                            !selectedTag
                                ? 'bg-sky-400/15 dark:bg-sky-500/15 text-sky-900 dark:text-sky-50 font-medium'
                                : 'bg-background hover:bg-sky-400/10 dark:hover:bg-sky-500/10 hover:text-sky-800 dark:hover:text-sky-200'
                        )}
                    >
                        <span className='text-sm'>전체</span>
                    </button>
                    {tags.map((tag) => (
                        <button
                            key={tag.name}
                            onClick={() => onTagSelect?.(tag.name)}
                            className={cn(
                                'text-left px-3 py-2 rounded-md transition-colors cursor-pointer',
                                selectedTag === tag.name
                                    ? 'bg-sky-400/15 dark:bg-sky-500/15 text-sky-900 dark:text-sky-50 font-medium'
                                    : 'bg-background hover:bg-sky-400/10 dark:hover:bg-sky-500/10 hover:text-sky-800 dark:hover:text-sky-200'
                            )}
                        >
                            <div className='flex items-center justify-between'>
                                <span className='text-sm'>{tag.name}</span>
                                <Badge variant='secondary' className='ml-2'>
                                    {tag._count.posts}
                                </Badge>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <p className='text-sm text-muted-foreground'>태그가 없습니다.</p>
            )}
        </div>
    );
}

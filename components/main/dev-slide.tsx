'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { getLatestDevPosts } from '@/lib/apis/main';
import { PostCard } from './post-card';
import { Skeleton } from '@/components/ui/skeleton';

export function DevSlide() {
    const { data: posts, isLoading, isError } = useQuery({
        queryKey: ['posts', 'latest', 'dev'],
        queryFn: getLatestDevPosts,
        staleTime: 60 * 1000,
    });

    if (isLoading) {
        return (
            <section className='w-full space-y-4'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-lg font-semibold'>DEV</h2>
                    <Link
                        href='/dev'
                        className='text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5'
                    >
                        더보기
                        <ChevronRight className='size-4' />
                    </Link>
                </div>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className='aspect-video w-full rounded-lg' />
                    ))}
                </div>
            </section>
        );
    }

    if (isError || !posts?.length) {
        return null;
    }

    return (
        <section className='w-full space-y-4'>
            <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>DEV</h2>
                <Link
                    href='/dev'
                    className='text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5'
                >
                    더보기
                    <ChevronRight className='size-4' />
                </Link>
            </div>
            <div className='relative w-full'>
                <Carousel
                    opts={{
                        align: 'start',
                        loop: false,
                        skipSnaps: false,
                    }}
                    className='w-full'
                >
                    <CarouselContent className='-ml-4'>
                        {posts.map((post) => (
                            <CarouselItem
                                key={post.id}
                                className='pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4'
                            >
                                <PostCard post={post} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className='left-0 top-1/2 -translate-y-1/2 sm:-left-2 md:-left-4' />
                    <CarouselNext className='right-0 top-1/2 -translate-y-1/2 sm:-right-2 md:-right-4' />
                </Carousel>
            </div>
        </section>
    );
}

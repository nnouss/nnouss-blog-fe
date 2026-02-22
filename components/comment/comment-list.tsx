'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CommentItem } from '@/components/comment/comment-item';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';
import { getComments } from '@/lib/apis/comment';

interface CommentListProps {
    postId: string;
}

function buildPageRange(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];

    if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, 'ellipsis', total);
    } else if (current >= total - 3) {
        pages.push(1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total);
    } else {
        pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total);
    }

    return pages;
}

export function CommentList({ postId }: CommentListProps) {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['comments', postId, page],
        queryFn: () => getComments(postId, page),
    });

    const handlePageChange = (next: number) => {
        if (next < 1 || (data && next > data.totalPages)) return;
        setPage(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = data?.totalPages ?? 1;
    const pageRange = buildPageRange(page, totalPages);

    return (
        <section className='pt-8 border-t space-y-1'>
            <h3 className='text-lg font-semibold mb-4'>
                댓글
                {data && (
                    <span className='text-sm font-normal text-muted-foreground ml-2'>
                        {data.totalCount}개
                    </span>
                )}
            </h3>

            {isLoading && (
                <div className='space-y-4'>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className='py-4 space-y-2'>
                            <div className='flex gap-2 items-center'>
                                <Skeleton className='h-4 w-16' />
                                <Skeleton className='h-3 w-24' />
                            </div>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-3/4' />
                        </div>
                    ))}
                </div>
            )}

            {isError && (
                <p className='text-sm text-muted-foreground py-4'>
                    댓글을 불러오는 데 실패했습니다.
                </p>
            )}

            {!isLoading && !isError && data?.data.length === 0 && (
                <p className='text-sm text-muted-foreground py-4'>아직 댓글이 없습니다.</p>
            )}

            {!isLoading && !isError && data && data.data.length > 0 && (
                <>
                    <div className='divide-y'>
                        {data.data.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className='pt-4'>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href='#'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page - 1);
                                            }}
                                            className={
                                                page === 1
                                                    ? 'pointer-events-none opacity-40'
                                                    : 'cursor-pointer'
                                            }
                                            aria-disabled={page === 1}
                                        />
                                    </PaginationItem>

                                    {pageRange.map((item, idx) =>
                                        item === 'ellipsis' ? (
                                            <PaginationItem key={`ellipsis-${idx}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        ) : (
                                            <PaginationItem key={item}>
                                                <PaginationLink
                                                    href='#'
                                                    isActive={item === page}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(item);
                                                    }}
                                                    className='cursor-pointer'
                                                >
                                                    {item}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            href='#'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(page + 1);
                                            }}
                                            className={
                                                page === totalPages
                                                    ? 'pointer-events-none opacity-40'
                                                    : 'cursor-pointer'
                                            }
                                            aria-disabled={page === totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

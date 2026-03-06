'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { VisitorStats } from '@/components/main/visitor-stats';
import { VisitorChart } from '@/components/main/visitor-chart';
import { IntroSection } from '@/components/main/intro-section';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getSummary } from '@/lib/apis/metrics/get-summary.api';

export default function Home() {
    const { data: summary, isLoading: isSummaryLoading } = useQuery({
        queryKey: ['metrics', 'summary'],
        queryFn: getSummary,
        staleTime: 60 * 60 * 1000, // 1시간
        refetchInterval: 60 * 60 * 1000, // 1시간마다 자동 갱신
        retry: 1,
    });

    return (
        <div className='flex flex-col gap-6'>
            <div className='flex flex-col md:flex-row md:items-stretch gap-4'>
                {/* 왼쪽: 소개 + Contact 링크 */}
                <IntroSection />
                {/* 오른쪽: 방문자 통계 카드 */}
                <div className='w-full md:w-64 flex-shrink-0 flex'>
                    <Card className='w-full h-full md:h-full flex flex-col min-h-[280px] md:min-h-0'>
                        <CardContent className='p-0 flex flex-col flex-1 min-h-0 justify-between'>
                            <div className='flex-shrink-0 px-6'>
                                <VisitorChart />
                            </div>
                            <div className='flex-shrink-0'>
                                <VisitorStats
                                    today={summary?.today}
                                    total={summary?.total}
                                    isLoading={isSummaryLoading}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* 개발 글로 이동 링크 */}
            <div>
                <Link
                    href='/dev'
                    className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'self-start text-sm md:text-base'
                    )}
                >
                    개발 글 보러가기
                </Link>
            </div>
        </div>
    );
}

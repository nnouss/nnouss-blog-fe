'use client';

import Link from 'next/link';
import { Mail, Github } from 'lucide-react';
import { siteProfile } from '@/config/site';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const iconMap = {
    mail: Mail,
    github: Github,
};

export function IntroSection() {
    return (
        <div className='flex-1 min-w-0 flex'>
            <Card className='w-full flex-1 flex flex-col min-h-[280px] border-2 border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-500/20 dark:shadow-amber-500/30 rounded-[4px]'>
                <CardContent className='p-6 flex flex-col justify-between flex-1 min-h-0 gap-6'>
                    <div>
                        <h1 className='text-2xl font-bold tracking-tight md:text-3xl mb-2'>
                            {siteProfile.greeting
                                .split(
                                    /([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u,
                                )
                                .map((part, index) => {
                                    // 이모지 체크 (유니코드 범위)
                                    const isEmoji =
                                        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                                            part,
                                        );
                                    if (isEmoji) {
                                        return <span key={index}>{part}</span>;
                                    }
                                    return (
                                        <span
                                            key={index}
                                            className='bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-transparent'
                                        >
                                            {part}
                                        </span>
                                    );
                                })}
                        </h1>
                        <p className='text-foreground text-base md:text-lg whitespace-pre-line'>
                            {siteProfile.intro}
                        </p>
                    </div>
                    <div className='flex flex-wrap items-center gap-3'>
                        {siteProfile.links.map((link) => {
                            const Icon = iconMap[link.icon as keyof typeof iconMap] ?? Mail;

                            const iconColorClasses = {
                                mail: 'text-blue-500 dark:text-blue-400',
                                github: 'text-gray-900 dark:text-gray-100',
                            };

                            const iconColor =
                                iconColorClasses[link.icon as keyof typeof iconColorClasses] ??
                                'text-muted-foreground';

                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                    rel={
                                        link.href.startsWith('http')
                                            ? 'noopener noreferrer'
                                            : undefined
                                    }
                                    className={cn(
                                        'inline-flex items-center gap-2.5 rounded-lg px-4 py-2.5',
                                        'text-base font-medium transition-all',
                                        'bg-accent/50 hover:bg-accent',
                                        'hover:scale-105 active:scale-95',
                                    )}
                                >
                                    <Icon className={cn('h-6 w-6 shrink-0', iconColor)} />
                                    <span className='text-foreground'>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

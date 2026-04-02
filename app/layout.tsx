import type { Metadata } from 'next';
import './globals.css';

import Providers from '@/config/providers';
import { SiteHeader } from '@/components/header/site-header';
import { PageViewTracker } from '@/components/tracking/page-view-tracker';
import { defaultMetadata } from './metadata';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='ko' suppressHydrationWarning>
            <body
                className='min-h-screen bg-background text-foreground antialiased'
                suppressHydrationWarning
            >
                <Providers>
                    <PageViewTracker />
                    <SiteHeader />
                    <main className='mx-auto w-full max-w-5xl px-4 py-10'>{children}</main>
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}

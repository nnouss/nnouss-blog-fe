import { headers } from 'next/headers';

const DEFAULT_SITE = 'https://nnouss.xyz';

/**
 * 크롤러가 요청한 호스트 기준 공개 사이트 URL (사이트맵·robots).
 * www / 비-www Search Console 속성과 <loc> 불일치를 줄입니다.
 */
export async function getPublicSiteUrl(): Promise<string> {
    const h = await headers();
    const host =
        h.get('x-forwarded-host')?.split(',')[0].trim() || h.get('host')?.trim();

    if (host) {
        const proto =
            h.get('x-forwarded-proto')?.split(',')[0].trim() ||
            (host.startsWith('localhost') ? 'http' : 'https');
        return `${proto}://${host}`;
    }

    const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
    return env || DEFAULT_SITE;
}

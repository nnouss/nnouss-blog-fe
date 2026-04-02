import type { Metadata } from 'next';

// 사이트 기본 정보
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nnouss.xyz';
const siteName = 'NNOUSS.LOG';
const defaultDescription =
    'nnouss의 개인 블로그입니다. 개발, 일상, 그리고 다양한 주제의 글을 공유합니다.';

/**
 * 기본 메타데이터 설정
 * 모든 페이지에서 공통으로 사용되는 메타데이터
 */
export const defaultMetadata: Metadata = {
    // 메타데이터의 기본 URL 설정 (상대 경로를 절대 경로로 변환할 때 사용)
    metadataBase: new URL(siteUrl),

    // 기본 타이틀 설정
    title: {
        default: siteName,
        template: `%s | ${siteName}`, // 하위 페이지에서 "제목 | nnouss.log" 형식으로 표시
    },

    // 기본 설명
    description: defaultDescription,

    // 파비콘 설정
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        ],
        shortcut: '/favicon-32x32.png',
    },

    // 키워드 (검색 엔진 최적화)
    keywords: ['블로그', '개발', '프로그래밍', '기술', '일상', 'nnouss'],

    // 작성자 정보
    authors: [{ name: 'nnouss' }],
    creator: 'nnouss',
    publisher: 'nnouss',

    // 포맷 감지 비활성화 (이메일, 주소, 전화번호 자동 링크 방지)
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },

    // Open Graph 메타데이터 (페이스북, 카카오톡 등 소셜 미디어 공유용)
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        url: siteUrl,
        siteName: siteName,
        title: siteName,
        description: defaultDescription,
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 800,
                height: 800,
                alt: siteName,
            },
        ],
    },

    // Twitter Card 메타데이터 (트위터 공유용)
    twitter: {
        card: 'summary_large_image',
        title: siteName,
        description: defaultDescription,
        images: [`${siteUrl}/og-image.png`],
    },

    // 검색 엔진 크롤링 설정
    robots: {
        index: true, // 검색 엔진에 색인 허용
        follow: true, // 링크 따라가기 허용
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Google Search Console 인증
    verification: {
        google: 'RxKnE4o4e7fZVt6BdVEeCp-2_k8xAVnk31WNl8lnpis',
    },
};

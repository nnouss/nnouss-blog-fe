import { fetchApi } from '@/lib/apis/core';
import type { Post } from './get-post-list.api';

/** 메인 슬라이드용 최신 dev 게시글 5개 */
export async function getLatestDevPosts(): Promise<Post[]> {
    return fetchApi<Post[]>('/post/latest/dev', {
        method: 'GET',
    });
}

import { fetchApi } from '@/lib/apis/core';
import type { PostType } from '@/lib/apis/write';
import type { Post } from './get-post-list.api';

/** 메인 슬라이드용 최신 게시글 5개 (type: dev | story) — GET /post/latest?type= */
export async function getLatestPosts(type: PostType): Promise<Post[]> {
    const query = new URLSearchParams({ type });
    return fetchApi<Post[]>(`/post/latest?${query.toString()}`, {
        method: 'GET',
    });
}

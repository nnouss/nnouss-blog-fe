import { fetchApi } from '@/lib/apis/core';
import type { PostType } from '@/lib/apis/write';

export interface Post {
    id: string;
    title: string;
    type?: PostType;
    thumbnail: string | null;
    slug: string;
    views: number;
    createdAt: string;
    author: {
        id: string;
        nickname: string;
    };
    tags: string[];
    commentCount: number;
}

export interface GetPostsParams {
    page: number;
    tag?: string;
}

export async function getPosts(params: GetPostsParams): Promise<Post[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    if (params.tag) {
        queryParams.append('tag', params.tag);
    }

    return fetchApi<Post[]>(`/post?${queryParams.toString()}`, {
        method: 'GET',
    });
}

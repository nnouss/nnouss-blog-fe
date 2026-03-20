import { fetchApi } from '@/lib/apis/core';
import type { PostType } from '@/lib/apis/write';

export interface Tag {
    name: string;
    _count: {
        posts: number;
    };
}

export interface GetTagsParams {
    type?: PostType;
}

export async function getTags(params?: GetTagsParams): Promise<Tag[]> {
    const queryParams = new URLSearchParams();

    if (params?.type) {
        queryParams.append('type', params.type);
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/tag?${queryString}` : '/tag';

    return fetchApi<Tag[]>(url, {
        method: 'GET',
    });
}

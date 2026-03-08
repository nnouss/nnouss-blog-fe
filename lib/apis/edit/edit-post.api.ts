import { fetchApi } from '@/lib/apis/core';
import type { PostType } from '@/lib/apis/write';

export interface EditPostDto {
    title?: string;
    type?: PostType;
    tags?: string[];
    content?: string;
    thumbnailUrl?: string | null;
}

export interface EditPostResponse {
    success: boolean;
}

export async function editPost(
    id: string,
    data: EditPostDto,
    token?: string,
): Promise<EditPostResponse> {
    return await fetchApi<EditPostResponse>(
        `/post/${id}`,
        {
            method: 'PUT',
            body: data as any,
        },
        token,
    );
}

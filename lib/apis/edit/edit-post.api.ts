import { fetchApi } from '@/lib/apis/core';

export interface EditPostDto {
    title?: string;
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

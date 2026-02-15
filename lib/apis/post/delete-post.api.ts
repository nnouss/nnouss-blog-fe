import { fetchApi } from '@/lib/apis/core';

export interface DeletePostResponse {
    success: boolean;
}

export async function deletePost(id: string, token: string): Promise<DeletePostResponse> {
    return fetchApi<DeletePostResponse>(
        `/post/${id}`,
        {
            method: 'DELETE',
        },
        token,
    );
}

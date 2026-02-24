import { fetchApi } from '@/lib/apis/core';

export interface DeleteCommentResponse {
    success?: boolean;
    [key: string]: unknown;
}

export async function deleteComment(id: string, token: string): Promise<DeleteCommentResponse> {
    return fetchApi<DeleteCommentResponse>(
        `/comment/${id}`,
        {
            method: 'DELETE',
        },
        token,
    );
}

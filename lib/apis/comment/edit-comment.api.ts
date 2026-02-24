import { fetchApi } from '@/lib/apis/core';

export interface EditCommentDto {
    content: string;
}

export interface EditCommentResponse {
    success: boolean;
    [key: string]: unknown;
}

export async function editComment(
    id: string,
    dto: EditCommentDto,
    token: string,
): Promise<EditCommentResponse> {
    return fetchApi<EditCommentResponse>(
        `/comment/${id}`,
        {
            method: 'PUT',
            body: dto as any,
        },
        token,
    );
}


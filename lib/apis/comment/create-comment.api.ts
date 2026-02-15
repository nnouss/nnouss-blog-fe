import { fetchApi } from '@/lib/apis/core';

export interface CreateCommentDto {
    content: string;
    parentId?: string;
}

export interface CreateCommentResponse {
    id: string;
    postId: string;
    authorId: string;
    content: string;
    parentId: string | null;
    rootId: string | null;
    depth: number;
    replyToUserId: string | null;
    createdAt: string;
    [key: string]: unknown;
}

export async function createComment(
    postId: string,
    dto: CreateCommentDto,
    token: string,
): Promise<CreateCommentResponse> {
    return fetchApi<CreateCommentResponse>(
        `/post/${postId}/comment`,
        {
            method: 'POST',
            body: dto as any,
        },
        token,
    );
}

import { fetchApi } from '@/lib/apis/core';

export interface CommentAuthor {
    id: string;
    nickname: string;
}

export interface CommentThread {
    id: string;
    content: string;
    depth: number;
    parentId: string | null;
    rootId: string | null;
    authorId: string;
    replyToUserId: string | null;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    author: CommentAuthor;
    replyToUser: CommentAuthor | null;
}

export interface CommentWithThread extends CommentThread {
    thread: CommentThread[];
}

export interface GetCommentsResponse {
    data: CommentWithThread[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export async function getComments(postId: string, page: number = 1): Promise<GetCommentsResponse> {
    return fetchApi<GetCommentsResponse>(`/post/${postId}/comments?page=${page}`, {
        method: 'GET',
    });
}

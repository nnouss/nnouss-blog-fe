import { fetchApi } from '@/lib/apis/core';

export type PostType = 'dev' | 'story';

export interface CreatePostDto {
    title: string;
    type: PostType;
    tags: string[];
    content: string;
    thumbnailUrl?: string | null;
}

export interface CreatePostResponse {
    success: boolean;
}

export async function createPost(data: CreatePostDto, token?: string): Promise<CreatePostResponse> {
    return await fetchApi<CreatePostResponse>(
        '/post',
        {
            method: 'POST',
            body: data as any,
        },
        token
    );
}

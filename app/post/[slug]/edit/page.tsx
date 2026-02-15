'use client';

import { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accessTokenAtom } from '@/lib/atoms/auth';
import { getPost } from '@/lib/apis/post';
import { editPost, EditPostDto } from '@/lib/apis/edit';
import type { ApiError } from '@/lib/apis/core';
import { TagInput } from '@/components/write/tag/tag-input';
import { TiptapEditor } from '@/components/write/tiptap/tiptap-editor';
import { ThumbnailUpload } from '@/components/write/thumbnail/thumbnail-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface EditPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
    const { slug } = use(params);
    const router = useRouter();
    const queryClient = useQueryClient();
    const token = useAtomValue(accessTokenAtom);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    const {
        data: postData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['post', slug],
        queryFn: () => getPost(slug),
    });

    const editPostMutation = useMutation({
        mutationFn: (data: EditPostDto) => {
            if (!token) throw new Error('로그인이 필요합니다.');
            if (!postData) throw new Error('게시글 정보가 없습니다.');
            return editPost(postData.id, data, token);
        },
        onSuccess: () => {
            // 게시글 상세, 태그 리스트, 게시글 리스트 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['post', slug] });
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            alert('글 수정에 성공했습니다.');
            router.push('/');
        },
        onError: (err: any) => {
            const apiError = err as ApiError;
            let errorMessage = '글 수정에 실패했습니다.';

            if (apiError.status === 404) {
                errorMessage = '게시글을 찾을 수 없습니다.';
            } else if (apiError.status === 403) {
                errorMessage = '게시글을 수정할 권한이 없습니다.';
            } else if (apiError.message) {
                errorMessage = apiError.message;
            }

            console.error('글 수정 실패:', err);
            alert(errorMessage);
        },
    });

    useEffect(() => {
        if (postData) {
            setTitle(postData.title);
            setTags(postData.tags);
            setContent(postData.content);
            setThumbnailUrl(postData.thumbnail);
        }
    }, [postData]);

    if (isLoading) {
        return (
            <div className='text-center py-10'>
                <p className='text-muted-foreground'>게시글을 불러오는 중...</p>
            </div>
        );
    }

    if (isError) {
        const apiError = error as ApiError;
        if (apiError?.status === 404) {
            return (
                <div className='text-center py-10'>
                    <p className='text-muted-foreground'>게시글을 찾을 수 없습니다.</p>
                </div>
            );
        }

        const errorMessage =
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
        return (
            <div className='text-center py-10 space-y-2'>
                <p className='text-muted-foreground'>게시글을 불러오는 중 오류가 발생했습니다.</p>
                <p className='text-sm text-destructive'>{errorMessage}</p>
            </div>
        );
    }

    if (!postData) {
        return (
            <div className='text-center py-10'>
                <p className='text-muted-foreground'>게시글 데이터를 불러올 수 없습니다.</p>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editPostMutation.mutate({
            title,
            tags,
            content,
            thumbnailUrl: thumbnailUrl || null,
        });
    };

    return (
        <div className='mx-auto'>
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                    <Label htmlFor='title'>제목</Label>
                    <Input
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='제목을 입력하세요'
                        required
                    />
                </div>

                <div className='space-y-2'>
                    <Label>
                        태그 <span className='text-muted-foreground'>({tags.length}/5)</span>
                    </Label>
                    <TagInput tags={tags} onChange={setTags} maxTags={5} />
                </div>

                <div className='space-y-2'>
                    <Label>내용</Label>
                    <TiptapEditor content={content} onChange={setContent} />
                </div>

                <ThumbnailUpload onChange={setThumbnailUrl} initialValue={thumbnailUrl} />

                <div className='flex justify-end gap-2'>
                    <Button
                        className='cursor-pointer'
                        type='button'
                        variant='outline'
                        onClick={() => router.push(`/post/${slug}`)}
                        disabled={editPostMutation.isPending}
                    >
                        취소
                    </Button>
                    <Button
                        className='cursor-pointer'
                        type='submit'
                        disabled={editPostMutation.isPending}
                    >
                        {editPostMutation.isPending ? '수정 중...' : '수정하기'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

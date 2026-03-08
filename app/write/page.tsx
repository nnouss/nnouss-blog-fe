'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAuthenticatedAtom, userAtom, accessTokenAtom } from '@/lib/atoms/auth';
import { createPost, CreatePostDto, type PostType } from '@/lib/apis/write';
import { TagInput } from '@/components/write/tag/tag-input';
import { TiptapEditor } from '@/components/write/tiptap/tiptap-editor';
import { ThumbnailUpload } from '@/components/write/thumbnail/thumbnail-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function WritePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const user = useAtomValue(userAtom);
    const token = useAtomValue(accessTokenAtom);
    const [mounted, setMounted] = useState(false);

    const [title, setTitle] = useState('');
    const [type, setType] = useState<PostType>('dev');
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

    const createPostMutation = useMutation({
        mutationFn: (data: CreatePostDto) => createPost(data, token || undefined),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            router.push('/');
        },
        onError: (err: any) => {
            const errorMessage = err.message || '글 작성에 실패했습니다.';
            console.error('글 작성 실패:', err);
            alert(errorMessage);
        },
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated || user?.role !== 'ADMIN') {
                router.push('/');
            }
        }
    }, [mounted, isAuthenticated, user, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createPostMutation.mutate({
            title,
            type,
            tags,
            content,
            thumbnailUrl: thumbnailUrl || null,
        });
    };

    if (!mounted) {
        return null;
    }

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return null;
    }

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
                    <Label htmlFor='type'>카테고리</Label>
                    <Select value={type} onValueChange={(v: PostType) => setType(v)}>
                        <SelectTrigger id='type' className='w-full'>
                            <SelectValue placeholder='카테고리를 선택하세요' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='dev'>Dev</SelectItem>
                            <SelectItem value='story'>Story</SelectItem>
                        </SelectContent>
                    </Select>
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

                <ThumbnailUpload onChange={setThumbnailUrl} />

                <div className='flex justify-end gap-2'>
                    <Button
                        className='cursor-pointer'
                        type='button'
                        variant='outline'
                        onClick={() => router.back()}
                        disabled={createPostMutation.isPending}
                    >
                        취소
                    </Button>
                    <Button
                        className='cursor-pointer'
                        type='submit'
                        disabled={createPostMutation.isPending}
                    >
                        {createPostMutation.isPending ? '작성 중...' : '작성하기'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

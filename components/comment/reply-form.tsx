'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { isAuthenticatedAtom, accessTokenAtom } from '@/lib/atoms/auth';
import { createComment } from '@/lib/apis/comment';

interface ReplyFormProps {
    postId: string;
    parentId: string;
    onClose: () => void;
    className?: string;
}

export function ReplyForm({ postId, parentId, onClose, className }: ReplyFormProps) {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const token = useAtomValue(accessTokenAtom);
    const [content, setContent] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const replyMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const trimmed = content.trim();
            if (!trimmed) throw new Error('답글 내용을 입력해주세요.');
            return createComment(postId, { content: trimmed, parentId }, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            onClose();
        },
        onError: (error: unknown) => {
            const apiError = error as { message?: string };
            alert(apiError.message ?? '답글 등록에 실패했습니다.');
        },
    });

    const handleSubmit = () => {
        if (!isMounted) return;
        if (!isAuthenticated || !token) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!content.trim()) {
            alert('답글 내용을 입력해주세요.');
            return;
        }
        replyMutation.mutate();
    };

    const canSubmit = isMounted && isAuthenticated && content.trim().length > 0;

    return (
        <div className={cn('mt-3 ml-4 pl-4 border-l-2 border-muted space-y-2', className)}>
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='답글을 입력하세요.'
                rows={3}
                className='resize-none focus-visible:ring-0 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-500'
            />
            <div className='flex justify-end gap-2'>
                <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={onClose}
                    disabled={replyMutation.isPending}
                    className='cursor-pointer'
                >
                    취소
                </Button>
                <Button
                    type='button'
                    size='sm'
                    onClick={handleSubmit}
                    disabled={!canSubmit || replyMutation.isPending}
                    className={cn(
                        'cursor-pointer',
                        canSubmit &&
                            !replyMutation.isPending &&
                            'bg-blue-600 text-white hover:bg-blue-700',
                    )}
                >
                    {replyMutation.isPending ? '등록 중...' : '등록'}
                </Button>
            </div>
        </div>
    );
}

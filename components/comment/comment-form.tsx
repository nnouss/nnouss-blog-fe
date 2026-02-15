'use client';

import { useState, useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { isAuthenticatedAtom, accessTokenAtom } from '@/lib/atoms/auth';
import { createComment } from '@/lib/apis/comment';

interface CommentFormProps {
    postId: string;
}

export function CommentForm({ postId }: CommentFormProps) {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const token = useAtomValue(accessTokenAtom);
    const [content, setContent] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const createMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const trimmed = content.trim();
            if (!trimmed) throw new Error('댓글 내용을 입력해주세요.');
            return createComment(postId, { content: trimmed }, token);
        },
        onSuccess: () => {
            setContent('');
        },
        onError: (error: unknown) => {
            const apiError = error as { message?: string };
            alert(apiError.message ?? '댓글 등록에 실패했습니다.');
        },
    });

    const handleTextareaInteraction = () => {
        if (!isMounted) return;
        if (!isAuthenticated) {
            alert('로그인이 필요합니다.');
            textareaRef.current?.blur();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !token) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!content.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }
        createMutation.mutate();
    };

    const canSubmit = isMounted && isAuthenticated && content.trim().length > 0;
    const isLoggedIn = isMounted && isAuthenticated;

    return (
        <section className='pt-8 border-t'>
            <h3 className='text-lg font-semibold mb-4'>댓글</h3>
            <form onSubmit={handleSubmit} className='space-y-3'>
                <div
                    role={!isLoggedIn ? 'button' : undefined}
                    tabIndex={!isLoggedIn ? 0 : undefined}
                    onClick={!isLoggedIn ? handleTextareaInteraction : undefined}
                    className={!isLoggedIn ? 'cursor-pointer' : undefined}
                >
                    <Textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={
                            !isLoggedIn
                                ? '로그인 후 댓글을 작성할 수 있습니다.'
                                : '댓글을 입력하세요.'
                        }
                        rows={4}
                        disabled={!isLoggedIn}
                        className={cn(
                            'resize-none focus-visible:ring-0 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-500',
                            !isLoggedIn && 'pointer-events-none',
                        )}
                    />
                </div>
                <div className='flex justify-end'>
                    <Button
                        type='submit'
                        variant='default'
                        disabled={!canSubmit || createMutation.isPending}
                        className={cn(
                            'cursor-pointer',
                            canSubmit &&
                                !createMutation.isPending &&
                                'bg-blue-600 text-white hover:bg-blue-700',
                        )}
                    >
                        {createMutation.isPending ? '등록 중...' : '등록'}
                    </Button>
                </div>
            </form>
        </section>
    );
}

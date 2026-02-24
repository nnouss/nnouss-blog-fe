'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CommentThread } from '@/lib/apis/comment';
import { deleteComment } from '@/lib/apis/comment';
import { formatCommentDate } from '@/lib/utils/date';
import { userAtom, accessTokenAtom } from '@/lib/atoms/auth';
import { ReplyForm } from '@/components/comment/reply-form';

export interface CommentThreadItemProps {
    postId: string;
    reply: CommentThread;
    openReplyToId: string | null;
    onOpenReply: (commentId: string) => void;
    onCloseReply: () => void;
}

export function CommentThreadItem({
    postId,
    reply,
    openReplyToId,
    onOpenReply,
    onCloseReply,
}: CommentThreadItemProps) {
    const user = useAtomValue(userAtom);
    const token = useAtomValue(accessTokenAtom);
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isAuthor = isMounted && user && String(user.id) === reply.authorId;
    const isReplyFormOpen = openReplyToId === reply.id;

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new Error('로그인이 필요합니다.');
            return deleteComment(reply.id, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
        onError: (error: unknown) => {
            const apiError = error as { message?: string };
            alert(apiError.message ?? '댓글 삭제에 실패했습니다.');
        },
    });

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('댓글을 삭제하시겠습니까?')) return;
        deleteMutation.mutate();
    };

    return (
        <div className='py-3 pl-4 border-l-2 border-muted ml-2'>
            <div
                className='cursor-pointer group'
                onClick={() => onOpenReply(reply.id)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenReply(reply.id);
                    }
                }}
            >
                <div className='flex-1 min-w-0'>
                    <div className='mb-1'>
                        <span className='text-sm font-medium'>{reply.author.nickname}</span>
                    </div>
                    {reply.isDeleted ? (
                        <p className='text-sm text-muted-foreground italic'>삭제된 댓글입니다.</p>
                    ) : (
                        <p className='text-sm whitespace-pre-wrap break-words'>
                            {reply.replyToUser && (
                                <span className='text-blue-500 font-medium mr-1'>
                                    @{reply.replyToUser.nickname}
                                </span>
                            )}
                            {reply.content}
                        </p>
                    )}
                    <div className='flex items-center gap-2 mt-1'>
                        <span className='text-xs text-muted-foreground'>
                            {formatCommentDate(reply.createdAt)}
                        </span>
                        <button
                            type='button'
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenReply(reply.id);
                            }}
                            className='text-xs text-muted-foreground hover:text-foreground cursor-pointer'
                        >
                            답글쓰기
                        </button>
                        {isAuthor && !reply.isDeleted && (
                            <button
                                type='button'
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className='text-xs text-muted-foreground hover:text-destructive cursor-pointer disabled:opacity-50'
                            >
                                삭제
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {isReplyFormOpen && (
                <ReplyForm postId={postId} parentId={reply.id} onClose={onCloseReply} />
            )}
        </div>
    );
}

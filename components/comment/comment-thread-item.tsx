'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CommentThread } from '@/lib/apis/comment';
import { deleteComment, editComment } from '@/lib/apis/comment';
import { formatCommentDate } from '@/lib/utils/date';
import { userAtom, accessTokenAtom } from '@/lib/atoms/auth';
import { ReplyForm } from '@/components/comment/reply-form';

export interface CommentThreadItemProps {
    postId: string;
    reply: CommentThread;
    openReplyToId: string | null;
    onOpenReply: (commentId: string) => void;
    onCloseReply: () => void;
    editingCommentId: string | null;
    onStartEdit: (commentId: string) => void;
    onCancelEdit: () => void;
}

export function CommentThreadItem({
    postId,
    reply,
    openReplyToId,
    onOpenReply,
    onCloseReply,
    editingCommentId,
    onStartEdit,
    onCancelEdit,
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
    const isEditing = editingCommentId === reply.id;

    const [editContent, setEditContent] = useState(reply.content);

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

    const editMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new Error('로그인이 필요합니다.');
            const trimmed = editContent.trim();
            if (!trimmed) throw new Error('댓글 내용을 입력해주세요.');
            return editComment(reply.id, { content: trimmed }, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            onCancelEdit();
        },
        onError: (error: unknown) => {
            const apiError = error as { message?: string };
            alert(apiError.message ?? '댓글 수정에 실패했습니다.');
        },
    });

    const handleStartEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (reply.isDeleted) {
            alert('삭제된 댓글은 수정할 수 없습니다.');
            return;
        }
        setEditContent(reply.content);
        onStartEdit(reply.id);
    };

    const handleSaveEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        editMutation.mutate();
    };

    const handleCancelEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCancelEdit();
        setEditContent(reply.content);
    };

    return (
        <div className='py-3 pl-4 border-l-2 border-muted ml-2'>
            <div
                className='cursor-pointer group'
                onClick={isEditing ? undefined : () => onOpenReply(reply.id)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                    if (isEditing) return;
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
                    ) : isEditing ? (
                        <>
                            <textarea
                                className='mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[1px] focus-visible:ring-ring/50'
                                rows={3}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div className='flex items-center justify-between mt-2'>
                                <span className='text-xs text-muted-foreground'>
                                    {formatCommentDate(reply.createdAt)}
                                </span>
                                <div className='flex items-center gap-2'>
                                    <button
                                        type='button'
                                        onClick={handleCancelEdit}
                                        disabled={editMutation.isPending}
                                        className='text-xs text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50'
                                    >
                                        취소
                                    </button>
                                    <button
                                        type='button'
                                        onClick={handleSaveEdit}
                                        disabled={!editContent.trim() || editMutation.isPending}
                                        className='text-xs text-blue-600 hover:text-blue-700 cursor-pointer disabled:opacity-50'
                                    >
                                        {editMutation.isPending ? '수정 중...' : '수정 완료'}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className='text-sm whitespace-pre-wrap break-words'>
                                {reply.replyToUser && (
                                    <span className='text-blue-500 font-medium mr-1'>
                                        @{reply.replyToUser.nickname}
                                    </span>
                                )}
                                {reply.content}
                            </p>
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
                                    <>
                                        <button
                                            type='button'
                                            onClick={handleStartEdit}
                                            className='text-xs text-muted-foreground hover:text-foreground cursor-pointer'
                                        >
                                            수정
                                        </button>
                                        <button
                                            type='button'
                                            onClick={handleDelete}
                                            disabled={deleteMutation.isPending}
                                            className='text-xs text-muted-foreground hover:text-destructive cursor-pointer disabled:opacity-50'
                                        >
                                            삭제
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isReplyFormOpen && (
                <ReplyForm postId={postId} parentId={reply.id} onClose={onCloseReply} />
            )}
        </div>
    );
}

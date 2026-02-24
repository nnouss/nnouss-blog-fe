'use client';

import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CommentWithThread } from '@/lib/apis/comment';
import { deleteComment, editComment } from '@/lib/apis/comment';
import { formatCommentDate } from '@/lib/utils/date';
import { userAtom, accessTokenAtom } from '@/lib/atoms/auth';
import { ReplyForm } from '@/components/comment/reply-form';
import { CommentThreadItem } from '@/components/comment/comment-thread-item';

interface CommentItemProps {
    postId: string;
    comment: CommentWithThread;
    openReplyToId: string | null;
    onOpenReply: (commentId: string) => void;
    onCloseReply: () => void;
    editingCommentId: string | null;
    onStartEdit: (commentId: string) => void;
    onCancelEdit: () => void;
}

export function CommentItem({
    postId,
    comment,
    openReplyToId,
    onOpenReply,
    onCloseReply,
    editingCommentId,
    onStartEdit,
    onCancelEdit,
}: CommentItemProps) {
    const user = useAtomValue(userAtom);
    const token = useAtomValue(accessTokenAtom);
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isAuthor = isMounted && user && String(user.id) === comment.authorId;
    const isRootReplyFormOpen = openReplyToId === comment.id;
    const isEditing = editingCommentId === comment.id;

    const [editContent, setEditContent] = useState(comment.content);

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new Error('로그인이 필요합니다.');
            return deleteComment(comment.id, token);
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
            return editComment(comment.id, { content: trimmed }, token);
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
        if (comment.isDeleted) {
            alert('삭제된 댓글은 수정할 수 없습니다.');
            return;
        }
        setEditContent(comment.content);
        onStartEdit(comment.id);
    };

    const handleSaveEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        editMutation.mutate();
    };

    const handleCancelEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onCancelEdit();
        setEditContent(comment.content);
    };

    return (
        <div className='py-4'>
            <div
                className='cursor-pointer group'
                onClick={isEditing ? undefined : () => onOpenReply(comment.id)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                    if (isEditing) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onOpenReply(comment.id);
                    }
                }}
            >
                <div className='flex-1 min-w-0'>
                    <div className='mb-1'>
                        <span className='text-sm font-medium'>{comment.author.nickname}</span>
                    </div>
                    {comment.isDeleted ? (
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
                                    {formatCommentDate(comment.createdAt)}
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
                                        disabled={
                                            !editContent.trim() || editMutation.isPending
                                        }
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
                                {comment.content}
                            </p>
                            <div className='flex items-center gap-2 mt-1'>
                                <span className='text-xs text-muted-foreground'>
                                    {formatCommentDate(comment.createdAt)}
                                </span>
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenReply(comment.id);
                                    }}
                                    className='text-xs text-muted-foreground hover:text-foreground cursor-pointer'
                                >
                                    답글쓰기
                                </button>
                                {isAuthor && !comment.isDeleted && (
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

            {isRootReplyFormOpen && (
                <ReplyForm postId={postId} parentId={comment.id} onClose={onCloseReply} />
            )}

            {comment.thread.length > 0 && (
                <div className='mt-2 space-y-0'>
                    {comment.thread.map((reply) => (
                        <CommentThreadItem
                            key={reply.id}
                            postId={postId}
                            reply={reply}
                            openReplyToId={openReplyToId}
                            onOpenReply={onOpenReply}
                            onCloseReply={onCloseReply}
                            editingCommentId={editingCommentId}
                            onStartEdit={onStartEdit}
                            onCancelEdit={onCancelEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

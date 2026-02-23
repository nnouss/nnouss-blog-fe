'use client';

import type { CommentThread } from '@/lib/apis/comment';
import { formatCommentDate } from '@/lib/utils/date';
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
    const isReplyFormOpen = openReplyToId === reply.id;

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
                    </div>
                </div>
            </div>
            {isReplyFormOpen && (
                <ReplyForm postId={postId} parentId={reply.id} onClose={onCloseReply} />
            )}
        </div>
    );
}

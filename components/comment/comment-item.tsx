'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { CommentWithThread, CommentThread } from '@/lib/apis/comment';

interface CommentItemProps {
    comment: CommentWithThread;
}

function formatDate(dateStr: string) {
    return format(new Date(dateStr), 'yyyy.MM.dd HH:mm', { locale: ko });
}

function ThreadItem({ reply }: { reply: CommentThread }) {
    return (
        <div className='flex gap-3 py-3 pl-4 border-l-2 border-muted ml-2'>
            <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                    <span className='text-sm font-medium'>{reply.author.nickname}</span>
                    <span className='text-xs text-muted-foreground'>
                        {formatDate(reply.createdAt)}
                    </span>
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
            </div>
        </div>
    );
}

export function CommentItem({ comment }: CommentItemProps) {
    return (
        <div className='py-4'>
            <div className='flex gap-3'>
                <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 mb-1'>
                        <span className='text-sm font-medium'>{comment.author.nickname}</span>
                        <span className='text-xs text-muted-foreground'>
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                    {comment.isDeleted ? (
                        <p className='text-sm text-muted-foreground italic'>삭제된 댓글입니다.</p>
                    ) : (
                        <p className='text-sm whitespace-pre-wrap break-words'>
                            {comment.content}
                        </p>
                    )}
                </div>
            </div>

            {comment.thread.length > 0 && (
                <div className='mt-2 space-y-0'>
                    {comment.thread.map((reply) => (
                        <ThreadItem key={reply.id} reply={reply} />
                    ))}
                </div>
            )}
        </div>
    );
}

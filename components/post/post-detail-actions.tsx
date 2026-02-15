'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { userAtom, accessTokenAtom } from '@/lib/atoms/auth';
import { deletePost } from '@/lib/apis/post';

interface PostDetailActionsProps {
    authorId: string;
    id: string;
    slug: string;
}

export function PostDetailActions({ authorId, id, slug }: PostDetailActionsProps) {
    const router = useRouter();
    const user = useAtomValue(userAtom);
    const token = useAtomValue(accessTokenAtom);
    const queryClient = useQueryClient();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isAuthor = isMounted && user && String(user.id) === authorId;

    const deleteMutation = useMutation({
        mutationFn: () => {
            if (!token) throw new Error('로그인이 필요합니다.');
            return deletePost(id, token);
        },
        onSuccess: (data) => {
            // 태그 리스트와 게시글 리스트 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });

            // 성공 메시지 표시
            if (data.success) {
                alert('게시글이 삭제되었습니다.');
                router.push('/');
            }
        },
        onError: (error: any) => {
            // ApiError 타입 확인
            const apiError = error as { status?: number; message?: string };

            let errorMessage = '게시글 삭제에 실패했습니다.';

            if (apiError.status === 404) {
                errorMessage = '게시글을 찾을 수 없습니다.';
            } else if (apiError.status === 403) {
                errorMessage = '게시글을 삭제할 권한이 없습니다.';
            } else if (apiError.message) {
                errorMessage = apiError.message;
            }

            alert(errorMessage);
        },
    });

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    return (
        <div className='flex items-center justify-between pt-6 border-t'>
            <Button className='cursor-pointer' variant='outline' onClick={() => router.back()}>
                <ArrowLeft className='w-4 h-4 mr-2' />
                이전으로
            </Button>

            {isAuthor && (
                <div className='flex gap-2'>
                    <Button
                        className='cursor-pointer'
                        variant='outline'
                        onClick={() => router.push(`/post/${slug}/edit`)}
                    >
                        <Pencil className='w-4 h-4 mr-2' />
                        수정
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className='cursor-pointer' variant='destructive'>
                                <Trash2 className='w-4 h-4 mr-2' />
                                삭제
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>게시글을 삭제하시겠습니까?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    이 작업은 되돌릴 수 없습니다. 게시글이 영구적으로 삭제됩니다.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='cursor-pointer'>
                                    취소
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className='cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                >
                                    삭제
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
    );
}

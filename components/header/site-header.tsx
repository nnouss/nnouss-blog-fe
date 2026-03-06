'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAtomValue, useSetAtom } from 'jotai';
import { Menu, Pencil, User } from 'lucide-react';

import { ModeToggle } from '@/components/header/mode-toggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { isAuthenticatedAtom, logoutAtom, userAtom } from '@/lib/atoms/auth';

export function SiteHeader() {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom); // 로그인 상태 확인
    const user = useAtomValue(userAtom); // 유저 정보
    const logout = useSetAtom(logoutAtom); // 로그아웃 함수
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        logout();
    };

    const isAdmin = mounted && user?.role === 'ADMIN';

    const authButtons =
        mounted && isAuthenticated ? (
            <>
                {isAdmin && (
                    <Link
                        href='/write'
                        className='w-full block py-2 px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                    >
                        글 쓰기
                    </Link>
                )}
                <button
                    onClick={handleLogout}
                    className='w-full text-left py-2 px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer'
                >
                    로그아웃
                </button>
            </>
        ) : (
            <>
                <Link
                    href='/signup'
                    className='w-full block py-2 px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                    회원가입
                </Link>
                <Link
                    href='/signin'
                    className='w-full block py-2 px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                    로그인
                </Link>
            </>
        );

    return (
        <header className='sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur'>
            <div className='mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:gap-6'>
                <Link href='/' className='text-lg font-semibold tracking-tight sm:text-xl'>
                    Slas.log
                </Link>
                <div className='flex flex-wrap items-center justify-end gap-2 sm:gap-3'>
                    <nav className='hidden sm:flex items-center gap-3 text-sm font-medium text-muted-foreground mr-2'>
                        <Link href='/dev' className='hover:text-foreground transition-colors'>
                            Dev
                        </Link>
                    </nav>
                    <ModeToggle />
                    {/* 유저 드롭다운 (모든 화면) */}
                    <div className='flex items-center gap-3'>
                        {mounted && isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='icon' className='cursor-pointer'>
                                        <User className='size-5' />
                                        <span className='sr-only'>회원 메뉴 열기</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    {isAdmin && (
                                        <DropdownMenuItem asChild>
                                            <Link href='/write'>글 쓰기</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' size='icon' className='cursor-pointer'>
                                        <User className='size-5' />
                                        <span className='sr-only'>회원 메뉴 열기</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                    <DropdownMenuItem asChild>
                                        <Link href='/signup'>회원가입</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href='/signin'>로그인</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    {/* 모바일 사이드 메뉴 */}
                    <div className='block sm:hidden'>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant='ghost' size='icon' className='cursor-pointer'>
                                    <Menu className='size-5' />
                                    <span className='sr-only'>메뉴 열기</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                                <SheetHeader className='border-b border-gray-300'>
                                    <SheetTitle className=''>메뉴</SheetTitle>
                                </SheetHeader>

                                <div className='mt-4 flex flex-col gap-4'>
                                    <nav className='flex flex-col gap-2'>
                                        <Link
                                            href='/dev'
                                            className='block py-2 px-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                                        >
                                            Dev
                                        </Link>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}

'use client';

import { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Strikethrough,
    Underline,
    Code,
    Code2,
    Link2,
    List,
    ListOrdered,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Highlighter,
    Youtube,
    Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from '@/lib/atoms/auth';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '@/lib/apis/write';

/** Tiptap Highlight multicolor — `toggleHighlight({ color })`와 동일한 hex */
const HIGHLIGHT_PRESETS = [
    { color: '#fef08a', label: '노랑' },
    { color: '#86efac', label: '초록' },
    { color: '#93c5fd', label: '파랑' },
    { color: '#fca5a5', label: '빨강' },
    { color: '#c4b5fd', label: '보라' },
] as const;

interface TiptapToolbarProps {
    editor: Editor;
}

export function TiptapToolbar({ editor }: TiptapToolbarProps) {
    const accessToken = useAtomValue(accessTokenAtom);

    const applyLink = () => {
        const previous = editor.getAttributes('link').href as string | undefined;
        const next = window.prompt('링크 URL', previous ?? 'https://');

        if (next === null) {
            return;
        }

        if (next === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor.chain().focus().setLink({ href: next }).run();
    };

    // 유튜브 링크 임베드
    const addYoutubeVideo = () => {
        const url = prompt('Youtube URL을 입력하세요.');

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
            });
        }
    };

    // 이미지 업로드
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            event.target.value = '';
            return;
        }

        // 이미지 압축 옵션
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            const result = await uploadImage(compressedFile, accessToken || undefined);

            // 에디터에 이미지 삽입
            editor.chain().focus().setImage({ src: result.path }).run();
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지를 업로드 할 수 없습니다. 관리자에게 문의하세요.');
        }

        event.target.value = '';
    };

    return (
        <div className='flex flex-wrap gap-1 p-2 border-b border-input bg-muted/50'>
            {/* 텍스트 스타일 */}
            <Button
                type='button'
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <Bold className='h-4 w-4' />
            </Button>
            <Button
                type='button'
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <Italic className='h-4 w-4' />
            </Button>
            <Button
                type='button'
                variant={editor.isActive('strike') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <Strikethrough className='h-4 w-4' />
            </Button>
            <Button
                type='button'
                variant={editor.isActive('underline') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <Underline className='h-4 w-4' />
            </Button>
            <Button
                type='button'
                variant={editor.isActive('code') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleCode().run()}
                className='h-8 w-8 p-0 cursor-pointer'
                title='인라인 코드'
            >
                <Code className='h-4 w-4' />
            </Button>
            <Button
                type='button'
                variant={editor.isActive('link') ? 'default' : 'ghost'}
                size='sm'
                onClick={applyLink}
                className='h-8 w-8 p-0 cursor-pointer'
                title='링크'
            >
                <Link2 className='h-4 w-4' />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type='button'
                        variant={editor.isActive('highlight') ? 'default' : 'ghost'}
                        size='sm'
                        className='h-8 w-8 p-0 cursor-pointer'
                    >
                        <Highlighter className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                    {HIGHLIGHT_PRESETS.map(({ color, label }) => (
                        <DropdownMenuItem
                            key={color}
                            onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                        >
                            <span
                                className='mr-2 h-4 w-4 shrink-0 rounded-sm border border-border'
                                style={{ backgroundColor: color }}
                                aria-hidden
                            />
                            <span className='flex-1'>{label}</span>
                            {editor.isActive('highlight', { color }) ? (
                                <span className='text-xs text-muted-foreground'>적용됨</span>
                            ) : null}
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editor.chain().focus().unsetHighlight().run()}>
                        하이라이트 제거
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 인용구 */}
            <Button
                type='button'
                variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <Quote className='h-4 w-4' />
            </Button>

            {/* 코드 블록 */}
            <Button
                type='button'
                variant={editor.isActive('codeBlock') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <Code2 className='h-4 w-4' />
            </Button>

            <div className='w-px h-6 bg-border mx-1' />

            {/* 텍스트 정렬 */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type='button'
                        variant={
                            editor.isActive({ textAlign: 'left' }) ||
                            editor.isActive({ textAlign: 'center' }) ||
                            editor.isActive({ textAlign: 'right' }) ||
                            editor.isActive({ textAlign: 'justify' })
                                ? 'default'
                                : 'ghost'
                        }
                        size='sm'
                        className='h-8 w-8 p-0 cursor-pointer'
                        onClick={(e) => e.preventDefault()}
                    >
                        <AlignLeft className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    >
                        <AlignLeft className='h-4 w-4 mr-2' />
                        왼쪽 정렬
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    >
                        <AlignCenter className='h-4 w-4 mr-2' />
                        가운데 정렬
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    >
                        <AlignRight className='h-4 w-4 mr-2' />
                        오른쪽 정렬
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    >
                        <AlignJustify className='h-4 w-4 mr-2' />
                        양쪽 정렬
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className='w-px h-6 bg-border mx-1' />

            {/* 제목 */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type='button'
                        variant={
                            editor.isActive('heading', { level: 1 }) ||
                            editor.isActive('heading', { level: 2 }) ||
                            editor.isActive('heading', { level: 3 }) ||
                            editor.isActive('heading', { level: 4 })
                                ? 'default'
                                : 'ghost'
                        }
                        size='sm'
                        className='h-8 w-8 p-0 cursor-pointer'
                    >
                        <Heading1 className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    >
                        <Heading1 className='h-4 w-4 mr-2' />
                        제목 1
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        <Heading2 className='h-4 w-4 mr-2' />
                        제목 2
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        <Heading3 className='h-4 w-4 mr-2' />
                        제목 3
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    >
                        <Heading4 className='h-4 w-4 mr-2' />
                        제목 4
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className='w-px h-6 bg-border mx-1' />

            {/* 리스트 */}
            <Button
                type='button'
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <List className='h-4 w-4' />
            </Button>
            <Button
                type='button'
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size='sm'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <ListOrdered className='h-4 w-4' />
            </Button>

            <div className='w-px h-6 bg-border mx-1' />

            {/* 유튜브 임베드 */}
            <Button
                type='button'
                variant={editor.isActive('youtube') ? 'default' : 'ghost'}
                size='sm'
                onClick={addYoutubeVideo}
                className='h-8 w-8 p-0 cursor-pointer'
            >
                <Youtube className='h-4 w-4'></Youtube>
            </Button>

            {/* 이미지 업로드 */}
            <label htmlFor='image-upload' className='cursor-pointer'>
                <input
                    id='image-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className='hidden'
                />
                <Button
                    type='button'
                    variant={editor.isActive('image') ? 'default' : 'ghost'}
                    size='sm'
                    className='h-8 w-8 p-0 cursor-pointer'
                    onClick={() => document.getElementById('image-upload')?.click()}
                >
                    <Image className='h-4 w-4' />
                </Button>
            </label>
        </div>
    );
}

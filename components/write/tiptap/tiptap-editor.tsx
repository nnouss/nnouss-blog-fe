'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';
import { ResizableImage } from 'tiptap-extension-resizable-image';
import 'tiptap-extension-resizable-image/styles.css';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { all, createLowlight, common } from 'lowlight';
import { TiptapToolbar } from './tiptap-toolbar';
// import './tiptap-editor.css';
import 'highlight.js/styles/atom-one-dark.css';

import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';

const lowlight = createLowlight(common);

lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

interface TiptapEditorProps {
    content: string;
    onChange?: (content: string) => void;
    editable?: boolean;
}

export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'code-block',
                    spellcheck: 'false',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                },
            }),
            Underline,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Youtube.configure({
                nocookie: true,
                allowFullscreen: true,
                progressBarColor: 'white',
                width: 640,
                height: 360,
                HTMLAttributes: {
                    class: 'youtube-embed',
                },
            }),
            Image,
            ResizableImage,
            Link.configure({
                openOnClick: !editable,
                autolink: true,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-2',
                },
            }),
        ],
        immediatelyRender: false,
        onUpdate: onChange
            ? ({ editor }) => {
                  onChange(editor.getHTML());
              }
            : undefined,
        editable,
        editorProps: {
            attributes: {
                class: editable
                    ? 'tiptap prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[600px] p-4'
                    : 'tiptap prose prose-sm max-w-none dark:prose-invert focus:outline-none min-h-[300px] p-4',
                spellcheck: 'false',
                autocorrect: 'off',
                autocapitalize: 'off',
            },
        },
        content,
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div
            className={
                editable
                    ? 'border border-input rounded-md overflow-hidden bg-background'
                    : 'overflow-hidden bg-background'
            }
        >
            {editable && <TiptapToolbar editor={editor} />}
            <div className={editable ? 'bg-background h-[600px] overflow-auto' : 'overflow-auto'}>
                <EditorContent editor={editor} className='tiptap' spellCheck={false} />
            </div>
        </div>
    );
}

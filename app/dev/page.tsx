'use client';

import { useState } from 'react';
import { TagList } from '@/components/main/tag-list';
import { PostList } from '@/components/main/post-list';

export default function DevPage() {
    const [selectedTag, setSelectedTag] = useState<string | undefined>();

    const handleTagSelect = (tag: string | undefined) => {
        if (tag === undefined) {
            setSelectedTag(undefined);
        } else {
            setSelectedTag((prev) => (prev === tag ? undefined : tag));
        }
    };

    return (
        <div className='flex flex-col md:flex-row gap-4 md:gap-8'>
            {/* 데스크톱: 왼쪽 태그 리스트 */}
            <aside className='hidden md:block w-40 flex-shrink-0'>
                <div className='sticky top-4'>
                    <TagList
                        selectedTag={selectedTag}
                        onTagSelect={handleTagSelect}
                        variant='vertical'
                    />
                </div>
            </aside>

            {/* 게시글 리스트 */}
            <main className='flex-1 min-w-0'>
                {/* 모바일: 게시글 바로 위에 태그 필터 */}
                <div className='md:hidden w-full min-w-0 mb-4'>
                    <TagList
                        selectedTag={selectedTag}
                        onTagSelect={handleTagSelect}
                        variant='horizontal'
                    />
                </div>
                <PostList selectedTag={selectedTag} />
            </main>
        </div>
    );
}


import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';

/**
 * 게시글 날짜를 yyyy-MM-dd HH:mm:ss 포맷으로 변환
 * @param date - 변환할 날짜 (Date 객체, 문자열, 또는 타임스탬프)
 * @returns 포맷된 날짜 문자열 (예: "2025-12-22 12:35:34")
 */
export function formatPostDate(date: Date | string | number): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    return format(dateObj, 'yyyy.MM.dd HH:mm', {
        locale: ko,
    });
}

/**
 * 댓글/답글 날짜를 yyyy.MM.dd HH:mm 포맷으로 변환
 * @param dateStr - 변환할 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2025.12.22 12:35")
 */
export function formatCommentDate(dateStr: string): string {
    return format(new Date(dateStr), 'yyyy.MM.dd HH:mm', { locale: ko });
}

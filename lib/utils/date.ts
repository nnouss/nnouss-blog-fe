import {
    differenceInCalendarDays,
    differenceInCalendarMonths,
    differenceInHours,
    differenceInMinutes,
    format,
} from 'date-fns';
import { ko } from 'date-fns/locale/ko';

/**
 * 게시글 작성일 표시.
 * - 달력 기준 1개월 미만: 상대 시간 (분·시간·일·N주 전, 28일 이상·같은 달력월 이내면 "1개월 전")
 * - 1개월 이상: yy.MM.dd (시간 없음)
 */
export function formatPostDate(date: Date | string | number): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const now = new Date();

    if (dateObj.getTime() > now.getTime()) {
        return format(dateObj, 'yy.MM.dd', { locale: ko });
    }

    const diffDays = differenceInCalendarDays(now, dateObj);

    if (diffDays >= 1) {
        if (differenceInCalendarMonths(now, dateObj) >= 1) {
            return format(dateObj, 'yy.MM.dd', { locale: ko });
        }
        if (diffDays >= 28) {
            return '1개월 전';
        }
        if (diffDays >= 7) {
            return `${Math.floor(diffDays / 7)}주 전`;
        }
        return `${diffDays}일 전`;
    }

    const diffMins = differenceInMinutes(now, dateObj);
    if (diffMins < 1) {
        return '방금 전';
    }
    if (diffMins < 60) {
        return `${diffMins}분 전`;
    }

    const diffHrs = differenceInHours(now, dateObj);
    return `${diffHrs}시간 전`;
}

/**
 * 게시글 상세 페이지 날짜 포맷: yyyy년 M월 d일
 */
export function formatPostDetailDate(date: Date | string | number): string {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return format(dateObj, 'yyyy년 M월 d일', { locale: ko });
}

/**
 * 댓글/답글 날짜를 yyyy.MM.dd HH:mm 포맷으로 변환
 * @param dateStr - 변환할 날짜 문자열
 * @returns 포맷된 날짜 문자열 (예: "2025.12.22 12:35")
 */
export function formatCommentDate(dateStr: string): string {
    return format(new Date(dateStr), 'yyyy.MM.dd HH:mm', { locale: ko });
}

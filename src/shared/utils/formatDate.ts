/**
 * Jul 25, 2025 형식으로 변경해주는 함수
 * @param isoDate
 * @returns
 */
export const formatToReadableDate = (isoDate: string): string | null => {
  const date = new Date(isoDate);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    return '날짜 정보 없음';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * 0000년 00월 00일 포멧으로 변경
 */
export const formatToKoreaDate = (date: string | Date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 00:00 시간만 추출
 */
export const extractTimeOnly = (date: string | Date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Date(dateObj).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

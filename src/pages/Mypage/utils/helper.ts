/**
 * Jul 25, 2025 형식으로 변경해주는 함수
 * @param isoDate
 * @returns
 */
export const formatToReadableDate = (isoDate: string): string | null => {
  const date = new Date(isoDate);

  // 유효한 날짜인지 확인
  if (isNaN(date.getTime())) {
    console.log('formatToReadableDate - 유효한 날짜가 아님 return null');
    return null;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

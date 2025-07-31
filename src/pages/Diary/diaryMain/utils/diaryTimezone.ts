export const getKoreanDateStartUTC = (date: Date): string => {
  const koreanDate = new Date(date);
  koreanDate.setHours(0, 0, 0, 0);
  // 한국은 UTC+9이므로 9시간을 빼서 UTC로 변환
  const utcDate = new Date(koreanDate.getTime() - 9 * 60 * 60 * 1000);
  return utcDate.toISOString();
};

export const getKoreanDateEndUTC = (date: Date): string => {
  const koreanDate = new Date(date);
  koreanDate.setHours(23, 59, 59, 999);
  // 한국은 UTC+9이므로 9시간을 빼서 UTC로 변환
  const utcDate = new Date(koreanDate.getTime() - 9 * 60 * 60 * 1000);
  return utcDate.toISOString();
};

export const getLocalDateString = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthRange = (selectedDate: Date) => {
  const firstDayOfSelectedMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  firstDayOfSelectedMonth.setHours(0, 0, 0, 0);
  const startUTC = firstDayOfSelectedMonth.toISOString();

  const firstDayOfNextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
  firstDayOfNextMonth.setHours(0, 0, 0, 0);
  const endUTC = firstDayOfNextMonth.toISOString();

  return { startUTC, endUTC };
};

export const isFutureDate = (checkDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(checkDate);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate > today;
};

export const getTodayDateForForm = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localToUTC = new Date(now.getTime() - offset * 60 * 1000);
  return localToUTC.toISOString().split('T')[0];
};

// 한국시간 기준으로 UTC 시간 start end 시간 가져오기
export const formatUTCToKorean = () => {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const startKST = new Date(`${yyyy}-${mm}-${dd}T00:00:00+09:00`);
  const endKST = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999+09:00`);

  return [startKST, endKST];
};

// 특정 날짜에 대한 한국 시간 기준 UTC 범위 계산
export const getKoreanDateRangeUTC = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const startKST = new Date(`${yyyy}-${mm}-${dd}T00:00:00+09:00`);
  const endKST = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999+09:00`);

  return [startKST.toISOString(), endKST.toISOString()];
};

// UTC 시간을 한국 시간으로 변환해서 날짜 문자열 반환
export const getKoreanDateStringFromUTC = (utcDate: string | Date): string => {
  const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;

  //UTC에서 한국 시간으로 변환 (UTC + 9시간)
  const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const year = koreanTime.getUTCFullYear();
  const month = String(koreanTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

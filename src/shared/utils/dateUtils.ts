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

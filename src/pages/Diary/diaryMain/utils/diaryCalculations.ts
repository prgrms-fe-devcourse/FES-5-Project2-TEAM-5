export const calculateDiaryCompletionPercentage = (
  currentMonthDiaryCount: number,
  totalDaysInSelectedMonth: number,
): number => {
  const percentage = Math.round((currentMonthDiaryCount / totalDaysInSelectedMonth) * 100);
  return Math.min(100, percentage);
};

export const calculateEmotionPercentages = (emotionCounts: number[]): number[] => {
  if (!emotionCounts || emotionCounts.length === 0) return [];

  const totalCount = emotionCounts.reduce((sum, count) => sum + count, 0);

  if (totalCount === 0) return emotionCounts;

  return emotionCounts.map((count) => Math.round((count / totalCount) * 100));
};

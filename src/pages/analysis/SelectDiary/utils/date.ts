export const getTodayDateForForm = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localToUTC = new Date(now.getTime() - offset * 60 * 1000);
  return localToUTC.toISOString().split('T')[0];
};
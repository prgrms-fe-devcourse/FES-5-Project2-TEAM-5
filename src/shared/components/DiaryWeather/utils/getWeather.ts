import type { WeatherData } from '..';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const CITY = 'Seoul,KR';

export const fetchWeather = async (): Promise<WeatherData | null> => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${WEATHER_API_KEY}&units=metric`,
  );

  if (!response.ok) throw new Error('날씨 데이터 가져오기 실패');
  const data = await response.json();
  return data;
};

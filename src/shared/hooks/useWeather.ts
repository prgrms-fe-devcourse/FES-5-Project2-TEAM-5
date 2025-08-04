import { useEffect, useState } from 'react';
import { getWeatherData } from '../components/DiaryWeather/utils/getWeatherData';
import type { WeatherData } from '../components/DiaryWeather/utils/type';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await getWeatherData();
      if (data) setWeather(data);
    };
    loadWeather();

    const interval = setInterval(() => {
      loadWeather();
    }, 3 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { weather };
};

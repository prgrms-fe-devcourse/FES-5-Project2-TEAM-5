import { useEffect, useState } from 'react';
import type { WeatherData } from '..';
import { fetchWeather } from '../utils/getWeather';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadWeather = async () => {
      const data = await fetchWeather();
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

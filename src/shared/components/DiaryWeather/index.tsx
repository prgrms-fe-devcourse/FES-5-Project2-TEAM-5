import S from './style.module.css';
import { useEffect, useState } from 'react';
import { fetchWeather } from './utils/getWeather';
import { getWeatherImage } from './utils/getWeatherImage';

interface WeatherInfo {
  id: number;
}

export interface WeatherData {
  weather: WeatherInfo[];
}

const DiaryWeather = () => {
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

  const weatherImage = weather ? getWeatherImage(weather.weather[0].id) : null;

  return (
    <section className={S.section01}>
      <h2>Welcome to the Seediary</h2>
      <figure>
        {weatherImage && <img src={weatherImage} alt="" />}
        <figcaption className="sr-only">날씨 api 연동 사진</figcaption>
      </figure>
    </section>
  );
};
export default DiaryWeather;

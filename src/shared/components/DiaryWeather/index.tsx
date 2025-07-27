import S from './style.module.css';
import { getWeatherImage } from './utils/getWeatherImage';
import { useWeatherContext } from './context/WeatherContext';

interface WeatherInfo {
  id: number;
}

export interface WeatherData {
  weather: WeatherInfo[];
}

const DiaryWeather = () => {
  const { weather } = useWeatherContext();
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

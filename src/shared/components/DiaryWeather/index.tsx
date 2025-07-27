import S from './style.module.css';
import { getWeatherImage } from './utils/getWeatherImage';
import { useWeatherContext } from './context/WeatherContext';

const DiaryWeather = ({ title = 'Welcome to the Seediary' }: { title?: string }) => {
  const { weather } = useWeatherContext();
  const weatherImage = weather ? getWeatherImage(weather.weather[0].id) : null;

  return (
    <section className={S.section01}>
      <h2>{title}</h2>
      <figure>
        {weatherImage && <img src={weatherImage} alt="" />}
        <figcaption className="sr-only">날씨 api 연동 사진</figcaption>
      </figure>
    </section>
  );
};
export default DiaryWeather;

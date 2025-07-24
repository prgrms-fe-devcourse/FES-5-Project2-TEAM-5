import S from './style.module.css';
import WeatherImage from '../../../assets/@weather_cloud.png';

function DiaryWeather() {
  return (
    <section className={S.section01}>
      <h2>Welcome to the Seediary</h2>
      <figure>
        <img src={WeatherImage} alt="" />
        <figcaption className="sr-only">날씨 api 연동 사진</figcaption>
      </figure>
    </section>
  );
}
export default DiaryWeather;

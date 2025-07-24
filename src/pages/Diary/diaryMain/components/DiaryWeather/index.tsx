import WeatherImage from '../../../assets/@weather_cloud.png';

function DiaryWeather() {
  return (
    <figure>
      <img src={WeatherImage} alt="" />
      <figcaption className="sr-only">날씨 api 연동 사진</figcaption>
    </figure>
  );
}
export default DiaryWeather;

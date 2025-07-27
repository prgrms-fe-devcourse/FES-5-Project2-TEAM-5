const WEATHER_IMAGES = {
  sunny: '/weather/sunny.png',
  cloud: '/weather/cloud.png',
  rain: '/weather/rain.png',
  snow: '/weather/snow.png',
};

export const getWeatherImage = (weatherId: number): string => {
  if (weatherId >= 600 && weatherId < 700) {
    return WEATHER_IMAGES.snow;
  }
  if (weatherId >= 200 && weatherId < 600) {
    return WEATHER_IMAGES.rain;
  }
  if (weatherId === 800) {
    return WEATHER_IMAGES.sunny;
  }
  return WEATHER_IMAGES.cloud;
};

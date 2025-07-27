import { createContext, useContext, useMemo } from 'react';
import { useWeather } from '../hooks/useWeather';
import type { WeatherData } from '..';

interface WeatherContextType {
  weather: WeatherData | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: React.ReactElement }) => {
  const { weather } = useWeather();

  const value = useMemo(() => ({ weather }), [weather]);
  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeatherContext Error');
  }
  return context;
};

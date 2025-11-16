
import type { WeatherData } from '../types';

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
  if (!apiKey) {
    throw new Error("OpenWeather API_KEY environment variable not set");
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.list || data.list.length === 0) {
      throw new Error("No forecast data available");
    }

    // Берём ближайший прогноз (первый элемент массива list)
    const nearestForecast = data.list[0];

    return {
      wind: {
        speed: nearestForecast.wind.speed,
        deg: nearestForecast.wind.deg
      },
      weatherIcon: nearestForecast.weather[0].icon
    };
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw new Error("Could not fetch weather forecast. Please try again later.");
  }
};



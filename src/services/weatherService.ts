
import type { WeatherData } from '../types';

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;
  if (!apiKey) {
    throw new Error("OpenWeather API_KEY environment variable not set");
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg
      },
      weatherIcon: data.weather[0].icon
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Could not fetch weather data. Please try again later.");
  }
};


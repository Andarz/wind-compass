
import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from './services/weatherService';
import type { WeatherData } from './types';
import Compass from './components/Compass';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const degreesToCardinal = (deg: number): string => {
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5);
  return cardinals[index % 16];
};

const App: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('Getting your location...');


  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLoadingMessage('Fetching wind data...');
      const { latitude, longitude } = position.coords;

      fetchWeatherData(latitude, longitude)
        .then(data => {
          setWeather(data);
          setError(null);
        })
        .catch(err => {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred.");
          }
        })
        .finally(() => {
          setLoadingMessage('');
        });
    };

    const handleError = (error: GeolocationPositionError) => {
      let message = "Could not retrieve location.";
      if (error.code === error.PERMISSION_DENIED) {
        message = "Location access denied. Please enable it in your browser settings.";
      }
      setError(message);
      setLoadingMessage('');
    };

    // Using an IIFE to handle the async operation inside useEffect's setup
    (async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });
        handleSuccess(position);
      } catch (err) {
        if (err instanceof GeolocationPositionError) {
          handleError(err);
        } else {
          setError("An unexpected error occurred while getting location.");
          setLoadingMessage('');
        }
      }
    })();

  }, []);

  const renderContent = () => {
    if (loadingMessage) {
      return <LoadingSpinner message={loadingMessage} />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (weather) {
      const speed = weather.wind.speed;
      const direction = weather.wind.deg;

      const speedClass = speed <= 10.6 ? "wind-green" : "wind-red";

      return (
        <div className="app-container">
          <Compass direction={direction} />

          {weather.weatherIcon && (
            <img
              src={`http://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
              alt="Weather icon"
              className="weather-icon"
            />
          )}


          <div className={`wind-speed ${speedClass}`}>
            {speed.toFixed(1)} м/с
          </div>

          <div className="direction-text">
            {degreesToCardinal(direction)}
          </div>
        </div>

      );
    }

    return null;
  };


  return (
    <main className="bg-slate-900 min-h-screen w-full flex items-center justify-center p-4">
      {renderContent()}
    </main>
  );
};

export default App;

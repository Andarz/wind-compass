import React from "react";
import "./Compass.css";

interface CompassProps {
  direction: number;       // направление ветра в градусах
  weatherIcon?: string;    // код иконки погоды OpenWeather
}

const Compass: React.FC<CompassProps> = ({ direction, weatherIcon }) => {
  // Поворачиваем стрелку так, чтобы она указывала направление ветра
  // Ветер "с юга" → стрелка указывает на север
  const rotation = (direction + 180) % 360;

  const iconUrl = weatherIcon
    ? `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    : "";

  return (
    <div className="compass-wrapper">
      <div className="compass-circle">
        {/* Стрелка ветра */}
        <div
          className="compass-arrow"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        {/* Иконка погоды по центру круга */}
        {weatherIcon && (
          <img
            src={iconUrl}
            alt="Weather icon"
            className="weather-icon"
          />
        )}
      </div>
    </div>
  );
};

export default Compass;


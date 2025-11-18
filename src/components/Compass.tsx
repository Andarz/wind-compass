import React, { useEffect, useState, useRef } from "react";
import "./Compass.css";

interface CompassProps {
  direction: number;       // направление ветра в градусах
  weatherIcon?: string;    // код иконки погоды OpenWeather
  pop?: number;            // вероятность осадков (0–100)
}

const Compass: React.FC<CompassProps> = ({ direction, weatherIcon, pop }) => {
  const [deviceHeading, setDeviceHeading] = useState(0);
  const currentHeading = useRef(0);
  const headingBuffer = useRef<number[]>([]); // для скользящего среднего

  const rotation = direction + 180; // стрелка ветра
  const iconUrl = weatherIcon
    ? `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    : "";

  // Плавное вращение круга компаса
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      // Добавляем новое значение в буфер
      headingBuffer.current.push(deviceHeading);
      if (headingBuffer.current.length > 5) headingBuffer.current.shift(); // берем последние 5 значений

      // Среднее значение
      const avgHeading = headingBuffer.current.reduce((a, b) => a + b, 0) / headingBuffer.current.length;

      // Разница и нормализация
      let delta = avgHeading - currentHeading.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      // Сглаживание
      currentHeading.current += delta * 0.07; // коэффициент можно подрегулировать

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [deviceHeading]);

  // Слушаем ориентацию устройства
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(event.alpha);
      }
    };

    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <div className="compass-wrapper">

      {/* Индикатор дождя */}
      {pop !== undefined && pop > 50 && (
        <div className="rain-warning">
          <img src="/umbrella-icon.svg" alt="Umbrella" className="umbrella-icon" />
          <span>{`${Math.round(pop)}%`}</span>
        </div>
      )}

      {/* Статичная иконка погоды */}
      {weatherIcon && (
        <img src={iconUrl} alt="Weather icon" className="weather-icon" />
      )}

      {/* Вращающийся круг компаса */}
      <div
        className="compass-circle"
        style={{ transform: `rotate(${-currentHeading.current}deg)` }}
      >
        <div className="compass-letter north">N</div>
        <div className="compass-letter east">E</div>
        <div className="compass-letter south">S</div>
        <div className="compass-letter west">W</div>
      </div>

      {/* Стрелка ветра */}
      <div
        className="compass-arrow"
        style={{ transform: `rotate(${rotation}deg)` }}
      />
    </div>
  );
};

export default Compass;

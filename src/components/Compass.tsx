import React, { useEffect, useState } from "react";
import "./Compass.css";

type Props = {
  direction: number; // угол ветра в градусах
};

const Compass: React.FC<Props> = ({ direction }) => {
  // Локальный стейт для плавного вращения
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Вычисляем кратчайший путь поворота
    const diff = ((direction - rotation + 540) % 360) - 180;
    setRotation((prev) => prev + diff);
  }, [direction]);

  return (
    <div className="compass-wrapper">
      <div
        className="compass-arrow"
        style={{ transform: `rotate(${rotation + 180}deg)` }}
      />
      <div className="compass-circle" />
    </div>
  );
};

export default Compass;

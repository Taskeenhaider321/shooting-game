import React, { useEffect, useRef } from 'react';

interface ProjectileProps {
  x: number;
  y: number;
  radius: number;
  color?: string;
  velocity: { x: number; y: number };
}

const Projectile: React.FC<ProjectileProps> = ({ x, y, radius, color = 'white', velocity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    const draw = () => {
      c.save();
      c.shadowColor = color;
      c.shadowBlur = 20;
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI * 2, false);
      c.fillStyle = color;
      c.fill();
      c.restore();
    };

    draw();
  }, [x, y, radius, color]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Projectile;
import React, { useEffect, useRef } from 'react';

const Enemy: React.FC<{
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
}> = ({ x, y, radius, color, velocity }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let canvas:any = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    const draw = () => {
      c.beginPath();
      c.arc(x, y, radius, 0, Math.PI * 2, false);
      c.fillStyle = color;
      c.fill();
    };

    const update = () => {
      draw();
      x = x + velocity.x;
      y = y + velocity.y;
    };

    update();
  }, [x, y, radius, color, velocity]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Enemy;
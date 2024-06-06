import React, { useEffect, useRef } from 'react';

interface PlayerProps {
  x: number;
  y: number;
  radius: number;
  color: string;
  username: string;
}

const Player: React.FC<PlayerProps> = ({ x, y, radius, color, username }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext('2d');
    if (!c) return;

    const draw = () => {
      c.font = '12px sans-serif';
      c.fillStyle = 'white';
      c.fillText(username, x - 10, y + 20);

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
  }, [x, y, radius, color, username]);

  return <canvas ref={canvasRef}></canvas>;
};

export default Player;
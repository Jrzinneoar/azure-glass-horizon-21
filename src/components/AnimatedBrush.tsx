
import React from 'react';

interface AnimatedBrushProps {
  className?: string;
  color?: string;
  size?: number;
  variant?: 1 | 2;
}

const AnimatedBrush: React.FC<AnimatedBrushProps> = ({
  className = "",
  color = "rgba(255, 255, 255, 0.1)",
  size = 400,
  variant = 1,
}) => {
  const animationClass = variant === 1 ? "animate-brush-move-1" : "animate-brush-move-2";
  
  return (
    <div 
      className={`brush ${animationClass} ${className}`} 
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: color,
      }}
    />
  );
};

export default AnimatedBrush;

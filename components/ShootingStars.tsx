"use client";
import React, { useEffect, useState, useRef } from "react";

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  groupSizeMin?: number; // Min stars per group
  groupSizeMax?: number; // Max stars per group
  delayBetweenGroups?: number; // ms between star groups
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

const getGroupStartPoints = (groupSize: number) => {
  // Each group spawns from a single random position on top or left edge
  const points: { x: number; y: number; angle: number }[] = [];
  const spawnFromTop = Math.random() < 0.5;
  const offsetBetweenStars = 14;
  let baseX, baseY, baseAngle;
  if (spawnFromTop) {
    baseX = Math.random() * window.innerWidth * 0.85; // avoid far right
    baseY = 0; // start at top edge
    baseAngle = 105 + Math.random() * 10; // more vertical, slight right
  } else {
    baseX = 0; // start at left edge
    baseY = Math.random() * window.innerHeight * 0.7; // avoid far bottom
    baseAngle = 25 + Math.random() * 10; // more horizontal, slight down
  }
  for (let i = 0; i < groupSize; i++) {
    points.push({
      x: baseX + i * offsetBetweenStars,
      y: baseY + i * offsetBetweenStars,
      angle: baseAngle + i * 2
    });
  }
  return points;
};

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 8,
  maxSpeed = 14,
  groupSizeMin = 2,
  groupSizeMax = 3,
  delayBetweenGroups = 5000,
  starColor = "#ffffff",
  trailColor = "#ffffff66",
  starWidth = 80,
  starHeight = 8,
  className = "",
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const createStarGroup = () => {
      const groupSize =
        Math.floor(Math.random() * (groupSizeMax - groupSizeMin + 1)) +
        groupSizeMin;
      const points = getGroupStartPoints(groupSize);
      const newStars: ShootingStar[] = points.map((point, index) => ({
        id: Date.now() + Math.random() + index,
        x: point.x,
        y: point.y,
        angle: point.angle,
        scale: 1 + index * 0.08, // Slightly different sizes
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        distance: 0,
      }));
      setStars(prev => [...prev, ...newStars]);
      setTimeout(createStarGroup, delayBetweenGroups);
    };
    createStarGroup();
    // Recreate on resize for better spawn positions
    const handleResize = () => {
      setStars([]);
      createStarGroup();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minSpeed, maxSpeed, groupSizeMin, groupSizeMax, delayBetweenGroups]);

  useEffect(() => {
    const animate = () => {
      setStars(prevStars =>
        prevStars
          .map(star => {
            const newX =
              star.x + star.speed * Math.cos((star.angle * Math.PI) / 180);
            const newY =
              star.y + star.speed * Math.sin((star.angle * Math.PI) / 180);
            const newDistance = star.distance + star.speed;
            const newScale = Math.min(1 + newDistance / 180, 1.4);
            return {
              ...star,
              x: newX,
              y: newY,
              distance: newDistance,
              scale: newScale,
            };
          })
          .filter(
            star =>
              star.x > -60 &&
              star.x < window.innerWidth + 60 &&
              star.y > -60 &&
              star.y < window.innerHeight + 60
          )
      );
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <svg
      className={`w-full h-full absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -15 }}
    >
      {stars.map(star => (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#shootingStarGradient)"
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`}
          opacity={Math.max(0.7, 1 - star.distance / 400)}
          filter="url(#glow)"
        />
      ))}
      <defs>
        <linearGradient
          id="shootingStarGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={trailColor} stopOpacity={0.2} />
          <stop offset="50%" stopColor={trailColor} stopOpacity={0.8} />
          <stop offset="80%" stopColor={starColor} stopOpacity={1} />
          <stop offset="100%" stopColor={starColor} stopOpacity={1} />
        </linearGradient>
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};
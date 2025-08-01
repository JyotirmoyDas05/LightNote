import React, { useEffect, useRef } from 'react';

// Utility to get a random integer between min and max
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Beam animation component
export const GridBeams: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  type Beam = {
    pos: { x: number; y: number };
    dir: { x: number; y: number };
    speed: number;
    color: string;
    trail: { x: number; y: number }[];
    maxTrail: number;
    active: boolean;
    intensity: number;
  };
  
  const beams = useRef<Beam[]>([]);
  const gridSize = { x: 20, y: 30 };
  const beamCount = 12;

  // Initialize beams with lighter, more subtle colors
  useEffect(() => {
    // Lighter, more subtle color palette
    const colors = [
      '#93c5fd', // Light Blue
      '#c4b5fd', // Light Purple  
      '#67e8f9', // Light Cyan
      '#6ee7b7', // Light Emerald
      '#fcd34d', // Light Amber
      '#fca5a5', // Light Red
      '#f9a8d4', // Light Pink
      '#e5e7eb', // Light Gray
    ];
    
    const width = window.innerWidth;
    const height = 600;
    const directions = [
      { x: 1, y: 0 }, // right
      { x: -1, y: 0 }, // left
      { x: 0, y: 1 }, // down
      { x: 0, y: -1 }, // up
    ];

    function randomEdge() {
      const edge = randomInt(0, 3);
      switch (edge) {
        case 0: // left
          return { x: 0, y: randomInt(0, Math.floor(height / gridSize.y)) * gridSize.y };
        case 1: // right
          return { x: Math.floor(width / gridSize.x) * gridSize.x, y: randomInt(0, Math.floor(height / gridSize.y)) * gridSize.y };
        case 2: // top
          return { x: randomInt(0, Math.floor(width / gridSize.x)) * gridSize.x, y: 0 };
        case 3: // bottom
          return { x: randomInt(0, Math.floor(width / gridSize.x)) * gridSize.x, y: Math.floor(height / gridSize.y) * gridSize.y };
      }
      return { x: 0, y: 0 };
    }

    beams.current = Array.from({ length: beamCount }).map(() => {
      const dir = directions[randomInt(0, directions.length - 1)];
      const pos = randomEdge();
      return {
        pos,
        dir,
        speed: randomInt(2, 5),
        color: colors[randomInt(0, colors.length - 1)],
        trail: [pos],
        maxTrail: randomInt(25, 40),
        active: true,
        intensity: Math.random() * 0.3 + 0.2, // Reduced intensity range
      };
    });
  }, [beamCount, gridSize.x, gridSize.y]);

  // Animate beams with reduced visual prominence
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;

    function draw() {
      const width = window.innerWidth;
      const height = window.innerHeight > 600 ? window.innerHeight : 600;
      if (!canvas || !ctx) return;
      
      canvas.width = width;
      canvas.height = height;
      ctx.clearRect(0, 0, width, height);

      // Animate beams
      beams.current.forEach((beam) => {
        if (!beam.active) return;

        // Move beam
        beam.pos = {
          x: beam.pos.x + beam.dir.x * gridSize.x * (beam.speed / 20),
          y: beam.pos.y + beam.dir.y * gridSize.y * (beam.speed / 20),
        };

        // Add to trail
        beam.trail.push({ ...beam.pos });
        if (beam.trail.length > beam.maxTrail) beam.trail.shift();

        // Draw trail with reduced intensity
        for (let t = 0; t < beam.trail.length; t++) {
          const p = beam.trail[t];
          const progress = t / beam.trail.length;
          const size = Math.max(0.5, 6 - (beam.trail.length - t) * 0.15);
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, 2 * Math.PI);
          
          // Reduced alpha for more subtle effect
          ctx.globalAlpha = (0.02 + 0.4 * progress) * beam.intensity;
          ctx.fillStyle = beam.color;
          ctx.shadowColor = beam.color;
          ctx.shadowBlur = 8 * progress * beam.intensity; // Reduced glow
          ctx.fill();
          ctx.restore();
        }

        // Draw subtle head with reduced glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(beam.pos.x, beam.pos.y, 3, 0, 2 * Math.PI); // Smaller head
        ctx.globalAlpha = 0.6; // Reduced opacity
        ctx.fillStyle = beam.color;
        ctx.shadowColor = beam.color;
        ctx.shadowBlur = 10 * beam.intensity; // Reduced glow
        ctx.fill();
        
        // Lighter inner core
        ctx.beginPath();
        ctx.arc(beam.pos.x, beam.pos.y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#f8fafc'; // Very light gray instead of pure white
        ctx.globalAlpha = 0.4 * beam.intensity; // Reduced inner glow
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();

        // Respawn logic with lighter colors
        if (
          beam.pos.x < -50 || beam.pos.x > width + 50 ||
          beam.pos.y < -50 || beam.pos.y > height + 50
        ) {
          const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];
          
          function randomEdge() {
            const edge = randomInt(0, 3);
            switch (edge) {
              case 0: return { x: -20, y: randomInt(0, Math.floor(height / gridSize.y)) * gridSize.y };
              case 1: return { x: width + 20, y: randomInt(0, Math.floor(height / gridSize.y)) * gridSize.y };
              case 2: return { x: randomInt(0, Math.floor(width / gridSize.x)) * gridSize.x, y: -20 };
              case 3: return { x: randomInt(0, Math.floor(width / gridSize.x)) * gridSize.x, y: height + 20 };
            }
            return { x: 0, y: 0 };
          }

          const colors = [
            '#93c5fd', '#c4b5fd', '#67e8f9', '#6ee7b7', 
            '#fcd34d', '#fca5a5', '#f9a8d4', '#e5e7eb'
          ];
          
          beam.dir = directions[randomInt(0, directions.length - 1)];
          beam.pos = randomEdge();
          beam.trail = [beam.pos];
          beam.maxTrail = randomInt(25, 40);
          beam.color = colors[randomInt(0, colors.length - 1)];
          beam.intensity = Math.random() * 0.3 + 0.2; // Reduced intensity
          beam.speed = randomInt(2, 5);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [gridSize.x, gridSize.y]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -20,
        opacity: 0.5, // Reduced overall opacity
      }}
      aria-hidden
    />
  );
};

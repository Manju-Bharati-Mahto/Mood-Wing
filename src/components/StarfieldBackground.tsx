import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface Galaxy {
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
  color: string;
}

export const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const galaxiesRef = useRef<Galaxy[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeStars();
      initializeGalaxies();
    };

    const initializeStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 3000);
      starsRef.current = [];
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const initializeGalaxies = () => {
      const galaxyCount = 3 + Math.floor(Math.random() * 3);
      galaxiesRef.current = [];
      
      const colors = [
        'rgba(147, 112, 219, 0.15)', // Purple
        'rgba(100, 149, 237, 0.12)', // Cornflower blue
        'rgba(255, 182, 193, 0.1)',  // Pink
        'rgba(64, 224, 208, 0.08)',  // Turquoise
      ];
      
      for (let i = 0; i < galaxyCount; i++) {
        galaxiesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 200 + 100,
          rotation: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.3 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const drawGalaxy = (galaxy: Galaxy, time: number) => {
      if (!ctx) return;
      
      ctx.save();
      ctx.translate(galaxy.x, galaxy.y);
      ctx.rotate(galaxy.rotation + time * 0.0001);
      
      // Create spiral galaxy effect
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, galaxy.size);
      gradient.addColorStop(0, galaxy.color);
      gradient.addColorStop(0.5, galaxy.color.replace(/[\d.]+\)$/, '0.05)'));
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, galaxy.size, galaxy.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Add spiral arms
      ctx.globalAlpha = galaxy.opacity * 0.5;
      for (let arm = 0; arm < 2; arm++) {
        ctx.beginPath();
        for (let i = 0; i < 100; i++) {
          const angle = (i / 100) * Math.PI * 3 + arm * Math.PI;
          const radius = (i / 100) * galaxy.size * 0.8;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.6;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = galaxy.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      ctx.restore();
    };

    const drawStar = (star: Star, time: number) => {
      if (!ctx) return;
      
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      const currentOpacity = star.opacity * (0.5 + twinkle * 0.5);
      const currentSize = star.size * (0.8 + twinkle * 0.2);
      
      // Star glow
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, currentSize * 3
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
      gradient.addColorStop(0.5, `rgba(200, 220, 255, ${currentOpacity * 0.3})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, currentSize * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Star core
      ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw galaxies first (background)
      galaxiesRef.current.forEach(galaxy => drawGalaxy(galaxy, time));
      
      // Draw stars on top
      starsRef.current.forEach(star => drawStar(star, time));
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};

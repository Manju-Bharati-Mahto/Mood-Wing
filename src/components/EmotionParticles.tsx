import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Emotion } from '@/lib/emotionDetector';

interface EmotionParticlesProps {
  emotion: Emotion;
}

const particleConfigs: Partial<Record<Emotion, {
  count: number;
  color: string;
  shape: 'circle' | 'star' | 'heart' | 'leaf' | 'spark';
  speed: number;
  size: [number, number];
}>> = {
  peaceful: { count: 15, color: 'hsl(var(--emotion-peaceful))', shape: 'leaf', speed: 0.3, size: [8, 16] },
  grateful: { count: 20, color: 'hsl(var(--emotion-grateful))', shape: 'star', speed: 0.5, size: [6, 12] },
  hopeful: { count: 25, color: 'hsl(var(--emotion-hopeful))', shape: 'spark', speed: 0.6, size: [4, 10] },
  proud: { count: 15, color: 'hsl(var(--emotion-proud))', shape: 'star', speed: 0.4, size: [10, 18] },
  amused: { count: 20, color: 'hsl(var(--emotion-amused))', shape: 'circle', speed: 0.5, size: [6, 12] },
  content: { count: 10, color: 'hsl(var(--emotion-content))', shape: 'circle', speed: 0.2, size: [8, 14] },
  curious: { count: 25, color: 'hsl(var(--emotion-curious))', shape: 'spark', speed: 0.7, size: [4, 8] },
  nostalgic: { count: 15, color: 'hsl(var(--emotion-nostalgic))', shape: 'circle', speed: 0.3, size: [6, 12] },
  contemplative: { count: 12, color: 'hsl(var(--emotion-contemplative))', shape: 'circle', speed: 0.2, size: [8, 16] },
  awestruck: { count: 30, color: 'hsl(var(--emotion-awestruck))', shape: 'star', speed: 0.5, size: [6, 14] },
  terrified: { count: 20, color: 'hsl(var(--emotion-terrified))', shape: 'spark', speed: 1.2, size: [3, 6] },
  fearful: { count: 15, color: 'hsl(var(--emotion-fearful))', shape: 'spark', speed: 0.8, size: [4, 8] },
  jealous: { count: 12, color: 'hsl(var(--emotion-jealous))', shape: 'circle', speed: 0.4, size: [6, 10] },
  guilty: { count: 10, color: 'hsl(var(--emotion-guilty))', shape: 'circle', speed: 0.3, size: [4, 8] },
  ashamed: { count: 8, color: 'hsl(var(--emotion-ashamed))', shape: 'circle', speed: 0.2, size: [4, 8] },
  disgusted: { count: 15, color: 'hsl(var(--emotion-disgusted))', shape: 'circle', speed: 0.5, size: [5, 10] },
  envious: { count: 12, color: 'hsl(var(--emotion-envious))', shape: 'circle', speed: 0.4, size: [5, 10] },
  melancholic: { count: 10, color: 'hsl(var(--emotion-melancholic))', shape: 'circle', speed: 0.2, size: [6, 12] },
  bored: { count: 5, color: 'hsl(var(--emotion-bored))', shape: 'circle', speed: 0.1, size: [8, 14] },
  apathetic: { count: 3, color: 'hsl(var(--emotion-apathetic))', shape: 'circle', speed: 0.1, size: [10, 16] },
};

export function EmotionParticles({ emotion }: EmotionParticlesProps) {
  const config = particleConfigs[emotion];
  
  if (!config) return null;

  const particles = Array.from({ length: config.count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: config.size[0] + Math.random() * (config.size[1] - config.size[0]),
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10 / config.speed
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: config.color,
            opacity: 0.4
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

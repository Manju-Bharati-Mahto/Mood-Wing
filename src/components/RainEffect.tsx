import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface RainEffectProps {
  active: boolean;
}

export const RainEffect = ({ active }: RainEffectProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!active) {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current?.currentTime || 0 + 0.5);
      }
      return;
    }

    // Create rattling rain sound using Web Audio API
    const createRainSound = () => {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;
      
      // Create noise buffer for rain
      const bufferSize = audioContext.sampleRate * 2;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Create noise source
      noiseNodeRef.current = audioContext.createBufferSource();
      noiseNodeRef.current.buffer = noiseBuffer;
      noiseNodeRef.current.loop = true;

      // Create filter for rain-like sound
      const lowpass = audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 400;

      const highpass = audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 100;

      // Create gain for volume control
      gainNodeRef.current = audioContext.createGain();
      gainNodeRef.current.gain.value = 0;
      gainNodeRef.current.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 1);

      // Connect nodes
      noiseNodeRef.current.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContext.destination);

      noiseNodeRef.current.start();
    };

    createRainSound();

    return () => {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [active]);

  if (!active) return null;

  // Generate rain drops
  const rainDrops = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5,
    opacity: 0.3 + Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {rainDrops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-[2px] bg-gradient-to-b from-transparent via-emotion-sad/60 to-emotion-sad/20"
          style={{
            left: `${drop.left}%`,
            height: '80px',
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: ['0vh', '110vh'],
            opacity: [0, drop.opacity, drop.opacity, 0],
          }}
          transition={{
            duration: drop.duration,
            delay: drop.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
      
      {/* Rain mist overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emotion-sad/5 via-transparent to-emotion-sad/10" />
    </div>
  );
};

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FallingLettersEffectProps {
  active: boolean;
  text: string;
  emotion: 'frustrated' | 'lonely';
}

export const FallingLettersEffect = ({ active, text, emotion }: FallingLettersEffectProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastTextLengthRef = useRef(0);
  const fallingLettersRef = useRef<{ id: number; char: string; x: number }[]>([]);
  const idCounterRef = useRef(0);

  // Play brick breaking sound
  const playBrickSound = () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    const now = audioContext.currentTime;

    // Create noise burst for brick/crash sound
    const bufferSize = audioContext.sampleRate * 0.15;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Low-pass filter for thuddy sound
    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 800;

    // Gain envelope
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    // Add a low thud
    const thud = audioContext.createOscillator();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(80, now);
    thud.frequency.exponentialRampToValueAtTime(40, now + 0.1);

    const thudGain = audioContext.createGain();
    thudGain.gain.setValueAtTime(0.4, now);
    thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    noiseSource.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(audioContext.destination);

    thud.connect(thudGain);
    thudGain.connect(audioContext.destination);

    noiseSource.start(now);
    noiseSource.stop(now + 0.15);
    thud.start(now);
    thud.stop(now + 0.1);
  };

  useEffect(() => {
    if (!active) {
      lastTextLengthRef.current = 0;
      fallingLettersRef.current = [];
      return;
    }

    // Detect new characters typed
    const currentLength = text.length;
    if (currentLength > lastTextLengthRef.current && currentLength > 0) {
      const newChars = text.slice(lastTextLengthRef.current);
      
      // Add falling letters for each new character
      newChars.split('').forEach((char, index) => {
        if (char !== ' ') {
          const id = idCounterRef.current++;
          fallingLettersRef.current.push({
            id,
            char,
            x: 10 + Math.random() * 80
          });
          
          // Play sound occasionally (not for every letter)
          if (Math.random() < 0.3) {
            playBrickSound();
          }

          // Remove after animation
          setTimeout(() => {
            fallingLettersRef.current = fallingLettersRef.current.filter(l => l.id !== id);
          }, 2000);
        }
      });
    }
    
    lastTextLengthRef.current = currentLength;
  }, [active, text]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!active) return null;

  const colorClass = emotion === 'frustrated' ? 'text-emotion-frustrated' : 'text-emotion-lonely';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {fallingLettersRef.current.map((letter) => (
          <motion.span
            key={letter.id}
            className={`absolute text-2xl font-bold ${colorClass} opacity-60`}
            style={{ left: `${letter.x}%` }}
            initial={{ y: -50, opacity: 1, rotate: 0 }}
            animate={{
              y: '110vh',
              opacity: [1, 0.8, 0.5, 0],
              rotate: Math.random() > 0.5 ? 180 : -180,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              ease: 'easeIn',
            }}
          >
            {letter.char}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Dust particles at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background/50 to-transparent" />
    </div>
  );
};

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CherryBlossomEffectProps {
  active: boolean;
}

export const CherryBlossomEffect = ({ active }: CherryBlossomEffectProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!active) {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      return;
    }

    // Create gentle piano melody using Web Audio API
    const createPianoMelody = () => {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      // Pentatonic scale frequencies for peaceful melody
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
      let noteIndex = 0;

      const playNote = () => {
        if (!audioContext || audioContext.state === 'closed') return;

        const frequency = notes[noteIndex % notes.length];
        noteIndex++;

        // Create oscillator for piano-like tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;

        // Add harmonics for richer sound
        const harmonic = audioContext.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.value = frequency * 2;
        const harmonicGain = audioContext.createGain();
        harmonicGain.gain.value = 0.1;

        // ADSR envelope for piano-like decay
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.04, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2);

        oscillator.connect(gainNode);
        harmonic.connect(harmonicGain);
        harmonicGain.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(now);
        harmonic.start(now);
        oscillator.stop(now + 2);
        harmonic.stop(now + 2);

        oscillatorsRef.current.push(oscillator, harmonic);
      };

      // Play notes at random intervals for gentle melody
      const scheduleNote = () => {
        playNote();
        const nextDelay = 800 + Math.random() * 1500;
        intervalRef.current = setTimeout(scheduleNote, nextDelay);
      };

      scheduleNote();
    };

    createPianoMelody();

    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [active]);

  if (!active) return null;

  // Generate cherry blossom petals
  const petals = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 6 + Math.random() * 4,
    size: 8 + Math.random() * 12,
    rotation: Math.random() * 360,
    swayAmount: 20 + Math.random() * 40,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {/* Soft pink overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emotion-happy/5 via-transparent to-emotion-happy/3" />
      
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size,
          }}
          initial={{ y: -50, opacity: 0, rotate: petal.rotation }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, petal.swayAmount, -petal.swayAmount, petal.swayAmount / 2, 0],
            opacity: [0, 0.9, 0.9, 0.7, 0],
            rotate: [petal.rotation, petal.rotation + 180, petal.rotation + 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Petal shape */}
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <ellipse
              cx="10"
              cy="10"
              rx="8"
              ry="5"
              className="fill-pink-300/80"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(255, 182, 193, 0.5))',
              }}
            />
            <ellipse
              cx="10"
              cy="10"
              rx="4"
              ry="2.5"
              className="fill-pink-200/60"
            />
          </svg>
        </motion.div>
      ))}

      {/* Floating light particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-emotion-happy/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

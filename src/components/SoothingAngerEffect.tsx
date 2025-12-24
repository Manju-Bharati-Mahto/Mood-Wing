import { useEffect, useRef } from 'react';

interface SoothingAngerEffectProps {
  active: boolean;
}

export const SoothingAngerEffect = ({ active }: SoothingAngerEffectProps) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!active) {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      }
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (audioContextRef.current) audioContextRef.current.close();
      return;
    }

    // Create soothing ambient drone with binaural beats for calming
    const createSoothingSound = () => {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioContext = audioContextRef.current;

      gainNodeRef.current = audioContext.createGain();
      gainNodeRef.current.gain.value = 0;
      gainNodeRef.current.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 2);
      gainNodeRef.current.connect(audioContext.destination);

      // Base frequencies for calming effect (theta waves ~6Hz difference for relaxation)
      const baseFreq = 174; // Solfeggio frequency for relieving tension
      
      // Left channel oscillator
      const oscLeft = audioContext.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.value = baseFreq;
      
      // Right channel with slight offset for binaural effect
      const oscRight = audioContext.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.value = baseFreq + 6;

      // Warm pad layer
      const padOsc = audioContext.createOscillator();
      padOsc.type = 'sine';
      padOsc.frequency.value = 285; // Another solfeggio frequency

      const padGain = audioContext.createGain();
      padGain.gain.value = 0.04;

      // Gentle LFO for subtle movement
      const lfo = audioContext.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1;
      
      const lfoGain = audioContext.createGain();
      lfoGain.gain.value = 3;
      
      lfo.connect(lfoGain);
      lfoGain.connect(padOsc.frequency);

      // Connect oscillators
      const leftGain = audioContext.createGain();
      leftGain.gain.value = 0.08;
      
      const rightGain = audioContext.createGain();
      rightGain.gain.value = 0.08;

      oscLeft.connect(leftGain);
      oscRight.connect(rightGain);
      padOsc.connect(padGain);

      leftGain.connect(gainNodeRef.current);
      rightGain.connect(gainNodeRef.current);
      padGain.connect(gainNodeRef.current);

      // Start all oscillators
      const now = audioContext.currentTime;
      oscLeft.start(now);
      oscRight.start(now);
      padOsc.start(now);
      lfo.start(now);

      oscillatorsRef.current = [oscLeft, oscRight, padOsc, lfo];
    };

    createSoothingSound();

    return () => {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [active]);

  // No visual effect, just audio
  return null;
};

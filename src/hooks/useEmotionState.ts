import { useState, useCallback, useRef, useEffect } from 'react';
import { Emotion, detectEmotion, calculateWPM, countWords } from '@/lib/emotionDetector';

interface UseEmotionStateReturn {
  emotion: Emotion;
  text: string;
  wpm: number;
  wordCount: number;
  setText: (text: string) => void;
  resetEmotion: () => void;
}

export function useEmotionState(): UseEmotionStateReturn {
  const [emotion, setEmotion] = useState<Emotion>('neutral');
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  
  const typingStartTime = useRef<number | null>(null);
  const lastWordCount = useRef(0);
  const wpmHistory = useRef<number[]>([]);

  const handleTextChange = useCallback((newText: string) => {
    setText(newText);
    
    const currentWordCount = countWords(newText);
    setWordCount(currentWordCount);

    // Start timing on first character
    if (!typingStartTime.current && newText.length > 0) {
      typingStartTime.current = Date.now();
      lastWordCount.current = 0;
    }

    // Calculate WPM based on recent typing
    if (typingStartTime.current && currentWordCount > lastWordCount.current) {
      const elapsedSeconds = (Date.now() - typingStartTime.current) / 1000;
      const currentWpm = calculateWPM(currentWordCount, elapsedSeconds);
      
      // Smooth WPM with rolling average
      wpmHistory.current.push(currentWpm);
      if (wpmHistory.current.length > 5) {
        wpmHistory.current.shift();
      }
      
      const avgWpm = Math.round(
        wpmHistory.current.reduce((a, b) => a + b, 0) / wpmHistory.current.length
      );
      setWpm(avgWpm);
      lastWordCount.current = currentWordCount;
    }

    // Detect emotion
    const detectedEmotion = detectEmotion(newText, wpm);
    setEmotion(detectedEmotion);
  }, [wpm]);

  const resetEmotion = useCallback(() => {
    setEmotion('neutral');
    setText('');
    setWpm(0);
    setWordCount(0);
    typingStartTime.current = null;
    lastWordCount.current = 0;
    wpmHistory.current = [];
  }, []);

  // Decay WPM if user stops typing
  useEffect(() => {
    const interval = setInterval(() => {
      if (wpm > 0 && typingStartTime.current) {
        const timeSinceStart = (Date.now() - typingStartTime.current) / 1000;
        if (timeSinceStart > 3) {
          setWpm(prev => Math.max(0, prev - 5));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [wpm]);

  return {
    emotion,
    text,
    wpm,
    wordCount,
    setText: handleTextChange,
    resetEmotion
  };
}

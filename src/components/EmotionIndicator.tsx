import { motion, AnimatePresence } from 'framer-motion';
import { Emotion } from '@/lib/emotionDetector';

interface EmotionIndicatorProps {
  emotion: Emotion;
  wpm: number;
  wordCount: number;
}

const emotionEmoji: Record<Emotion, string> = {
  neutral: '○',
  angry: '◆',
  sad: '◇',
  happy: '★',
  anxious: '◈',
  manic: '✦',
  confused: '◎'
};

const emotionColorClass: Record<Emotion, string> = {
  neutral: 'text-emotion-neutral',
  angry: 'text-emotion-angry',
  sad: 'text-emotion-sad',
  happy: 'text-emotion-happy',
  anxious: 'text-emotion-anxious',
  manic: 'text-emotion-manic',
  confused: 'text-emotion-confused'
};

export function EmotionIndicator({ emotion, wpm, wordCount }: EmotionIndicatorProps) {
  return (
    <motion.div
      className="flex items-center gap-6 text-sm text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Emotion indicator */}
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.span
            key={emotion}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className={`text-xl ${emotionColorClass[emotion]}`}
          >
            {emotionEmoji[emotion]}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={emotion}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="capitalize"
          >
            {emotion}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* WPM indicator */}
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{
            scale: wpm > 60 ? [1, 1.5, 1] : 1,
            opacity: wpm > 0 ? 1 : 0.3
          }}
          transition={{ duration: 0.5, repeat: wpm > 60 ? Infinity : 0 }}
        />
        <span>{wpm} WPM</span>
      </div>

      {/* Word count */}
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground/50">|</span>
        <span>{wordCount} words</span>
      </div>
    </motion.div>
  );
}

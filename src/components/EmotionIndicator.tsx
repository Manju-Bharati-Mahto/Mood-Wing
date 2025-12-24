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
  fearful: '◐',
  manic: '✦',
  confused: '◎',
  frustrated: '▣',
  lonely: '♡',
  peaceful: '◯',
  grateful: '❖',
  hopeful: '☀',
  loving: '♥',
  proud: '▲',
  excited: '✧',
  amused: '☺',
  content: '●',
  jealous: '◉',
  guilty: '▽',
  ashamed: '◌',
  disgusted: '✕',
  bitter: '◬',
  resentful: '▧',
  envious: '◍',
  nostalgic: '◔',
  melancholic: '◗',
  contemplative: '◑',
  curious: '◓',
  bored: '—',
  apathetic: '·',
  ecstatic: '✴',
  devastated: '✖',
  furious: '◆',
  terrified: '◒',
  awestruck: '✶'
};

const emotionColorClass: Record<Emotion, string> = {
  neutral: 'text-emotion-neutral',
  angry: 'text-emotion-angry',
  sad: 'text-emotion-sad',
  happy: 'text-emotion-happy',
  anxious: 'text-emotion-anxious',
  fearful: 'text-emotion-fearful',
  manic: 'text-emotion-manic',
  confused: 'text-emotion-confused',
  frustrated: 'text-emotion-frustrated',
  lonely: 'text-emotion-lonely',
  peaceful: 'text-emotion-peaceful',
  grateful: 'text-emotion-grateful',
  hopeful: 'text-emotion-hopeful',
  loving: 'text-emotion-loving',
  proud: 'text-emotion-proud',
  excited: 'text-emotion-excited',
  amused: 'text-emotion-amused',
  content: 'text-emotion-content',
  jealous: 'text-emotion-jealous',
  guilty: 'text-emotion-guilty',
  ashamed: 'text-emotion-ashamed',
  disgusted: 'text-emotion-disgusted',
  bitter: 'text-emotion-bitter',
  resentful: 'text-emotion-resentful',
  envious: 'text-emotion-envious',
  nostalgic: 'text-emotion-nostalgic',
  melancholic: 'text-emotion-melancholic',
  contemplative: 'text-emotion-contemplative',
  curious: 'text-emotion-curious',
  bored: 'text-emotion-bored',
  apathetic: 'text-emotion-apathetic',
  ecstatic: 'text-emotion-ecstatic',
  devastated: 'text-emotion-devastated',
  furious: 'text-emotion-furious',
  terrified: 'text-emotion-terrified',
  awestruck: 'text-emotion-awestruck'
};

export function EmotionIndicator({ emotion, wpm, wordCount }: EmotionIndicatorProps) {
  return (
    <motion.div
      className="flex items-center gap-6 text-sm text-muted-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
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

      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground/50">|</span>
        <span>{wordCount} words</span>
      </div>
    </motion.div>
  );
}

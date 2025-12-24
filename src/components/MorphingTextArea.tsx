import { motion } from 'framer-motion';
import { Emotion } from '@/lib/emotionDetector';

interface MorphingTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  emotion: Emotion;
  placeholder?: string;
}

const emotionStyles: Record<Emotion, {
  containerClass: string;
  textClass: string;
  placeholderText: string;
}> = {
  neutral: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-lg',
    placeholderText: 'Begin writing... let your thoughts flow freely.'
  },
  angry: {
    containerClass: 'max-w-4xl mx-auto',
    textClass: 'text-xl font-semibold tracking-tight',
    placeholderText: 'LET IT OUT.'
  },
  sad: {
    containerClass: 'max-w-sm mx-auto',
    textClass: 'text-base font-light tracking-wide',
    placeholderText: 'It\'s okay to feel this way...'
  },
  happy: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-lg',
    placeholderText: 'Capture this beautiful moment ✨'
  },
  anxious: {
    containerClass: 'max-w-xl mx-auto',
    textClass: 'text-base',
    placeholderText: 'Take a breath... write what comes.'
  },
  manic: {
    containerClass: 'w-full max-w-[95vw] mx-auto',
    textClass: 'text-2xl md:text-3xl font-bold tracking-tight',
    placeholderText: 'EVERYTHING IS POSSIBLE!!!'
  },
  confused: {
    containerClass: 'max-w-lg mx-auto',
    textClass: 'text-base italic',
    placeholderText: 'What\'s on your mind...?'
  }
};

const emotionGlowClass: Record<Emotion, string> = {
  neutral: 'emotion-glow-neutral',
  angry: 'emotion-glow-angry',
  sad: 'emotion-glow-sad',
  happy: 'emotion-glow-happy',
  anxious: 'emotion-glow-anxious',
  manic: 'emotion-glow-manic',
  confused: 'emotion-glow-confused'
};

const emotionBorderColor: Record<Emotion, string> = {
  neutral: 'border-emotion-neutral/30',
  angry: 'border-emotion-angry/50',
  sad: 'border-emotion-sad/30',
  happy: 'border-emotion-happy/40',
  anxious: 'border-emotion-anxious/40',
  manic: 'border-emotion-manic/60',
  confused: 'border-emotion-confused/30'
};

export function MorphingTextArea({ value, onChange, emotion }: MorphingTextAreaProps) {
  const styles = emotionStyles[emotion];
  const glowClass = emotionGlowClass[emotion];
  const borderClass = emotionBorderColor[emotion];

  return (
    <motion.div
      className={styles.containerClass}
      layout
      transition={{
        layout: { type: 'spring', stiffness: 200, damping: 30 }
      }}
    >
      <motion.div
        className={`
          relative rounded-2xl border-2 ${borderClass}
          bg-card/50 backdrop-blur-sm
          ${glowClass}
          ${emotion === 'sad' ? 'shadow-inner' : ''}
          ${emotion === 'manic' ? 'breathing' : ''}
          ${emotion === 'anxious' ? 'vibrate-subtle' : ''}
          transition-shadow duration-700
        `}
        layout
        animate={{
          borderRadius: emotion === 'sad' ? '2rem' : emotion === 'manic' ? '0.5rem' : '1rem'
        }}
      >
        {/* Inner glow effect */}
        <div 
          className={`
            absolute inset-0 rounded-2xl opacity-20
            ${emotion === 'happy' ? 'bg-gradient-to-br from-emotion-happy/20 to-transparent' : ''}
            ${emotion === 'manic' ? 'iridescent' : ''}
            ${emotion === 'angry' ? 'bg-gradient-to-t from-emotion-angry/10 to-transparent' : ''}
            pointer-events-none
          `}
        />

        <motion.textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={styles.placeholderText}
          className={`
            relative z-10 w-full min-h-[200px] p-6 md:p-8
            bg-transparent resize-none
            journal-prose text-foreground
            ${styles.textClass}
            placeholder:text-muted-foreground/50
            focus:outline-none focus:ring-0
            transition-all duration-500
          `}
          style={{
            minHeight: emotion === 'manic' ? '400px' : emotion === 'sad' ? '150px' : '200px'
          }}
          animate={{
            opacity: emotion === 'sad' ? 0.8 : 1
          }}
        />

        {/* Decorative corner elements for confused state */}
        {emotion === 'confused' && (
          <>
            <motion.div
              className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emotion-confused/50"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emotion-confused/50"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

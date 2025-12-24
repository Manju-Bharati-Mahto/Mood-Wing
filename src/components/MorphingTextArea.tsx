import { motion } from 'framer-motion';
import { Emotion } from '@/lib/emotionDetector';

interface MorphingTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  emotion: Emotion;
  placeholder?: string;
}

// Default style for emotions not specifically defined
const defaultEmotionStyle = {
  containerClass: 'max-w-2xl mx-auto',
  textClass: 'text-lg',
  placeholderText: 'Express yourself freely...'
};

const emotionStyles: Partial<Record<Emotion, {
  containerClass: string;
  textClass: string;
  placeholderText: string;
}>> = {
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
  fearful: {
    containerClass: 'max-w-md mx-auto',
    textClass: 'text-sm',
    placeholderText: 'You\'re safe here... write your fears.'
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
  },
  frustrated: {
    containerClass: 'max-w-xl mx-auto',
    textClass: 'text-lg font-medium',
    placeholderText: 'Vent it out... what\'s blocking you?'
  },
  lonely: {
    containerClass: 'max-w-xs mx-auto',
    textClass: 'text-sm font-light tracking-widest',
    placeholderText: 'You\'re not alone in feeling alone...'
  },
  peaceful: {
    containerClass: 'max-w-xl mx-auto',
    textClass: 'text-lg font-light',
    placeholderText: 'Embrace this moment of calm...'
  },
  grateful: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-lg',
    placeholderText: 'What are you thankful for today?'
  },
  hopeful: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-lg font-light',
    placeholderText: 'The future is bright...'
  },
  loving: {
    containerClass: 'max-w-xl mx-auto',
    textClass: 'text-lg italic',
    placeholderText: 'Express your love...'
  },
  proud: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-xl font-medium',
    placeholderText: 'Celebrate your achievement!'
  },
  excited: {
    containerClass: 'max-w-3xl mx-auto',
    textClass: 'text-xl font-semibold',
    placeholderText: 'What\'s got you excited?!'
  },
  amused: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-lg',
    placeholderText: 'Share what made you smile 😊'
  },
  content: {
    containerClass: 'max-w-xl mx-auto',
    textClass: 'text-base',
    placeholderText: 'Enjoying the moment...'
  },
  jealous: {
    containerClass: 'max-w-lg mx-auto',
    textClass: 'text-base',
    placeholderText: 'It\'s okay to acknowledge these feelings...'
  },
  guilty: {
    containerClass: 'max-w-md mx-auto',
    textClass: 'text-base font-light',
    placeholderText: 'Let yourself process this...'
  },
  ashamed: {
    containerClass: 'max-w-sm mx-auto',
    textClass: 'text-sm',
    placeholderText: 'This is a safe space...'
  },
  disgusted: {
    containerClass: 'max-w-lg mx-auto',
    textClass: 'text-base font-medium',
    placeholderText: 'What\'s bothering you?'
  },
  nostalgic: {
    containerClass: 'max-w-xl mx-auto',
    textClass: 'text-lg italic font-light',
    placeholderText: 'Remember when...'
  },
  melancholic: {
    containerClass: 'max-w-md mx-auto',
    textClass: 'text-base font-light tracking-wide',
    placeholderText: 'There\'s beauty in sadness...'
  },
  contemplative: {
    containerClass: 'max-w-xl mx-auto',
    textClass: 'text-base font-light',
    placeholderText: 'What are you thinking about...'
  },
  curious: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-lg',
    placeholderText: 'What are you wondering about?'
  },
  bored: {
    containerClass: 'max-w-lg mx-auto',
    textClass: 'text-base',
    placeholderText: '...'
  },
  apathetic: {
    containerClass: 'max-w-md mx-auto',
    textClass: 'text-sm opacity-60',
    placeholderText: 'whatever...'
  },
  ecstatic: {
    containerClass: 'w-full max-w-[95vw] mx-auto',
    textClass: 'text-2xl md:text-3xl font-bold',
    placeholderText: 'THIS IS THE BEST!!!'
  },
  devastated: {
    containerClass: 'max-w-xs mx-auto',
    textClass: 'text-sm font-light',
    placeholderText: 'It\'s okay to fall apart...'
  },
  furious: {
    containerClass: 'max-w-4xl mx-auto',
    textClass: 'text-2xl font-bold uppercase tracking-tight',
    placeholderText: 'WHAT HAPPENED?!'
  },
  terrified: {
    containerClass: 'max-w-sm mx-auto',
    textClass: 'text-xs tracking-wide',
    placeholderText: 'breathe... you\'re safe...'
  },
  awestruck: {
    containerClass: 'max-w-2xl mx-auto',
    textClass: 'text-xl font-light',
    placeholderText: 'Describe what amazed you...'
  }
};

const getEmotionStyle = (emotion: Emotion) => {
  return emotionStyles[emotion] || defaultEmotionStyle;
};

export function MorphingTextArea({ value, onChange, emotion }: MorphingTextAreaProps) {
  const styles = getEmotionStyle(emotion);

  // Determine special effects based on emotion
  const isIntense = ['manic', 'ecstatic', 'furious'].includes(emotion);
  const isSad = ['sad', 'melancholic', 'devastated', 'lonely'].includes(emotion);
  const isAnxious = ['anxious', 'terrified', 'fearful'].includes(emotion);
  const isCalm = ['peaceful', 'content', 'contemplative'].includes(emotion);

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
          relative rounded-2xl border-2 border-emotion-${emotion}/30
          bg-card/50 backdrop-blur-sm
          emotion-glow-${emotion}
          ${isSad ? 'shadow-inner' : ''}
          ${isIntense ? 'breathing' : ''}
          ${isAnxious ? 'vibrate-subtle' : ''}
          transition-shadow duration-700
        `}
        layout
        animate={{
          borderRadius: isSad ? '2rem' : isIntense ? '0.5rem' : '1rem'
        }}
      >
        <div 
          className={`
            absolute inset-0 rounded-2xl opacity-20
            ${['happy', 'ecstatic', 'excited'].includes(emotion) ? `bg-gradient-to-br from-emotion-${emotion}/20 to-transparent` : ''}
            ${isIntense ? 'iridescent' : ''}
            ${['angry', 'furious'].includes(emotion) ? `bg-gradient-to-t from-emotion-${emotion}/10 to-transparent` : ''}
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
            minHeight: isIntense ? '400px' : isSad ? '150px' : isCalm ? '250px' : '200px'
          }}
          animate={{
            opacity: isSad ? 0.8 : 1
          }}
        />

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

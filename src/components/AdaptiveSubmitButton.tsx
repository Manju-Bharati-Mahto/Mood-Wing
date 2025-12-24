import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Flame, CloudRain, Sparkles, AlertCircle, Zap, HelpCircle } from 'lucide-react';
import { Emotion } from '@/lib/emotionDetector';

interface AdaptiveSubmitButtonProps {
  emotion: Emotion;
  onSubmit: () => void;
  disabled?: boolean;
}

const emotionIcons: Record<Emotion, React.ReactNode> = {
  neutral: <Send className="w-5 h-5" />,
  angry: <Flame className="w-6 h-6" />,
  sad: <CloudRain className="w-4 h-4" />,
  happy: <Sparkles className="w-5 h-5" />,
  anxious: <AlertCircle className="w-5 h-5" />,
  manic: <Zap className="w-7 h-7" />,
  confused: <HelpCircle className="w-5 h-5" />
};

const emotionLabels: Record<Emotion, string> = {
  neutral: 'Save Entry',
  angry: 'RELEASE',
  sad: 'let go...',
  happy: 'Capture Joy',
  anxious: 'Breathe & Save',
  manic: 'SUBMIT!!!',
  confused: 'Save anyway?'
};

export function AdaptiveSubmitButton({ emotion, onSubmit, disabled }: AdaptiveSubmitButtonProps) {
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressProgress, setLongPressProgress] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [isCalm, setIsCalm] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const calmTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const lastMouseMove = useRef<number>(Date.now());
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (calmTimer.current) clearTimeout(calmTimer.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  // Reset button position when emotion changes
  useEffect(() => {
    setButtonPosition({ x: 0, y: 0 });
    setIsCalm(false);
  }, [emotion]);

  // Anxious button evasion logic
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (emotion !== 'anxious' || isCalm) return;

    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2 + buttonPosition.x;
    const buttonCenterY = rect.top + rect.height / 2 + buttonPosition.y;

    const distance = Math.sqrt(
      Math.pow(e.clientX - buttonCenterX, 2) + 
      Math.pow(e.clientY - buttonCenterY, 2)
    );

    if (distance < 100) {
      const angle = Math.atan2(buttonCenterY - e.clientY, buttonCenterX - e.clientX);
      const moveDistance = 30;
      
      setButtonPosition(prev => ({
        x: Math.max(-100, Math.min(100, prev.x + Math.cos(angle) * moveDistance)),
        y: Math.max(-50, Math.min(50, prev.y + Math.sin(angle) * moveDistance))
      }));
    }

    lastMouseMove.current = Date.now();
    
    // Start calm timer
    if (calmTimer.current) clearTimeout(calmTimer.current);
    calmTimer.current = setTimeout(() => {
      setIsCalm(true);
      setButtonPosition({ x: 0, y: 0 });
    }, 2000);
  }, [emotion, isCalm, buttonPosition]);

  // Long press for angry state
  const handleMouseDown = useCallback(() => {
    if (emotion === 'angry' && !disabled) {
      setIsLongPressing(true);
      
      progressInterval.current = setInterval(() => {
        setLongPressProgress(prev => {
          if (prev >= 100) {
            if (progressInterval.current) clearInterval(progressInterval.current);
            onSubmit();
            return 0;
          }
          return prev + 6.67; // 100% over 1.5 seconds
        });
      }, 100);
    }
  }, [emotion, disabled, onSubmit]);

  const handleMouseUp = useCallback(() => {
    setIsLongPressing(false);
    setLongPressProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
  }, []);

  const handleClick = useCallback(() => {
    if (emotion !== 'angry' && !disabled) {
      onSubmit();
    }
  }, [emotion, disabled, onSubmit]);

  // Get button styles based on emotion
  const getButtonStyles = () => {
    const baseStyles = "relative flex items-center justify-center gap-2 font-medium transition-all duration-500 overflow-hidden";
    
    switch (emotion) {
      case 'angry':
        return `${baseStyles} w-48 h-20 md:w-64 md:h-24 rounded-xl bg-emotion-angry text-foreground shake-violent`;
      case 'sad':
        return `${baseStyles} px-6 py-2 rounded-full bg-emotion-sad/60 text-foreground/80 opacity-70 hover:opacity-100`;
      case 'happy':
        return `${baseStyles} px-8 py-4 rounded-2xl bg-gradient-to-r from-emotion-happy to-emotion-happy/80 text-primary-foreground float-gentle`;
      case 'anxious':
        return `${baseStyles} px-6 py-3 rounded-lg bg-emotion-anxious/80 text-primary-foreground pulse-glow`;
      case 'manic':
        return `${baseStyles} px-10 py-5 rounded-lg bg-emotion-manic text-foreground text-xl font-bold iridescent`;
      case 'confused':
        return `${baseStyles} px-6 py-3 rounded-lg bg-emotion-confused/60 text-foreground border-2 border-dashed border-emotion-confused`;
      default:
        return `${baseStyles} px-8 py-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90`;
    }
  };

  return (
    <div 
      className="relative flex justify-center mt-8"
      onMouseMove={handleMouseMove}
    >
      <motion.button
        ref={buttonRef}
        className={getButtonStyles()}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={disabled}
        animate={{
          x: buttonPosition.x,
          y: buttonPosition.y,
          scale: isLongPressing ? 0.95 : 1
        }}
        whileHover={emotion !== 'angry' && emotion !== 'anxious' ? { scale: 1.05 } : {}}
        whileTap={emotion !== 'angry' ? { scale: 0.95 } : {}}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25
        }}
      >
        {/* Long press progress bar for angry state */}
        {emotion === 'angry' && (
          <motion.div
            className="absolute inset-0 bg-foreground/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: longPressProgress / 100 }}
            style={{ transformOrigin: 'left' }}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.span
            key={emotion}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 relative z-10"
          >
            {emotionIcons[emotion]}
            <span>{emotion === 'angry' && isLongPressing ? 'Hold...' : emotionLabels[emotion]}</span>
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Instructions for angry state */}
      <AnimatePresence>
        {emotion === 'angry' && !isLongPressing && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-8 text-sm text-muted-foreground"
          >
            Hold to release (1.5s)
          </motion.p>
        )}
        {emotion === 'anxious' && !isCalm && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-8 text-sm text-muted-foreground"
          >
            Stop moving to calm down...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

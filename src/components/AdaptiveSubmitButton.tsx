import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Flame, CloudRain, Sparkles, AlertCircle, Zap, HelpCircle, Ban, Heart, Leaf, Gift, Sun, HeartHandshake, Trophy, PartyPopper, Smile, Coffee, Eye, Scale, EyeOff, Skull, Angry, ThumbsDown, Users, Clock, Compass, Search, Moon, Circle, Star, Frown, Skull as SkullIcon, Ghost, Wand } from 'lucide-react';
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
  fearful: <Ghost className="w-5 h-5" />,
  manic: <Zap className="w-7 h-7" />,
  confused: <HelpCircle className="w-5 h-5" />,
  frustrated: <Ban className="w-5 h-5" />,
  lonely: <Heart className="w-4 h-4" />,
  peaceful: <Leaf className="w-5 h-5" />,
  grateful: <Gift className="w-5 h-5" />,
  hopeful: <Sun className="w-5 h-5" />,
  loving: <HeartHandshake className="w-5 h-5" />,
  proud: <Trophy className="w-5 h-5" />,
  excited: <PartyPopper className="w-5 h-5" />,
  amused: <Smile className="w-5 h-5" />,
  content: <Coffee className="w-5 h-5" />,
  jealous: <Eye className="w-5 h-5" />,
  guilty: <Scale className="w-5 h-5" />,
  ashamed: <EyeOff className="w-5 h-5" />,
  disgusted: <Skull className="w-5 h-5" />,
  bitter: <Angry className="w-5 h-5" />,
  resentful: <ThumbsDown className="w-5 h-5" />,
  envious: <Users className="w-5 h-5" />,
  nostalgic: <Clock className="w-5 h-5" />,
  melancholic: <Moon className="w-5 h-5" />,
  contemplative: <Compass className="w-5 h-5" />,
  curious: <Search className="w-5 h-5" />,
  bored: <Circle className="w-5 h-5" />,
  apathetic: <Circle className="w-4 h-4" />,
  ecstatic: <Star className="w-6 h-6" />,
  devastated: <Frown className="w-5 h-5" />,
  furious: <Flame className="w-7 h-7" />,
  terrified: <Ghost className="w-6 h-6" />,
  awestruck: <Wand className="w-5 h-5" />
};

const emotionLabels: Record<Emotion, string> = {
  neutral: 'Save Entry',
  angry: 'RELEASE',
  sad: 'let go...',
  happy: 'Capture Joy',
  anxious: 'Breathe & Save',
  fearful: 'Face it...',
  manic: 'SUBMIT!!!',
  confused: 'Save anyway?',
  frustrated: 'Just Save It',
  lonely: 'reach out...',
  peaceful: 'Save calmly',
  grateful: 'Preserve thanks',
  hopeful: 'Save hope',
  loving: 'Save with love',
  proud: 'Save achievement',
  excited: 'Capture energy!',
  amused: 'Save the laughs',
  content: 'Gently save',
  jealous: 'Acknowledge it',
  guilty: 'Let it go...',
  ashamed: 'Save privately',
  disgusted: 'Express & save',
  bitter: 'Save honestly',
  resentful: 'Record feelings',
  envious: 'Save thoughts',
  nostalgic: 'Preserve memory',
  melancholic: 'embrace sadness...',
  contemplative: 'Capture thoughts',
  curious: 'Save discoveries',
  bored: 'whatever...',
  apathetic: '...',
  ecstatic: 'SAVE THIS MOMENT!!!',
  devastated: 'let it out...',
  furious: 'HOLD TO EXPLODE',
  terrified: 'Save quickly...',
  awestruck: 'Capture the awe'
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

  const requiresLongPress = emotion === 'angry' || emotion === 'furious';
  const isEvasive = emotion === 'anxious' || emotion === 'terrified';

  useEffect(() => {
    return () => {
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
      if (calmTimer.current) clearTimeout(calmTimer.current);
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  useEffect(() => {
    setButtonPosition({ x: 0, y: 0 });
    setIsCalm(false);
  }, [emotion]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isEvasive || isCalm) return;

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
      const moveDistance = emotion === 'terrified' ? 50 : 30;
      
      setButtonPosition(prev => ({
        x: Math.max(-100, Math.min(100, prev.x + Math.cos(angle) * moveDistance)),
        y: Math.max(-50, Math.min(50, prev.y + Math.sin(angle) * moveDistance))
      }));
    }

    lastMouseMove.current = Date.now();
    
    if (calmTimer.current) clearTimeout(calmTimer.current);
    calmTimer.current = setTimeout(() => {
      setIsCalm(true);
      setButtonPosition({ x: 0, y: 0 });
    }, 2000);
  }, [emotion, isCalm, buttonPosition, isEvasive]);

  const handleMouseDown = useCallback(() => {
    if (requiresLongPress && !disabled) {
      setIsLongPressing(true);
      
      progressInterval.current = setInterval(() => {
        setLongPressProgress(prev => {
          if (prev >= 100) {
            if (progressInterval.current) clearInterval(progressInterval.current);
            onSubmit();
            return 0;
          }
          return prev + 6.67;
        });
      }, 100);
    }
  }, [requiresLongPress, disabled, onSubmit]);

  const handleMouseUp = useCallback(() => {
    setIsLongPressing(false);
    setLongPressProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
  }, []);

  const handleClick = useCallback(() => {
    if (!requiresLongPress && !disabled) {
      onSubmit();
    }
  }, [requiresLongPress, disabled, onSubmit]);

  const getButtonStyles = () => {
    const baseStyles = "relative flex items-center justify-center gap-2 font-medium transition-all duration-500 overflow-hidden";
    
    switch (emotion) {
      case 'angry':
      case 'furious':
        return `${baseStyles} w-48 h-20 md:w-64 md:h-24 rounded-xl bg-emotion-${emotion} text-foreground shake-violent`;
      case 'sad':
      case 'melancholic':
      case 'devastated':
        return `${baseStyles} px-6 py-2 rounded-full bg-emotion-${emotion}/60 text-foreground/80 opacity-70 hover:opacity-100`;
      case 'happy':
      case 'ecstatic':
      case 'excited':
        return `${baseStyles} px-8 py-4 rounded-2xl bg-gradient-to-r from-emotion-${emotion} to-emotion-${emotion}/80 text-primary-foreground float-gentle`;
      case 'anxious':
      case 'terrified':
        return `${baseStyles} px-6 py-3 rounded-lg bg-emotion-${emotion}/80 text-primary-foreground pulse-glow`;
      case 'manic':
        return `${baseStyles} px-10 py-5 rounded-lg bg-emotion-manic text-foreground text-xl font-bold iridescent`;
      case 'confused':
        return `${baseStyles} px-6 py-3 rounded-lg bg-emotion-confused/60 text-foreground border-2 border-dashed border-emotion-confused`;
      case 'frustrated':
      case 'bitter':
      case 'resentful':
        return `${baseStyles} px-8 py-4 rounded-md bg-emotion-${emotion} text-foreground font-semibold`;
      case 'lonely':
        return `${baseStyles} px-5 py-2 rounded-full bg-emotion-lonely/50 text-foreground/70 text-sm`;
      case 'peaceful':
      case 'content':
        return `${baseStyles} px-8 py-4 rounded-full bg-emotion-${emotion}/70 text-foreground breathing`;
      case 'loving':
      case 'grateful':
        return `${baseStyles} px-8 py-4 rounded-2xl bg-emotion-${emotion} text-foreground`;
      case 'apathetic':
      case 'bored':
        return `${baseStyles} px-6 py-3 rounded-lg bg-muted text-muted-foreground opacity-50`;
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
        whileHover={!requiresLongPress && !isEvasive ? { scale: 1.05 } : {}}
        whileTap={!requiresLongPress ? { scale: 0.95 } : {}}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25
        }}
      >
        {requiresLongPress && (
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
            <span>{requiresLongPress && isLongPressing ? 'Hold...' : emotionLabels[emotion]}</span>
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {requiresLongPress && !isLongPressing && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-8 text-sm text-muted-foreground"
          >
            Hold to release (1.5s)
          </motion.p>
        )}
        {isEvasive && !isCalm && (
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

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy, Wind } from 'lucide-react';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const phaseConfig: Record<BreathPhase, { duration: number; label: string; instruction: string }> = {
  inhale: { duration: 4, label: 'Breathe In', instruction: 'Fill your lungs slowly' },
  hold: { duration: 4, label: 'Hold', instruction: 'Keep the breath in' },
  exhale: { duration: 6, label: 'Breathe Out', instruction: 'Release slowly' },
  rest: { duration: 2, label: 'Rest', instruction: 'Prepare for next breath' }
};

const phaseOrder: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest'];

const Breathe = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setCycleCount(0);
    setTotalSeconds(0);
    setShowCelebration(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPhaseProgress(prev => {
        const phaseDuration = phaseConfig[currentPhase].duration;
        const newProgress = prev + 0.05;
        
        if (newProgress >= phaseDuration) {
          // Move to next phase
          const currentIndex = phaseOrder.indexOf(currentPhase);
          const nextIndex = (currentIndex + 1) % phaseOrder.length;
          setCurrentPhase(phaseOrder[nextIndex]);
          
          // If completing a full cycle (back to inhale)
          if (nextIndex === 0) {
            setCycleCount(c => {
              const newCount = c + 1;
              if (newCount === 5 || newCount === 10) {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 2000);
              }
              return newCount;
            });
          }
          
          return 0;
        }
        return newProgress;
      });

      setTotalSeconds(prev => prev + 0.05);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, currentPhase]);

  const phaseDuration = phaseConfig[currentPhase].duration;
  const progressPercent = (phaseProgress / phaseDuration) * 100;
  
  // Calculate circle scale based on phase
  const getCircleScale = () => {
    const progress = phaseProgress / phaseDuration;
    switch (currentPhase) {
      case 'inhale':
        return 1 + (progress * 0.5); // 1 -> 1.5
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1.5 - (progress * 0.5); // 1.5 -> 1
      case 'rest':
        return 1;
      default:
        return 1;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const phaseColors: Record<BreathPhase, string> = {
    inhale: 'from-emotion-peaceful via-emotion-hopeful to-emotion-content',
    hold: 'from-emotion-contemplative via-emotion-peaceful to-emotion-grateful',
    exhale: 'from-emotion-content via-emotion-peaceful to-emotion-peaceful',
    rest: 'from-emotion-nostalgic via-emotion-melancholic to-emotion-contemplative'
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${phaseColors[currentPhase]} opacity-10`}
          animate={{ opacity: isPlaying ? 0.15 : 0.05 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[200px] opacity-20 bg-emotion-peaceful"
          style={{ left: '50%', top: '50%', x: '-50%', y: '-50%' }}
          animate={{
            scale: isPlaying ? [1, 1.2, 1] : 1,
            opacity: isPlaying ? [0.1, 0.2, 0.1] : 0.1
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Back</span>
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Cycles</p>
            <p className="text-lg font-medium text-foreground">{cycleCount}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Time</p>
            <p className="text-lg font-medium text-foreground">{formatTime(totalSeconds)}</p>
          </div>
        </div>
      </header>

      {/* Main breathing circle */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <motion.h1
          className="text-2xl sm:text-3xl font-light text-foreground mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Wind className="inline-block w-6 h-6 mr-2 text-emotion-peaceful" />
          Breathe Together
        </motion.h1>
        <p className="text-sm text-muted-foreground mb-12">
          Follow the circle to calm your mind
        </p>

        {/* Breathing circle container */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          {/* Outer ring progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="hsl(var(--emotion-peaceful))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48} ${2 * Math.PI * 48}`}
              strokeDashoffset={2 * Math.PI * 48 * (1 - progressPercent / 100)}
              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
            />
          </svg>

          {/* Inner breathing circle */}
          <motion.div
            className="absolute inset-8 sm:inset-10 rounded-full bg-gradient-to-br from-emotion-peaceful/30 via-emotion-content/20 to-emotion-hopeful/30 border border-emotion-peaceful/30 flex items-center justify-center"
            animate={{ scale: getCircleScale() }}
            transition={{ duration: 0.05, ease: 'linear' }}
          >
            <div className="text-center">
              <motion.p
                key={currentPhase}
                className="text-xl sm:text-2xl font-medium text-foreground mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {phaseConfig[currentPhase].label}
              </motion.p>
              <p className="text-xs text-muted-foreground">
                {phaseConfig[currentPhase].instruction}
              </p>
              <p className="text-2xl font-light text-emotion-peaceful mt-2">
                {Math.ceil(phaseDuration - phaseProgress)}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-12">
          <motion.button
            onClick={resetGame}
            className="p-3 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-6 rounded-full bg-emotion-peaceful/20 hover:bg-emotion-peaceful/30 border border-emotion-peaceful/30 text-emotion-peaceful transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </motion.button>

          <div className="w-11" /> {/* Spacer for symmetry */}
        </div>

        {/* Cycle milestones */}
        <div className="flex gap-2 mt-8">
          {[1, 2, 3, 4, 5].map((milestone) => (
            <motion.div
              key={milestone}
              className={`w-3 h-3 rounded-full border transition-colors ${
                cycleCount >= milestone
                  ? 'bg-emotion-peaceful border-emotion-peaceful'
                  : 'bg-transparent border-border'
              }`}
              animate={cycleCount >= milestone ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Complete 5 cycles for inner peace
        </p>
      </main>

      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-emotion-peaceful/20 backdrop-blur-sm rounded-2xl p-8 border border-emotion-peaceful/30 text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Trophy className="w-12 h-12 mx-auto mb-3 text-emotion-grateful" />
              <p className="text-xl font-medium text-foreground">
                {cycleCount === 5 ? 'Halfway there!' : 'Amazing!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {cycleCount} cycles completed
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-muted-foreground/60">
        Tip: Practice for 2-5 minutes when feeling anxious or overwhelmed
      </footer>
    </div>
  );
};

export default Breathe;
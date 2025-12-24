import { motion } from 'framer-motion';
import { useEmotionState } from '@/hooks/useEmotionState';
import { EmotionalAnchor } from '@/components/EmotionalAnchor';
import { MorphingTextArea } from '@/components/MorphingTextArea';
import { AdaptiveSubmitButton } from '@/components/AdaptiveSubmitButton';
import { EmotionIndicator } from '@/components/EmotionIndicator';
import { RainEffect } from '@/components/RainEffect';
import { CherryBlossomEffect } from '@/components/CherryBlossomEffect';
import { useToast } from '@/hooks/use-toast';
const emotionGradients: Record<string, string> = {
  neutral: 'from-background via-background to-background',
  angry: 'from-background via-emotion-angry/5 to-background',
  sad: 'from-background via-emotion-sad/5 to-background',
  happy: 'from-background via-emotion-happy/5 to-background',
  anxious: 'from-background via-emotion-anxious/5 to-background',
  manic: 'from-emotion-manic/10 via-background to-emotion-manic/5',
  confused: 'from-emotion-confused/5 via-background to-emotion-confused/5'
};
const Index = () => {
  const {
    emotion,
    text,
    wpm,
    wordCount,
    setText,
    resetEmotion
  } = useEmotionState();
  const {
    toast
  } = useToast();
  const handleSubmit = () => {
    if (text.trim().length === 0) {
      toast({
        title: "Empty entry",
        description: "Write something before saving.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Entry saved",
      description: `Your ${emotion} moment has been captured.`
    });
    resetEmotion();
  };
  return <motion.div className={`
        min-h-screen w-full flex flex-col
        bg-gradient-to-b ${emotionGradients[emotion]}
        transition-all duration-1000
      `} initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.8
  }}>
      {/* Emotional Anchor - Always fixed */}
      <EmotionalAnchor />

      {/* Weather/Nature Effects */}
      <RainEffect active={emotion === 'sad'} />
      <CherryBlossomEffect active={emotion === 'happy'} />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" animate={{
        x: emotion === 'manic' ? ['10%', '80%', '10%'] : ['20%', '30%', '20%'],
        y: emotion === 'anxious' ? ['10%', '60%', '10%'] : ['10%', '20%', '10%'],
        background: `hsl(var(--emotion-${emotion}))`,
        scale: emotion === 'manic' ? 1.5 : 1
      }} transition={{
        duration: emotion === 'manic' ? 3 : 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }} />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <motion.header className="text-center mb-12" initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
            <motion.h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-3" animate={{
            letterSpacing: emotion === 'manic' ? '0.1em' : emotion === 'sad' ? '0.2em' : '0.025em'
          }}>
              <span className="font-serif italic text-primary/80">Mood</span>
              <span className="text-muted-foreground/60 mx-2">·</span>
              <span>Wing</span>
            </motion.h1>
            <p className="text-sm text-muted-foreground/70">
              Write freely. The interface listens.
            </p>
          </motion.header>

          {/* Emotion Indicator */}
          <motion.div className="flex justify-center mb-8" layout>
            <EmotionIndicator emotion={emotion} wpm={wpm} wordCount={wordCount} />
          </motion.div>

          {/* Morphing TextArea */}
          <MorphingTextArea value={text} onChange={setText} emotion={emotion} />

          {/* Submit Button */}
          <AdaptiveSubmitButton emotion={emotion} onSubmit={handleSubmit} disabled={text.trim().length === 0} />
        </div>
      </main>

      {/* Footer hint */}
      <motion.footer className="relative z-10 text-center py-6 text-xs text-muted-foreground/40" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1
    }}>
        Try typing fast or slow · Use emotional keywords · Watch the UI respond
      </motion.footer>
    </motion.div>;
};
export default Index;
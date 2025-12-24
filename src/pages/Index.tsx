import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useEmotionState } from '@/hooks/useEmotionState';
import { EmotionalAnchor } from '@/components/EmotionalAnchor';
import { MorphingTextArea } from '@/components/MorphingTextArea';
import { AdaptiveSubmitButton } from '@/components/AdaptiveSubmitButton';
import { EmotionIndicator } from '@/components/EmotionIndicator';
import { RainEffect } from '@/components/RainEffect';
import { CherryBlossomEffect } from '@/components/CherryBlossomEffect';
import { SoothingAngerEffect } from '@/components/SoothingAngerEffect';
import { FallingLettersEffect } from '@/components/FallingLettersEffect';
import { EmotionCollection, type JournalEntry } from '@/components/EmotionCollection';
import { ProfileMenu } from '@/components/ProfileMenu';
import { StarfieldBackground } from '@/components/StarfieldBackground';
import { EmotionParticles } from '@/components/EmotionParticles';
import { AffirmationButton } from '@/components/AffirmationButton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Emotion } from '@/lib/emotionDetector';

const emotionGradients: Record<Emotion, string> = {
  neutral: 'from-background via-background to-background',
  angry: 'from-background via-emotion-angry/5 to-background',
  sad: 'from-background via-emotion-sad/5 to-background',
  happy: 'from-background via-emotion-happy/5 to-background',
  anxious: 'from-background via-emotion-anxious/5 to-background',
  fearful: 'from-background via-emotion-fearful/8 to-background',
  manic: 'from-emotion-manic/10 via-background to-emotion-manic/5',
  confused: 'from-emotion-confused/5 via-background to-emotion-confused/5',
  frustrated: 'from-background via-emotion-frustrated/8 to-background',
  lonely: 'from-emotion-lonely/5 via-background to-emotion-lonely/8',
  peaceful: 'from-emotion-peaceful/5 via-background to-emotion-peaceful/5',
  grateful: 'from-background via-emotion-grateful/5 to-background',
  hopeful: 'from-background via-emotion-hopeful/8 to-background',
  loving: 'from-emotion-loving/5 via-background to-emotion-loving/5',
  proud: 'from-background via-emotion-proud/8 to-background',
  excited: 'from-emotion-excited/8 via-background to-emotion-excited/5',
  amused: 'from-background via-emotion-amused/5 to-background',
  content: 'from-background via-emotion-content/5 to-background',
  jealous: 'from-emotion-jealous/5 via-background to-emotion-jealous/5',
  guilty: 'from-background via-emotion-guilty/5 to-background',
  ashamed: 'from-background via-emotion-ashamed/5 to-background',
  disgusted: 'from-emotion-disgusted/5 via-background to-emotion-disgusted/5',
  bitter: 'from-background via-emotion-bitter/5 to-background',
  resentful: 'from-emotion-resentful/5 via-background to-emotion-resentful/5',
  envious: 'from-emotion-envious/5 via-background to-emotion-envious/5',
  nostalgic: 'from-emotion-nostalgic/8 via-background to-emotion-nostalgic/5',
  melancholic: 'from-emotion-melancholic/5 via-background to-emotion-melancholic/8',
  contemplative: 'from-background via-emotion-contemplative/5 to-background',
  curious: 'from-background via-emotion-curious/5 to-background',
  bored: 'from-background via-background to-background',
  apathetic: 'from-background via-background to-background',
  ecstatic: 'from-emotion-ecstatic/10 via-background to-emotion-ecstatic/8',
  devastated: 'from-emotion-devastated/8 via-background to-emotion-devastated/5',
  furious: 'from-emotion-furious/10 via-background to-emotion-furious/5',
  terrified: 'from-emotion-terrified/8 via-background to-emotion-terrified/5',
  awestruck: 'from-emotion-awestruck/8 via-background to-emotion-awestruck/5'
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
  const { toast } = useToast();
  const { user } = useAuth();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const previousEmotionRef = useRef<Emotion>(emotion);

  // Fetch existing journal entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching entries:', error);
        toast({
          title: 'Error loading entries',
          description: 'Could not load your journal entries.',
          variant: 'destructive'
        });
      } else if (data) {
        setJournalEntries(data.map(entry => ({
          id: entry.id,
          text: entry.text,
          emotion: entry.emotion as Emotion,
          timestamp: new Date(entry.created_at)
        })));
      }
      setLoading(false);
    };

    fetchEntries();
  }, [user]);

  // Track emotion changes for sound triggers
  useEffect(() => {
    if (emotion !== previousEmotionRef.current && emotion !== 'neutral') {
      previousEmotionRef.current = emotion;
    }
  }, [emotion]);

  const handleSubmit = async () => {
    if (text.trim().length === 0) {
      toast({
        title: "Empty entry",
        description: "Write something before saving.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to save entries.",
        variant: "destructive"
      });
      return;
    }

    // Save to database
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        text: text.trim(),
        emotion: emotion
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error saving",
        description: "Could not save your entry. Please try again.",
        variant: "destructive"
      });
      return;
    }

    // Add to local state
    const newEntry: JournalEntry = {
      id: data.id,
      text: data.text,
      emotion: data.emotion as Emotion,
      timestamp: new Date(data.created_at)
    };
    setJournalEntries(prev => [newEntry, ...prev]);

    toast({
      title: "Entry saved",
      description: `Your ${emotion} moment has been captured.`
    });
    resetEmotion();
  };

  const handleDeleteEntry = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Error deleting',
        description: 'Could not delete the entry. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: 'Entry deleted',
      description: 'Your journal entry has been removed.'
    });
  };

  // Determine which effects to show
  const showStarfield = emotion === 'neutral' && text.trim().length === 0;
  const showRain = ['sad', 'melancholic', 'devastated'].includes(emotion);
  const showBlossoms = ['happy', 'ecstatic', 'excited', 'loving'].includes(emotion);
  const showAngerEffect = ['angry', 'furious'].includes(emotion);
  const showFallingLetters = ['frustrated', 'lonely', 'bitter', 'resentful'].includes(emotion);

  return (
    <motion.div 
      className={`
        min-h-screen w-full flex flex-col
        bg-gradient-to-b ${emotionGradients[emotion]}
        transition-all duration-1000
      `} 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <StarfieldBackground visible={showStarfield} />
      <ProfileMenu />
      <EmotionCollection entries={journalEntries} onDelete={handleDeleteEntry} />
      <AffirmationButton emotion={emotion} />
      <EmotionalAnchor />

      {/* Particle Effects */}
      <EmotionParticles emotion={emotion} />
      <RainEffect active={showRain} />
      <CherryBlossomEffect active={showBlossoms} />
      <SoothingAngerEffect active={showAngerEffect} />
      <FallingLettersEffect 
        active={showFallingLetters} 
        text={text} 
        emotion={emotion === 'frustrated' ? 'frustrated' : 'lonely'} 
      />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" 
          animate={{
            x: ['manic', 'ecstatic', 'excited'].includes(emotion) ? ['10%', '80%', '10%'] : ['20%', '30%', '20%'],
            y: ['anxious', 'terrified', 'fearful'].includes(emotion) ? ['10%', '60%', '10%'] : ['10%', '20%', '10%'],
            background: `hsl(var(--emotion-${emotion}))`,
            scale: ['manic', 'ecstatic', 'furious'].includes(emotion) ? 1.5 : 1
          }} 
          transition={{
            duration: ['manic', 'ecstatic'].includes(emotion) ? 3 : 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }} 
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-4xl mx-auto">
          <motion.header 
            className="text-center mb-12" 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-light tracking-tight text-foreground mb-3" 
              animate={{
                letterSpacing: ['manic', 'ecstatic'].includes(emotion) ? '0.1em' : ['sad', 'melancholic'].includes(emotion) ? '0.2em' : '0.025em'
              }}
            >
              <span className="font-serif italic text-primary/80">Mood</span>
              <span className="text-muted-foreground/60 mx-2">·</span>
              <span>Wing</span>
            </motion.h1>
            <p className="text-sm text-muted-foreground/70">
              Write freely. The interface listens.
            </p>
          </motion.header>

          <motion.div className="flex justify-center mb-8" layout>
            <EmotionIndicator emotion={emotion} wpm={wpm} wordCount={wordCount} />
          </motion.div>

          <MorphingTextArea value={text} onChange={setText} emotion={emotion} />
          <AdaptiveSubmitButton emotion={emotion} onSubmit={handleSubmit} disabled={text.trim().length === 0} />
        </div>
      </main>

      <motion.footer 
        className="relative z-10 text-center py-6 text-xs text-muted-foreground/40" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Try typing fast or slow · Use emotional keywords · Watch the UI respond
      </motion.footer>
    </motion.div>
  );
};

export default Index;

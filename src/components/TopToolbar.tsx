import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Gamepad2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Emotion } from '@/lib/emotionDetector';

interface TopToolbarProps {
  entriesCount: number;
  onOpenJournal: () => void;
  onOpenAffirmation: () => void;
  emotion: Emotion;
}

const emotionColors: Record<Emotion, string> = {
  neutral: 'bg-muted border-border',
  angry: 'bg-emotion-angry/10 border-emotion-angry/30',
  sad: 'bg-emotion-sad/10 border-emotion-sad/30',
  happy: 'bg-emotion-happy/10 border-emotion-happy/30',
  anxious: 'bg-emotion-anxious/10 border-emotion-anxious/30',
  fearful: 'bg-emotion-fearful/10 border-emotion-fearful/30',
  manic: 'bg-emotion-manic/10 border-emotion-manic/30',
  confused: 'bg-emotion-confused/10 border-emotion-confused/30',
  frustrated: 'bg-emotion-frustrated/10 border-emotion-frustrated/30',
  lonely: 'bg-emotion-lonely/10 border-emotion-lonely/30',
  peaceful: 'bg-emotion-peaceful/10 border-emotion-peaceful/30',
  grateful: 'bg-emotion-grateful/10 border-emotion-grateful/30',
  hopeful: 'bg-emotion-hopeful/10 border-emotion-hopeful/30',
  loving: 'bg-emotion-loving/10 border-emotion-loving/30',
  proud: 'bg-emotion-proud/10 border-emotion-proud/30',
  excited: 'bg-emotion-excited/10 border-emotion-excited/30',
  amused: 'bg-emotion-amused/10 border-emotion-amused/30',
  content: 'bg-emotion-content/10 border-emotion-content/30',
  jealous: 'bg-emotion-jealous/10 border-emotion-jealous/30',
  guilty: 'bg-emotion-guilty/10 border-emotion-guilty/30',
  ashamed: 'bg-emotion-ashamed/10 border-emotion-ashamed/30',
  disgusted: 'bg-emotion-disgusted/10 border-emotion-disgusted/30',
  bitter: 'bg-emotion-bitter/10 border-emotion-bitter/30',
  resentful: 'bg-emotion-resentful/10 border-emotion-resentful/30',
  envious: 'bg-emotion-envious/10 border-emotion-envious/30',
  nostalgic: 'bg-emotion-nostalgic/10 border-emotion-nostalgic/30',
  melancholic: 'bg-emotion-melancholic/10 border-emotion-melancholic/30',
  contemplative: 'bg-emotion-contemplative/10 border-emotion-contemplative/30',
  curious: 'bg-emotion-curious/10 border-emotion-curious/30',
  bored: 'bg-emotion-bored/10 border-emotion-bored/30',
  apathetic: 'bg-emotion-apathetic/10 border-emotion-apathetic/30',
  ecstatic: 'bg-emotion-ecstatic/10 border-emotion-ecstatic/30',
  devastated: 'bg-emotion-devastated/10 border-emotion-devastated/30',
  furious: 'bg-emotion-furious/10 border-emotion-furious/30',
  terrified: 'bg-emotion-terrified/10 border-emotion-terrified/30',
  awestruck: 'bg-emotion-awestruck/10 border-emotion-awestruck/30'
};

export function TopToolbar({ entriesCount, onOpenJournal, onOpenAffirmation, emotion }: TopToolbarProps) {
  const navigate = useNavigate();
  const entries = Array(Math.min(entriesCount, 3)).fill(null);

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      {/* Journal Button */}
      <motion.button
        onClick={onOpenJournal}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Open Journal"
      >
        <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        {entriesCount > 0 && (
          <span className="text-xs font-medium text-muted-foreground">
            {entriesCount}
          </span>
        )}
        
        {entriesCount > 0 && (
          <div className="absolute -bottom-1 -right-1 flex">
            {entries.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-4 rounded-sm border ${emotionColors[emotion]}`}
                style={{
                  marginLeft: index > 0 ? '-6px' : 0,
                  zIndex: index,
                  transform: `rotate(${(index - 1) * 5}deg)`
                }}
              />
            ))}
          </div>
        )}
      </motion.button>

      {/* Affirmation Button */}
      <motion.button
        onClick={onOpenAffirmation}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Get an affirmation"
      >
        <Sparkles className="w-5 h-5 text-emotion-hopeful group-hover:text-emotion-happy transition-colors" />
      </motion.button>

      {/* Breathing Game Button */}
      <motion.button
        onClick={() => navigate('/breathe')}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-emotion-peaceful/50 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Breathing Game"
      >
        <Gamepad2 className="w-5 h-5 text-emotion-peaceful group-hover:text-emotion-content transition-colors" />
      </motion.button>
    </div>
  );
}
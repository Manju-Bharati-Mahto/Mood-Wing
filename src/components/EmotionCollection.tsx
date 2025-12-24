import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Trash2 } from 'lucide-react';
import type { Emotion } from '@/lib/emotionDetector';

interface JournalEntry {
  id: string;
  text: string;
  emotion: Emotion;
  timestamp: Date;
}

interface EmotionCollectionProps {
  entries: JournalEntry[];
  onDelete?: (id: string) => void;
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

const emotionTextColors: Record<Emotion, string> = {
  neutral: 'text-foreground',
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

const emotionEmojis: Record<Emotion, string> = {
  neutral: '📝',
  angry: '🔥',
  sad: '🌧️',
  happy: '🌸',
  anxious: '💫',
  fearful: '👻',
  manic: '⚡',
  confused: '🌀',
  frustrated: '💢',
  lonely: '🌙',
  peaceful: '🍃',
  grateful: '🙏',
  hopeful: '🌅',
  loving: '💕',
  proud: '🏆',
  excited: '🎉',
  amused: '😄',
  content: '☕',
  jealous: '💚',
  guilty: '⚖️',
  ashamed: '😔',
  disgusted: '🤢',
  bitter: '🍋',
  resentful: '😤',
  envious: '👀',
  nostalgic: '📷',
  melancholic: '🌑',
  contemplative: '🧘',
  curious: '🔍',
  bored: '😐',
  apathetic: '💤',
  ecstatic: '✨',
  devastated: '💔',
  furious: '🌋',
  terrified: '😱',
  awestruck: '🤩'
};

export function EmotionCollection({ entries, onDelete }: EmotionCollectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    onDelete?.(id);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <BookOpen className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        {entries.length > 0 && (
          <span className="text-xs font-medium text-muted-foreground">
            {entries.length}
          </span>
        )}
        
        {entries.length > 0 && (
          <div className="absolute -bottom-1 -right-1 flex">
            {entries.slice(-3).map((entry, index) => (
              <motion.div
                key={entry.id}
                className={`w-3 h-4 rounded-sm border ${emotionColors[entry.emotion]}`}
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

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed top-0 left-0 z-50 h-full w-full max-w-md bg-background border-r border-border shadow-2xl overflow-hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-medium text-foreground">Emotion Journal</h2>
                  <p className="text-xs text-muted-foreground">{entries.length} entries captured</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <BookOpen className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-sm">No entries yet</p>
                    <p className="text-xs opacity-60">Write and save to collect your moods</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {entries.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        className={`relative p-4 rounded-xl border-2 ${emotionColors[entry.emotion]} transition-all hover:scale-[1.02]`}
                        initial={{ opacity: 0, x: -20, rotateZ: -2 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0, 
                          rotateZ: (index % 3 - 1) * 1.5 
                        }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          transformOrigin: 'center center'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-medium capitalize ${emotionTextColors[entry.emotion]}`}>
                            {emotionEmojis[entry.emotion]} {entry.emotion}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground/60">
                              {entry.timestamp.toLocaleDateString()} · {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(entry.id);
                              }}
                              disabled={deletingId === entry.id}
                              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground/60 hover:text-destructive transition-colors disabled:opacity-50"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
                          {entry.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export type { JournalEntry };

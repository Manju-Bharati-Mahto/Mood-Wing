import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X } from 'lucide-react';
import type { Emotion } from '@/lib/emotionDetector';

interface JournalEntry {
  id: string;
  text: string;
  emotion: Emotion;
  timestamp: Date;
}

interface EmotionCollectionProps {
  entries: JournalEntry[];
}

const emotionColors: Record<Emotion, string> = {
  neutral: 'bg-muted border-border',
  angry: 'bg-emotion-angry/10 border-emotion-angry/30',
  sad: 'bg-emotion-sad/10 border-emotion-sad/30',
  happy: 'bg-emotion-happy/10 border-emotion-happy/30',
  anxious: 'bg-emotion-anxious/10 border-emotion-anxious/30',
  manic: 'bg-emotion-manic/10 border-emotion-manic/30',
  confused: 'bg-emotion-confused/10 border-emotion-confused/30',
  frustrated: 'bg-emotion-frustrated/10 border-emotion-frustrated/30',
  lonely: 'bg-emotion-lonely/10 border-emotion-lonely/30'
};

const emotionTextColors: Record<Emotion, string> = {
  neutral: 'text-foreground',
  angry: 'text-emotion-angry',
  sad: 'text-emotion-sad',
  happy: 'text-emotion-happy',
  anxious: 'text-emotion-anxious',
  manic: 'text-emotion-manic',
  confused: 'text-emotion-confused',
  frustrated: 'text-emotion-frustrated',
  lonely: 'text-emotion-lonely'
};

const emotionEmojis: Record<Emotion, string> = {
  neutral: '📝',
  angry: '🔥',
  sad: '🌧️',
  happy: '🌸',
  anxious: '💫',
  manic: '⚡',
  confused: '🌀',
  frustrated: '💢',
  lonely: '🌙'
};

export function EmotionCollection({ entries }: EmotionCollectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Collection Icon Button */}
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
        
        {/* Stacked preview cards */}
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

      {/* Collection Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 left-0 z-50 h-full w-full max-w-md bg-background border-r border-border shadow-2xl overflow-hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Header */}
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

              {/* Entries Stack */}
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
                        {/* Emotion badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-xs font-medium capitalize ${emotionTextColors[entry.emotion]}`}>
                            {emotionEmojis[entry.emotion]} {entry.emotion}
                          </span>
                          <span className="text-xs text-muted-foreground/60">
                            {entry.timestamp.toLocaleDateString()} · {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        {/* Entry text */}
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

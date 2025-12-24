import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw } from 'lucide-react';

const affirmations = [
  "You are worthy of love and respect.",
  "Your feelings are valid.",
  "You are stronger than you think.",
  "This moment will pass.",
  "You are doing the best you can.",
  "It's okay to take things one step at a time.",
  "You deserve peace and happiness.",
  "Your voice matters.",
  "You are not alone in this.",
  "Every day is a fresh start.",
  "You are enough, just as you are.",
  "Your struggles don't define you.",
  "It's okay to ask for help.",
  "You are making progress, even if you can't see it.",
  "Be gentle with yourself today.",
  "You have survived difficult times before.",
  "Your presence makes a difference.",
  "It's okay to feel what you're feeling.",
  "You are capable of amazing things.",
  "Take a deep breath. You've got this.",
  "Your journey is unique and beautiful.",
  "Small steps still count as progress.",
  "You are allowed to set boundaries.",
  "Your mental health matters.",
  "Today, you choose to be kind to yourself."
];

export function AffirmationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState(() => 
    affirmations[Math.floor(Math.random() * affirmations.length)]
  );

  const getNewAffirmation = () => {
    let newAffirmation = currentAffirmation;
    while (newAffirmation === currentAffirmation) {
      newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    }
    setCurrentAffirmation(newAffirmation);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-20 z-50 flex items-center gap-2 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Get an affirmation"
      >
        <Sparkles className="w-5 h-5 text-emotion-hopeful group-hover:text-emotion-happy transition-colors" />
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
              className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="relative bg-gradient-to-br from-card via-card to-emotion-hopeful/10 rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emotion-hopeful/5 via-transparent to-emotion-peaceful/5 pointer-events-none" />
                
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 p-2 rounded-lg hover:bg-muted transition-colors z-10"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Content */}
                <div className="relative p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                  >
                    <Sparkles className="w-10 h-10 mx-auto mb-4 text-emotion-hopeful" />
                  </motion.div>
                  
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Today's Affirmation
                  </h3>
                  
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentAffirmation}
                      className="text-xl font-serif italic text-foreground leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      "{currentAffirmation}"
                    </motion.p>
                  </AnimatePresence>

                  <motion.button
                    onClick={getNewAffirmation}
                    className="mt-6 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">New affirmation</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

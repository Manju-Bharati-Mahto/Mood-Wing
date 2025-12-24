import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, RefreshCw } from 'lucide-react';
import type { Emotion } from '@/lib/emotionDetector';

interface AffirmationButtonProps {
  emotion: Emotion;
}

const emotionAffirmations: Record<string, string[]> = {
  // Angry emotions
  angry: [
    "It's okay to feel angry. Take a breath and let it pass.",
    "Your anger is valid, but it doesn't have to control you.",
    "This feeling is temporary. You are in control.",
    "Channel this energy into something positive.",
    "Anger is a messenger. What is it trying to tell you?"
  ],
  furious: [
    "Even in rage, you have the power to choose your response.",
    "This intense feeling will fade. Hold on.",
    "Your emotions are valid, but they don't define you.",
    "Take a moment. Breathe. You've got this.",
    "Let this fire transform, not consume you."
  ],
  frustrated: [
    "Frustration means you care. That's a strength.",
    "Every obstacle is a stepping stone.",
    "You've overcome challenges before. You will again.",
    "It's okay to take a break and come back stronger.",
    "Progress isn't always visible, but it's happening."
  ],
  
  // Sad emotions
  sad: [
    "It's okay to feel sad. Your feelings matter.",
    "This sadness will lift. Brighter days are coming.",
    "You are not alone in this feeling.",
    "Be gentle with yourself today.",
    "Tears are not weakness. They're release."
  ],
  melancholic: [
    "There's beauty in melancholy. Feel it fully.",
    "This bittersweet feeling will pass.",
    "You are allowed to sit with this feeling.",
    "Melancholy often brings deep wisdom.",
    "Let yourself feel. It's part of healing."
  ],
  devastated: [
    "Even in your darkest moment, you are not alone.",
    "This pain is temporary, even if it doesn't feel that way.",
    "You are stronger than you know.",
    "It's okay to fall apart. You will rebuild.",
    "Reach out. Someone cares about you."
  ],
  lonely: [
    "Loneliness is a feeling, not a fact.",
    "You are more connected than you realize.",
    "Reaching out is a sign of strength.",
    "This isolation is temporary.",
    "You matter to more people than you know."
  ],
  
  // Anxious emotions
  anxious: [
    "Breathe. This moment will pass.",
    "You've handled anxiety before. You can do it again.",
    "Focus on what you can control right now.",
    "Your worries are valid, but they're not predictions.",
    "One step at a time. You've got this."
  ],
  fearful: [
    "Fear is just excitement without breath.",
    "You are safe in this moment.",
    "Courage isn't absence of fear, it's moving forward anyway.",
    "This fear is trying to protect you, but you are okay.",
    "Take a deep breath. You are stronger than your fears."
  ],
  terrified: [
    "You are safe. Breathe slowly.",
    "This intense fear will subside.",
    "Ground yourself: 5 things you see, 4 you hear, 3 you touch...",
    "You have survived scary moments before.",
    "Reach out to someone you trust."
  ],
  
  // Happy emotions
  happy: [
    "Savor this joy. You deserve it!",
    "Happiness looks beautiful on you.",
    "Let this feeling fill you completely.",
    "Remember this moment when days are harder.",
    "Your joy is contagious. Share it!"
  ],
  ecstatic: [
    "What an incredible feeling! Ride this wave!",
    "You are glowing with joy!",
    "This moment is yours. Celebrate it!",
    "Let yourself feel this fully!",
    "Pure joy is a gift. Embrace it!"
  ],
  excited: [
    "Your excitement is energy for great things!",
    "Channel this energy into your dreams!",
    "What a wonderful feeling to be alive!",
    "Let this enthusiasm carry you forward!",
    "The anticipation is part of the joy!"
  ],
  loving: [
    "Love is your superpower.",
    "Your heart is so full. That's beautiful.",
    "Love freely. It multiplies when shared.",
    "You are worthy of the love you give.",
    "This love you feel is precious."
  ],
  grateful: [
    "Gratitude transforms everything.",
    "Your thankful heart is a gift.",
    "Notice the small blessings today.",
    "Gratitude opens doors to more abundance.",
    "Thank you for recognizing the good."
  ],
  hopeful: [
    "Hope is the light that guides us forward.",
    "Your optimism is powerful.",
    "Better days are truly ahead.",
    "Hope is a choice, and you're choosing well.",
    "This hope you feel is not naive—it's brave."
  ],
  proud: [
    "You should be proud! You've earned this.",
    "Celebrate your accomplishments!",
    "Your hard work is paying off.",
    "It's okay to feel proud of yourself.",
    "You did that! Amazing!"
  ],
  peaceful: [
    "Breathe in this calm. You deserve it.",
    "Peace is your natural state.",
    "Carry this serenity with you.",
    "This tranquility is healing you.",
    "In stillness, you find strength."
  ],
  content: [
    "Contentment is true wealth.",
    "This is enough. You are enough.",
    "Savor this simple satisfaction.",
    "Peace in the present moment is beautiful.",
    "Contentment is wisdom in action."
  ],
  amused: [
    "Laughter is medicine for the soul!",
    "Joy in small things is a gift.",
    "Keep finding reasons to smile!",
    "Your sense of humor serves you well.",
    "Life is better when we can laugh."
  ],
  awestruck: [
    "Wonder keeps life magical.",
    "Stay amazed by the world around you.",
    "Awe connects us to something bigger.",
    "Never lose this sense of wonder.",
    "The universe is truly incredible."
  ],
  
  // Negative emotions
  jealous: [
    "Jealousy often points to what we truly want.",
    "Your feelings are valid. Now, what do they teach you?",
    "Comparison is the thief of joy. Focus on your path.",
    "Someone else's success doesn't diminish yours.",
    "Use this feeling as motivation, not destruction."
  ],
  guilty: [
    "Guilt shows you have a conscience. That's good.",
    "You can make amends. It's not too late.",
    "Learn from this, then let it go.",
    "Self-forgiveness is part of growth.",
    "Everyone makes mistakes. You're human."
  ],
  ashamed: [
    "Shame thrives in silence. You are not alone.",
    "Your worth is not defined by your mistakes.",
    "It takes courage to face these feelings.",
    "You deserve compassion, especially from yourself.",
    "This feeling will pass. You are more than this moment."
  ],
  disgusted: [
    "Your boundaries are valid.",
    "It's okay to reject what doesn't serve you.",
    "Trust your instincts.",
    "Distance from toxic things is healthy.",
    "Your standards matter."
  ],
  bitter: [
    "Bitterness is a sign of unhealed wounds.",
    "You deserve to let go and find peace.",
    "Holding on hurts you most.",
    "Release isn't forgetting, it's freeing yourself.",
    "You are worthy of moving forward."
  ],
  resentful: [
    "Resentment is a heavy burden. You can set it down.",
    "Healing is possible, one step at a time.",
    "Your feelings are valid. Now, how can you heal?",
    "Forgiveness is a gift you give yourself.",
    "You deserve peace more than you deserve revenge."
  ],
  envious: [
    "What you admire in others exists in you too.",
    "Their success is not your failure.",
    "Focus on your own garden.",
    "Envy can become inspiration.",
    "Your journey is uniquely yours."
  ],
  
  // Subtle emotions
  nostalgic: [
    "Beautiful memories shape who you are.",
    "The past is a gift, not a prison.",
    "Those moments live on in your heart.",
    "Honor the past while embracing now.",
    "Nostalgia reminds us of what matters."
  ],
  contemplative: [
    "Deep thinking is a sign of wisdom.",
    "Take your time to process.",
    "Reflection leads to clarity.",
    "Your thoughtfulness is a strength.",
    "The answers will come."
  ],
  curious: [
    "Curiosity is the key to growth.",
    "Keep asking questions!",
    "Your wonder keeps you young.",
    "Explore freely. That's how we learn.",
    "The curious mind is never bored."
  ],
  confused: [
    "Confusion is the beginning of understanding.",
    "It's okay not to have all the answers.",
    "Clarity will come. Be patient.",
    "Ask for help when you need it.",
    "Uncertainty is part of the journey."
  ],
  bored: [
    "Boredom is a call for creativity.",
    "What would make this moment interesting?",
    "Rest is productive too.",
    "Sometimes we need stillness before action.",
    "Use this time to dream."
  ],
  apathetic: [
    "It's okay to feel disconnected sometimes.",
    "This numbness won't last forever.",
    "Start small. One tiny spark.",
    "You don't have to feel everything right now.",
    "Reaching out is a first step."
  ],
  
  // Default/neutral
  neutral: [
    "You are worthy of love and respect.",
    "Your feelings are valid.",
    "You are stronger than you think.",
    "This moment is yours.",
    "You are doing the best you can.",
    "It's okay to take things one step at a time.",
    "You deserve peace and happiness.",
    "Your voice matters.",
    "You are not alone in this.",
    "Every day is a fresh start.",
    "You are enough, just as you are.",
    "Your presence makes a difference.",
    "Be gentle with yourself today.",
    "You are capable of amazing things.",
    "Take a deep breath. You've got this."
  ],
  
  // Manic
  manic: [
    "Your energy is powerful. Channel it wisely.",
    "Remember to rest between the bursts.",
    "Ground yourself. You've got this.",
    "Pace yourself. There's time.",
    "Harness this energy for good."
  ]
};

export function AffirmationButton({ emotion }: AffirmationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  const getAffirmationsForEmotion = () => {
    return emotionAffirmations[emotion] || emotionAffirmations.neutral;
  };

  const getNewAffirmation = () => {
    const affirmations = getAffirmationsForEmotion();
    let newAffirmation = currentAffirmation;
    // Ensure we get a different affirmation
    let attempts = 0;
    while (newAffirmation === currentAffirmation && attempts < 10) {
      newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
      attempts++;
    }
    setCurrentAffirmation(newAffirmation);
  };

  // Update affirmation when emotion changes or modal opens
  useEffect(() => {
    if (isOpen) {
      getNewAffirmation();
    }
  }, [emotion, isOpen]);

  // Initialize with a random affirmation
  useEffect(() => {
    const affirmations = getAffirmationsForEmotion();
    setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-[4.5rem] sm:left-20 z-50 flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Get an affirmation"
      >
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emotion-hopeful group-hover:text-emotion-happy transition-colors" />
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
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 z-50 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 flex items-center justify-center sm:block"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="relative w-full bg-gradient-to-br from-card via-card to-emotion-hopeful/10 rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
                {/* Decorative glow based on emotion */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, hsl(var(--emotion-${emotion})) 0%, transparent 60%)`
                  }}
                />
                
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 p-2 rounded-lg hover:bg-muted transition-colors z-10"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Content */}
                <div className="relative p-6 sm:p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                  >
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 sm:mb-4 text-emotion-hopeful" />
                  </motion.div>
                  
                  <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: `hsl(var(--emotion-${emotion}) / 0.2)`,
                        color: `hsl(var(--emotion-${emotion}))`
                      }}
                    >
                      {emotion}
                    </span>
                    <span className="text-xs text-muted-foreground">affirmation</span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentAffirmation}
                      className="text-lg sm:text-xl font-serif italic text-foreground leading-relaxed min-h-[4rem] flex items-center justify-center"
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
                    className="mt-4 sm:mt-6 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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

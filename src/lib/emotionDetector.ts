export type Emotion = 'neutral' | 'angry' | 'sad' | 'happy' | 'anxious' | 'manic' | 'confused';

interface EmotionKeywords {
  [key: string]: string[];
}

const emotionKeywords: EmotionKeywords = {
  angry: ['hate', 'furious', 'rage', 'angry', 'frustrated', 'annoyed', 'pissed', 'mad', 'livid', 'fuming', 'outraged', 'hostile'],
  happy: ['love', 'great', 'amazing', 'wonderful', 'joy', 'happy', 'excited', 'grateful', 'blessed', 'fantastic', 'awesome', 'beautiful', 'thrilled'],
  sad: ['sad', 'lonely', 'depressed', 'crying', 'hurt', 'pain', 'hopeless', 'empty', 'grief', 'heartbroken', 'miserable', 'devastated', 'tears'],
  anxious: ['worried', 'anxious', 'nervous', 'scared', 'fear', 'panic', 'stress', 'overwhelmed', 'dread', 'terrified', 'uneasy', 'restless'],
  confused: ['lost', 'why', 'confused', 'unsure', 'uncertain', 'bewildered', 'puzzled', 'perplexed', 'unclear', 'disoriented', 'what', 'how'],
  manic: ['incredible', 'unstoppable', 'genius', 'everything', 'brilliant', 'infinite', 'electric', 'wild', 'insane', 'crazy', 'intense']
};

export function detectEmotion(text: string, wpm: number): Emotion {
  const lowerText = text.toLowerCase();
  
  // Count keyword matches for each emotion
  const emotionScores: { [key in Emotion]: number } = {
    neutral: 0,
    angry: 0,
    happy: 0,
    sad: 0,
    anxious: 0,
    manic: 0,
    confused: 0
  };

  // Calculate keyword matches
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        emotionScores[emotion as Emotion] += matches.length;
      }
    });
  });

  // Apply WPM modifiers
  if (wpm > 80) {
    emotionScores.manic += 2;
    emotionScores.angry += 1;
    emotionScores.anxious += 1;
  } else if (wpm < 30 && wpm > 0) {
    emotionScores.sad += 2;
    emotionScores.confused += 1;
  }

  // Check for exclamation marks (amplifies manic/angry)
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations >= 3) {
    emotionScores.manic += exclamations;
    emotionScores.angry += Math.floor(exclamations / 2);
  }

  // Check for question marks (amplifies confused)
  const questions = (text.match(/\?/g) || []).length;
  if (questions >= 2) {
    emotionScores.confused += questions;
  }

  // Check for ALL CAPS words (amplifies anger/manic)
  const capsWords = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
  if (capsWords >= 2) {
    emotionScores.angry += capsWords;
    emotionScores.manic += Math.floor(capsWords / 2);
  }

  // Find the dominant emotion
  let maxScore = 0;
  let dominantEmotion: Emotion = 'neutral';

  Object.entries(emotionScores).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion as Emotion;
    }
  });

  // Need at least some signal to change from neutral
  if (maxScore < 1) {
    return 'neutral';
  }

  return dominantEmotion;
}

export function calculateWPM(wordCount: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 1) return 0;
  return Math.round((wordCount / elapsedSeconds) * 60);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

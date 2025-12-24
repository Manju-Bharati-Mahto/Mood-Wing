export type Emotion = 
  // Basic emotions
  | 'neutral' | 'angry' | 'sad' | 'happy' | 'anxious' | 'fearful'
  // Complex emotions
  | 'manic' | 'confused' | 'frustrated' | 'lonely'
  // Positive spectrum
  | 'peaceful' | 'grateful' | 'hopeful' | 'loving' | 'proud' | 'excited' | 'amused' | 'content'
  // Negative spectrum
  | 'jealous' | 'guilty' | 'ashamed' | 'disgusted' | 'bitter' | 'resentful' | 'envious'
  // Subtle states
  | 'nostalgic' | 'melancholic' | 'contemplative' | 'curious' | 'bored' | 'apathetic'
  // Intense states
  | 'ecstatic' | 'devastated' | 'furious' | 'terrified' | 'awestruck';

interface EmotionKeywords {
  [key: string]: string[];
}

const emotionKeywords: EmotionKeywords = {
  // Basic emotions
  angry: ['hate', 'furious', 'rage', 'angry', 'annoyed', 'pissed', 'mad', 'livid', 'hostile'],
  happy: ['love', 'great', 'amazing', 'wonderful', 'joy', 'happy', 'excited', 'grateful', 'fantastic', 'awesome', 'beautiful'],
  sad: ['sad', 'depressed', 'crying', 'hurt', 'pain', 'hopeless', 'empty', 'grief', 'heartbroken', 'miserable', 'tears'],
  anxious: ['worried', 'anxious', 'nervous', 'stress', 'overwhelmed', 'uneasy', 'restless', 'tense', 'apprehensive'],
  fearful: ['scared', 'fear', 'panic', 'dread', 'frightened', 'alarmed', 'spooked', 'startled'],
  
  // Complex emotions
  manic: ['incredible', 'unstoppable', 'genius', 'everything', 'brilliant', 'infinite', 'electric', 'wild', 'insane', 'intense'],
  confused: ['lost', 'why', 'confused', 'unsure', 'uncertain', 'bewildered', 'puzzled', 'perplexed', 'unclear', 'what', 'how'],
  frustrated: ['frustrated', 'stuck', 'blocked', 'annoying', 'ugh', 'argh', 'impossible', 'pointless', 'useless', 'failing'],
  lonely: ['lonely', 'alone', 'isolated', 'abandoned', 'forgotten', 'invisible', 'nobody', 'disconnected', 'missing'],
  
  // Positive spectrum
  peaceful: ['calm', 'peace', 'serene', 'tranquil', 'relaxed', 'zen', 'harmony', 'quiet', 'still', 'gentle'],
  grateful: ['thankful', 'grateful', 'blessed', 'appreciate', 'fortunate', 'lucky', 'thanks', 'gratitude'],
  hopeful: ['hope', 'optimistic', 'looking forward', 'bright', 'possible', 'opportunity', 'promising', 'better'],
  loving: ['adore', 'cherish', 'affection', 'caring', 'tender', 'warmth', 'devotion', 'beloved', 'sweetheart'],
  proud: ['proud', 'accomplished', 'achievement', 'succeeded', 'victory', 'triumph', 'earned', 'deserved'],
  excited: ['thrilled', 'excited', 'cant wait', 'pumped', 'stoked', 'hyped', 'eager', 'anticipation'],
  amused: ['funny', 'hilarious', 'laughing', 'lol', 'haha', 'amusing', 'entertained', 'giggle', 'humor'],
  content: ['satisfied', 'content', 'comfortable', 'fine', 'okay', 'good', 'pleasant', 'cozy', 'nice'],
  
  // Negative spectrum
  jealous: ['jealous', 'envy', 'covet', 'want what', 'why them', 'unfair'],
  guilty: ['guilty', 'regret', 'sorry', 'apologize', 'fault', 'blame', 'wrong', 'mistake', 'shouldnt have'],
  ashamed: ['ashamed', 'embarrassed', 'humiliated', 'mortified', 'disgrace', 'shameful', 'cringe'],
  disgusted: ['disgusted', 'gross', 'revolting', 'repulsive', 'sickening', 'nauseating', 'vile', 'yuck'],
  bitter: ['bitter', 'resentment', 'grudge', 'spite', 'cynical', 'jaded', 'sour'],
  resentful: ['resentful', 'unforgiven', 'betrayed', 'wronged', 'cheated', 'used', 'taken advantage'],
  envious: ['envious', 'wish i had', 'they have', 'not fair', 'lucky them'],
  
  // Subtle states
  nostalgic: ['remember', 'memories', 'past', 'miss', 'used to', 'back then', 'old days', 'childhood', 'nostalgia'],
  melancholic: ['melancholy', 'wistful', 'bittersweet', 'longing', 'yearning', 'sorrow', 'pensive'],
  contemplative: ['thinking', 'pondering', 'wondering', 'reflecting', 'considering', 'mulling', 'introspecting'],
  curious: ['curious', 'interesting', 'wonder', 'fascinated', 'intrigued', 'exploring', 'discovering'],
  bored: ['bored', 'boring', 'tedious', 'dull', 'monotonous', 'uninteresting', 'blah', 'meh'],
  apathetic: ['whatever', 'dont care', 'indifferent', 'numb', 'detached', 'nothing matters', 'pointless'],
  
  // Intense states
  ecstatic: ['ecstatic', 'euphoric', 'bliss', 'elated', 'overjoyed', 'rapture', 'heaven', 'peak', 'best day'],
  devastated: ['devastated', 'destroyed', 'crushed', 'shattered', 'ruined', 'broken', 'lost everything'],
  furious: ['furious', 'seething', 'enraged', 'outraged', 'infuriated', 'raging', 'exploding'],
  terrified: ['terrified', 'petrified', 'horror', 'nightmare', 'trembling', 'paralyzed', 'frozen'],
  awestruck: ['awe', 'amazed', 'speechless', 'breathtaking', 'magnificent', 'incredible', 'stunning', 'wow']
};

export function detectEmotion(text: string, wpm: number): Emotion {
  const lowerText = text.toLowerCase();
  
  // Initialize all emotion scores
  const emotionScores: { [key in Emotion]: number } = {
    neutral: 0, angry: 0, sad: 0, happy: 0, anxious: 0, fearful: 0,
    manic: 0, confused: 0, frustrated: 0, lonely: 0,
    peaceful: 0, grateful: 0, hopeful: 0, loving: 0, proud: 0, excited: 0, amused: 0, content: 0,
    jealous: 0, guilty: 0, ashamed: 0, disgusted: 0, bitter: 0, resentful: 0, envious: 0,
    nostalgic: 0, melancholic: 0, contemplative: 0, curious: 0, bored: 0, apathetic: 0,
    ecstatic: 0, devastated: 0, furious: 0, terrified: 0, awestruck: 0
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
  if (wpm > 100) {
    emotionScores.manic += 3;
    emotionScores.furious += 2;
    emotionScores.ecstatic += 2;
    emotionScores.excited += 2;
  } else if (wpm > 80) {
    emotionScores.manic += 2;
    emotionScores.angry += 1;
    emotionScores.anxious += 1;
    emotionScores.excited += 1;
  } else if (wpm < 20 && wpm > 0) {
    emotionScores.sad += 2;
    emotionScores.melancholic += 2;
    emotionScores.contemplative += 1;
    emotionScores.peaceful += 1;
  } else if (wpm < 30 && wpm > 0) {
    emotionScores.sad += 1;
    emotionScores.confused += 1;
    emotionScores.contemplative += 1;
  }

  // Check for exclamation marks
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations >= 5) {
    emotionScores.ecstatic += exclamations;
    emotionScores.furious += Math.floor(exclamations / 2);
  } else if (exclamations >= 3) {
    emotionScores.manic += exclamations;
    emotionScores.excited += exclamations;
    emotionScores.angry += Math.floor(exclamations / 2);
  }

  // Check for question marks
  const questions = (text.match(/\?/g) || []).length;
  if (questions >= 2) {
    emotionScores.confused += questions;
    emotionScores.curious += Math.floor(questions / 2);
  }

  // Check for ALL CAPS words
  const capsWords = (text.match(/\b[A-Z]{2,}\b/g) || []).length;
  if (capsWords >= 3) {
    emotionScores.furious += capsWords;
    emotionScores.manic += capsWords;
  } else if (capsWords >= 2) {
    emotionScores.angry += capsWords;
    emotionScores.manic += Math.floor(capsWords / 2);
  }

  // Check for ellipsis (contemplative/melancholic)
  const ellipsis = (text.match(/\.\.\./g) || []).length;
  if (ellipsis >= 2) {
    emotionScores.contemplative += ellipsis;
    emotionScores.melancholic += ellipsis;
    emotionScores.nostalgic += Math.floor(ellipsis / 2);
  }

  // Check for heart emojis
  const hearts = (text.match(/[❤️💕💖💗💙💚💛🧡💜🤍🖤💘]/g) || []).length;
  if (hearts >= 1) {
    emotionScores.loving += hearts * 2;
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

// Emotion categories for effects grouping
export const emotionCategories = {
  serene: ['peaceful', 'content', 'grateful', 'contemplative'],
  joyful: ['happy', 'excited', 'ecstatic', 'amused', 'proud', 'awestruck'],
  loving: ['loving', 'hopeful'],
  dark: ['sad', 'lonely', 'melancholic', 'devastated'],
  anxious: ['anxious', 'fearful', 'terrified'],
  angry: ['angry', 'frustrated', 'furious', 'bitter', 'resentful'],
  chaotic: ['manic', 'confused'],
  negative: ['jealous', 'guilty', 'ashamed', 'disgusted', 'envious'],
  subtle: ['nostalgic', 'curious', 'bored', 'apathetic']
} as const;

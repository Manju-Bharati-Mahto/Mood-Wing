-- Add text length constraint to prevent DoS via extremely long entries
ALTER TABLE public.journal_entries ADD CONSTRAINT journal_text_length_check CHECK (length(text) <= 10000);

-- Add emotion type validation constraint
ALTER TABLE public.journal_entries ADD CONSTRAINT journal_emotion_check CHECK (
  emotion IN (
    'neutral', 'angry', 'sad', 'happy', 'anxious', 'fearful',
    'manic', 'confused', 'frustrated', 'lonely',
    'peaceful', 'grateful', 'hopeful', 'loving', 'proud', 'excited', 'amused', 'content',
    'jealous', 'guilty', 'ashamed', 'disgusted', 'bitter', 'resentful', 'envious',
    'nostalgic', 'melancholic', 'contemplative', 'curious', 'bored', 'apathetic',
    'ecstatic', 'devastated', 'furious', 'terrified', 'awestruck'
  )
);
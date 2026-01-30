


export const adviceOptions = {
  happy: [
    "Keep smiling and spread the positivity!",
    "Enjoy the little things that make you happy!",
    "Share your joy with someone today!"
  ],
  sad: [
    "Take a break, breathe, and allow yourself to feel.",
    "It’s okay to have a sad day. Be gentle with yourself.",
    "Talk to someone you trust to ease your sadness."
  ],
  angry: [
    "Take a deep breath and step back for a moment.",
    "Count to ten and release the tension slowly.",
    "Channel your anger into something productive or creative."
  ],
  calm: [
    "Enjoy this peaceful moment and stay mindful.",
    "Take a slow breath and appreciate the calm.",
    "Use this calm time to organize your thoughts positively."
  ],
  anxious: [
    "Focus on what you can control and take a small action.",
    "Write down your worries to organize your thoughts.",
    "Take slow, deep breaths to calm your mind."
  ],
  love: [
    "Share your affection and kindness with someone you care about.",
    "Express gratitude or love to make your day brighter.",
    "Remember that love starts with yourself first."
  ],
  neutral: [
    "Stay mindful and observe your feelings.",
    "Take a moment to relax and continue your day peacefully.",
    "Focus on small, positive actions you can do now."
  ],
  mixed: [
    "It's okay to feel many things at once. Take care of yourself.",
    "Multiple emotions are normal. Pause and reflect on them calmly.",
    "You may have different feelings now. Be gentle with yourself."
  ]
} as const;

export type Advice = keyof typeof adviceOptions;

export const moodKeywords: Record<string, readonly string[]> = {
  happy: [
    "happy", "joy", "glad", "smile", "excited", "cheerful", "content",
    "masaya", "tuwa", "galak", "saya", "ngiti", "kinikilig"
  ],
  sad: [
    "sad", "cry", "tired", "down", "lonely", "hurt", "broken",
    "malungkot", "lungkot", "iyak", "pagod", "luha", "nasasaktan", "nalulungkot"
  ],
  angry: [
    "angry", "mad", "furious", "annoyed", "irritated", "hate",
    "galit", "inis", "badtrip", "naiinis", "nagagalit", "asar"
  ],
  calm: [
    "calm", "relaxed", "peace", "chill", "quiet", "still",
    "payapa", "relax", "kalma", "tahimik", "panatag"
  ],
  anxious: [
    "anxious", "worried", "nervous", "overthinking", "stress",
    "kinakabahan", "kabado", "balisa", "nag-aalala", "stress"
  ],
  love: [
    "love", "miss", "crush", "affection", "heart",
    "mahal", "pagmamahal", "miss", "iniibig", "sinta"
  ],
};


export type Mood = keyof typeof moodKeywords;

import { moodKeywords, Mood } from "./moodKeywords";
import { adviceOptions, Advice } from "./adviceOptions";



    // Tokenizer
     function tokenize(text: string) {
      return text.toLowerCase().match(/\p{L}+/gu) || [];
    }
    

    // Detect single mood in a sentence
  export function detectMood(sentence: string): Mood {
    const words = tokenize(sentence);

    for (const mood of Object.keys(moodKeywords) as Mood[]) {
      if (words.some(word => moodKeywords[mood]!.includes(word))) {
        return mood;
      }
    }

    return "neutral" as Mood; // if neutral is not in moodKeywords
  }

    
    // ----------------------------
    // Detect all moods in the text
   export function detectAllMoods(text: string): Mood[] {
        const words = tokenize(text);
        const detected: Mood[] = [];

        for (const mood of Object.keys(moodKeywords) as Mood[]) {
          if (words.some(word => moodKeywords[mood]!.includes(word))) {
            detected.push(mood);
          }
        }

        return [...new Set(detected)];
      }


    // 1️⃣ Utility function
    export function getRandomAdvice(list: readonly string[]) {
      if (!Array.isArray(list) || list.length === 0) return "";
      return list[Math.floor(Math.random() * list.length)];
    }

   
    // 2️⃣ Advice logic
  export  function getAdviceForMoods(moods: Advice[] = []) {
      if (!Array.isArray(moods) || moods.length === 0) {
        return getRandomAdvice(adviceOptions.neutral);
      }
    
      if (moods.length > 3) {
        return getRandomAdvice(adviceOptions.mixed);
      }
    
     if (moods.length === 1) {
      const mood = moods[0] as Advice; // TypeScript now knows this exists
      return getRandomAdvice(adviceOptions[mood] ?? adviceOptions.neutral);
    }

    
      return moods
        .map(mood => getRandomAdvice(adviceOptions[mood] ?? adviceOptions.neutral))
        .join("  ");
    }
    
    
    
import { moodKeywords } from "./moodKeywords";
import { adviceOptions } from "./adviceOptions";


    // Tokenizer
     function tokenize(text) {
      return text.toLowerCase().match(/\p{L}+/gu) || [];
    }
    

    // Detect single mood in a sentence
  export function detectMood(sentence) {
      const words = tokenize(sentence);
    
      for (const mood in moodKeywords) {
        if (words.some(word => moodKeywords[mood].includes(word))) {
          return mood;
        }
      }
    
      return "neutral";
    }
    
    // ----------------------------
    // Detect all moods in the text
   export function detectAllMoods(text) {
      const words = tokenize(text);
      const detected = [];
    
      for (const mood in moodKeywords) {
        if (words.some(word => moodKeywords[mood].includes(word))) {
          detected.push(mood); // ✅ push mood string
        }
      }
    
    
    
      return [...new Set(detected)];
    }

    // 1️⃣ Utility function
  export  function getRandomAdvice(list = []) {
      if (!Array.isArray(list) || list.length === 0) return "";
      return list[Math.floor(Math.random() * list.length)];
    }
    
   
    // 2️⃣ Advice logic
  export  function getAdviceForMoods(moods = []) {
      if (!Array.isArray(moods) || moods.length === 0) {
        return getRandomAdvice(adviceOptions.neutral);
      }
    
      if (moods.length > 3) {
        return getRandomAdvice(adviceOptions.mixed);
      }
    
      if (moods.length === 1) {
        return getRandomAdvice(adviceOptions[moods[0]] ?? adviceOptions.neutral);
      }
    
      return moods
        .map(mood => getRandomAdvice(adviceOptions[mood] ?? adviceOptions.neutral))
        .join("  ");
    }
    
    
    
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { height, width } from "@mui/system";
import OutlinedCard from "./Card";
import { v4 as uuidv4 } from 'uuid';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';

function App() {

const moodKeywords = {
  happy: [
    // English
    "happy", "joy", "glad", "smile", "excited", "cheerful", "content",
    // Tagalog
    "masaya", "tuwa", "galak", "saya", "ngiti", "kinikilig"
  ],

  sad: [
    // English
    "sad", "cry", "tired", "down", "lonely", "hurt", "broken",
    // Tagalog
    "malungkot", "lungkot", "iyak", "pagod", "luha", "nasasaktan",
    "nalulungkot"
  ],

  angry: [
    // English
    "angry", "mad", "furious", "annoyed", "irritated", "hate",
    // Tagalog
    "galit", "inis", "badtrip", "naiinis", "nagagalit", "asar"
  ],

  calm: [
    // English
    "calm", "relaxed", "peace", "chill", "quiet", "still",
    // Tagalog
    "payapa", "relax", "kalma", "tahimik", "panatag"
  ],

  anxious: [
    // English
    "anxious", "worried", "nervous", "overthinking", "stress",
    // Tagalog
    "kinakabahan", "kabado", "balisa", "nag-aalala", "stress"
  ],

  love: [
    // English
    "love", "miss", "crush", "affection", "heart",
    // Tagalog
    "mahal", "pagmamahal", "miss", "iniibig", "sinta"
  ]
};


const adviceOptions = {
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
};

const moodEmojis = {
  happy: "😄",
  sad: "😢",
  angry: "😡",
  calm: "😌",
  anxious: "😰",
  love: "❤️",
  neutral: "😐"
};

// ----------------------------
// States
const [text, setText] = useState("");
const [sentences, setSentences] = useState([]);
const [adviceText, setAdviceText] = useState(""); // new state for advice display
const [input, setInput] = useState({
title: "",
content: ""
});
const [note, setNote] = useState([]);
const [checked, setChecked] = useState(false);
// ----------------------------
// Random advice helper
function getRandomAdvice(adviceArray) {
  const index = Math.floor(Math.random() * adviceArray.length);
  return adviceArray[index];
}

// ----------------------------
// Tokenizer
function tokenize(text) {
  return text.toLowerCase().match(/\p{L}+/gu) || [];
}

// ----------------------------
// Check if sentence is finished
function isSentenceFinished(sentence, forced = false) {
  if (forced) return true;

  const trimmed = sentence.trim();
  if (!trimmed) return false;

  const endPunctuation = /[.!?…。！？]+$/;
  const endsWithEmoji = /\p{Extended_Pictographic}$/u.test(trimmed);

  return endPunctuation.test(trimmed) || endsWithEmoji;
}
// ----------------------------
// Detect single mood in a sentence
function detectMood(sentence) {
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
function detectAllMoods(text) {
  const words = tokenize(text);
  const detected = [];

  for (const mood in moodKeywords) {
    if (words.some(word => moodKeywords[mood].includes(word))) {
      detected.push(mood);
    }
  }

  if (detected.length === 0) detected.push("neutral");

  // Remove duplicates
  return [...new Set(detected)];
}

// ----------------------------
// Emoji only if sentence finished
function getEmojiForSentence(sentence) {
  if (!isSentenceFinished(sentence)) return null;
  const mood = detectMood(sentence);
  return moodEmojis[mood] || "😐";
}

// ----------------------------
// Split sentences but keep punctuation
function splitSentences(text) {
  return text.match(/[^.!?]+[.!?]?/g) || [];
}

const typingTimerRef = useRef(null);
const TYPING_DELAY = 700;

// ----------------------------
// Handle typing
const handleChange = (e) => {
  const { name, value } = e.target;

  // Always update saved input
  setInput(prev => ({
    ...prev,
    [name]: value
  }));



  // ONLY analyze textarea
if (name === "content") {
  setText(value);

clearTimeout(typingTimerRef.current);

typingTimerRef.current = setTimeout(() => {
  const detectedSentences = splitSentences(value).map(sentence => ({
    text: sentence,
    emoji: isSentenceFinished(sentence, true)
      ? moodEmojis[detectMood(sentence)] || "😐"
      : null
  }));

  setSentences(detectedSentences);
}, TYPING_DELAY);
}

};

// ----------------------------
// Get advice for detected moods
function getAdviceForMoods(moods) {
  if (moods.length > 3) {
    return getRandomAdvice(adviceOptions.mixed); // use mixed advice
  }

  if (moods.length === 1) {
    return getRandomAdvice(adviceOptions[moods[0]]);
  }

  // 2–3 moods → pick random advice for each mood
  return moods.map(mood => getRandomAdvice(adviceOptions[mood])).join("  ");
}


const now = new Date();

const year = now.getFullYear();      // 2026
const month = now.getMonth() + 1;    // 1–12 (add 1!)
const day = now.getDate();   
const formatted = `${month}/${day}/${year}`;

// ----------------------------
// Handle submit
const handleSubmit = (e) => {
  e.preventDefault();

  if(!input.title.trim() && !input.content.trim()) return

setNote(prevNote => [...prevNote, {
  id: uuidv4(),
  title: input.title,
  content: input.content,
  sentences,
  isPinned: false,
  createdAt: formatted,
  order: prevNote.length // this is the key
}]);


    // Analyze full mood text
  const fullText = input.content;

  // Detect all moods in the text
  const moodsDetected = detectAllMoods(fullText);

  // Get dynamic advice
  const finalAdvice = getAdviceForMoods(moodsDetected);

  // Set state to display
  setAdviceText(finalAdvice);

  setInput({title: "", content: ""});
  setText("")
  setSentences([]);
};


function pinNote(id, checked) {
  setNote(prev => {
    const updated = prev.map(note =>
      note.id === id ? { ...note, isPinned: checked } : note
    );

    // Sort: pinned first, then original order
    return [...updated].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return b.isPinned - a.isPinned; // pinned first
      }
      return a.order - b.order; // restore original order
    });
  });
}

function deleteNote(id){
  
  setNote(prevNote => (prevNote.filter(i =>  i.id !== id)))

}


const simpleZoom = e => (setChecked(true));


  return (
    <div className="container">
      <div className="top-content">
        <div className="card-content">
          <form action="" onSubmit={handleSubmit}>
              <div className="card">
        <span className="cardTitle">Add Note</span>


        <div className="cardContent">
        <div className="input-content">

        
          { checked ? 
          <input 
          onChange={handleChange} 
          value={input.title} 
          name="title" 
          type="text" 
          placeholder="Title" 
          /> : null
           }
</div>
          
        <textarea
        onClick={simpleZoom}
        name="content"
        value={input.content}
        onChange={handleChange}
        onKeyDown={e => {
          if (e.key === "Enter" && !e.shiftKey) {
            const detectedSentences = splitSentences(e.target.value).map(sentence => ({
              text: sentence,
              emoji: moodEmojis[detectMood(sentence)] || "😐"
            }));
            setSentences(detectedSentences);
          }
        }}
  onBlur={e => {
    const detectedSentences = splitSentences(e.target.value).map(sentence => ({
      text: sentence,
      emoji: moodEmojis[detectMood(sentence)] || "😐"
    }));
    setSentences(detectedSentences);
  }}
  placeholder="how's your day?"
  rows={checked ? 5 : 2}
  style={{height: checked ? 200: 80}}
/>

        {checked ?
                  <div className="emotion">
         {(() => {
    const displayedEmojis = new Set(); // keep track of emojis already shown
    return sentences.map((s, i) => {
      if (s.emoji && !displayedEmojis.has(s.emoji)) {
        displayedEmojis.add(s.emoji);
        return <span className="fade" key={i}>{s.emoji}</span>;
      }
      return null; // don't display repeated emoji
    });
  })()}
          </div> : null  
      }

        </div>
       <Zoom in={checked}>
        <Fab
          sx={{
    position: "absolute",
    bottom: "-14px",
    right: "14px",
    height: 34,
    width: 34,
    minHeight: 34,
    backgroundColor: "#E6B566",
    color: "white",
    "&:hover": {
      backgroundColor: "#d9a64f",
    },
  }}
  type="submit"  name="submit" value="submit"><AddIcon /></Fab>
      </Zoom>
      </div>
      </form>
        </div>
      <div className="advice-panel">
            <div>
              {adviceText && ( 
                 <h3>{adviceText}</h3>
              )}
             
            </div>
      </div>
      </div>
      
<div className="note-container">
{note.map((item) => (
  <div className="note-card" key={item.id}>
    <OutlinedCard
      id={item.id}
      title={item.title}
      content={item.content}
      emojis={item.sentences.map(s => s.emoji)}
      date={item.createdAt}
      onPin={pinNote}
      onDelete={deleteNote}
      pinned={item.isPinned}
    />
  </div>
))}

</div>

    </div>
  );
}



export default App;
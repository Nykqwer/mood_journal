import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddIcon from '@mui/icons-material/Add';
import { height, width } from "@mui/system";
import OutlinedCard from "./Card";
import { v4 as uuidv4 } from 'uuid';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';


const SERVER = "http://localhost:5000"

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
};

// ----------------------------
// States
const [text, setText] = useState("");
const [sentences, setSentences] = useState([]);
const [adviceText, setAdviceText] = useState(null); 
const [input, setInput] = useState({
title: "",
content: "",

});
const [note, setNote] = useState([]);
const [checked, setChecked] = useState(false);
const [pinned, setPinned] = useState(false);



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
      detected.push(mood); // ✅ push mood string
    }
  }



  return [...new Set(detected)];
}

// ----------------------------

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
      ? moodEmojis[detectMood(sentence)]
      : null
  }));

  setSentences(detectedSentences);
}, TYPING_DELAY);
}

};

// ----------------------------
// 1️⃣ Utility function
function getRandomAdvice(list = []) {
  if (!Array.isArray(list) || list.length === 0) return "";
  return list[Math.floor(Math.random() * list.length)];
}

// ---------------------------
// 2️⃣ Advice logic
function getAdviceForMoods(moods = []) {
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


// Handle submit
const handleSubmit = async (e) => {
  e.preventDefault();

    // Analyze full mood text
    const fullText = input.content;

   // Detect all moods in the text
    const moodsDetected = detectAllMoods(fullText);


     // Get dynamic advice
    const finalAdvice = getAdviceForMoods(moodsDetected);

    const emojisToSave = moodsDetected.map(m => moodEmojis[m]);



    // Set state to display
    setAdviceText(finalAdvice);

  if (!input.title.trim() && !fullText.trim()) return;

  try {

    const noteId = uuidv4();
    const res = await fetch(`${SERVER}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: noteId,
          title: input.title,
          content: input.content,
          emojis: emojisToSave,  
          sentences: finalAdvice,
            
        })
      });


    if (!res.ok) {
      throw new Error("Failed to save note");
    }

  const savedNote = await res.json();
  setNote(prev => [savedNote, ...prev]);

    // Reset inputs
    setInput({ title: "", content: "" });
    setText("");
    setSentences([]);
    
  } catch (error) {
    console.error(error);
  }
};



function pinNote(updatedNote) {
  setNote(prev => {
    const updated = prev.map(note =>
      note.id === updatedNote.id ? updatedNote : note
    );

    return [...updated].sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) {
        return b.is_pinned - a.is_pinned;
      }
      return b.original_order - a.original_order;
    });
  });
}



const simpleZoom = () => (setChecked(true));


useEffect(() => { 
  const fetchNotes = async () => { 
    try { 
      const res = await fetch(`${SERVER}`); 
      const data = await res.json(); 
      
      setNote(data);
  } catch (err) { 
    console.error("Error fetching notes:", err);
   }}; 
   
   fetchNotes(); 
  
  }, []);




  function handleToggle(id){

    const selectedNote = note.find(n => n.id === id);
    if (!selectedNote) return;

    setAdviceText(selectedNote.sentences)

  };



const deleteNote = async (id) => {
  try {
    const res = await fetch(`${SERVER}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete note");
    }

    // This will remove it from frontend instantly
    setNote(prevNote => prevNote.filter(i => i.id !== id));
  } catch (err) {
    console.error("Error deleting note: ", err);
  }
};







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

           
              {adviceText && <h3>{adviceText}</h3>}
             
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
      emojis={item.emojis}
      date={item.created_at}
      onToggle={handleToggle}
      onPin={pinNote}
      onDelete={deleteNote}
      pinned={item.is_pinned}
    />
  </div>
))}

</div>

    </div>
  );
}



export default App;
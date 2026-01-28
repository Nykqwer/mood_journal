import { useState, useRef } from "react";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { v4 as uuidv4 } from "uuid";
import AddIcon from "@mui/icons-material/Add";
import { moodEmojis } from "../../features/mood/moodEmojis";
import { detectAllMoods } from "../../features/mood/moodUtils";
import { detectMood } from "../../features/mood/moodUtils";
import { getAdviceForMoods } from "../../features/mood/moodUtils";
import { createNote } from "../../services/noteServies";

export default function AddNoteForm({ onAdvice, onAddNote, noteData }) {
  const [text, setText] = useState("");

  const [sentences, setSentences] = useState([]);

  const [checked, setChecked] = useState(false);
  const [active, setActive] = useState(false);
  const [input, setInput] = useState({
    title: "",
    content: "",
  });

  const simpleZoom = () => setChecked(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Always update saved input
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ONLY analyze textarea
    if (name === "content") {
      setText(value);

      setActive(value.trim().length > 0);

      clearTimeout(typingTimerRef.current);

      typingTimerRef.current = setTimeout(() => {
        const detectedSentences = splitSentences(value).map((sentence) => ({
          text: sentence,
          emoji: isSentenceFinished(sentence, true)
            ? moodEmojis[detectMood(sentence)]
            : null,
        }));

        setSentences(detectedSentences);
      }, TYPING_DELAY);
    }
  };

  // Check if sentence is finished
  function isSentenceFinished(sentence, forced = false) {
    if (forced) return true;

    const trimmed = sentence.trim();
    if (!trimmed) return false;

    const endPunctuation = /[.!?…。！？]+$/;
    const endsWithEmoji = /\p{Extended_Pictographic}$/u.test(trimmed);

    return endPunctuation.test(trimmed) || endsWithEmoji;
  }

  // Split sentences but keep punctuation
  function splitSentences(text) {
    return text.match(/[^.!?]+[.!?]?/g) || [];
  }

  const typingTimerRef = useRef(null);
  const TYPING_DELAY = 700;

  // ----------------------------

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullText = input.content;

    const moodsDetected = detectAllMoods(fullText);

    const finalAdvice = getAdviceForMoods(moodsDetected);

    const emojisToSave = moodsDetected.map((m) => moodEmojis[m]);

    onAdvice(finalAdvice);

    if (!input.title.trim() && !fullText.trim()) return;

    const cardColors = ["#E3F2FD", "#FCE4EC", "#E8F5E9", "#FFFDE7", "#F3E5F5"];

    const getRandomColor = () => {
      return cardColors[Math.floor(Math.random() * cardColors.length)];
    };

    const cardColor = getRandomColor();
    console.log(cardColor);
    const noteId = uuidv4();

    const note = {
      id: noteId,
      title: input.title,
      content: input.content,
      emojis: emojisToSave,
      sentences: finalAdvice,
      color: cardColor,
    };

    try {
      const savedNote = await createNote(note);

      const pinnedNotes = noteData.filter((note) => note.is_pinned);

      onAddNote((prev) => {
        const merged = [...pinnedNotes, savedNote, ...prev];
        const unique = Array.from(
          new Map(merged.map((n) => [n.id, n])).values(),
        );
        return unique;
      });

      // Reset inputs
      setInput({ title: "", content: "" });
      setText("");
      setSentences([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="mb-8 py-4" action="" onSubmit={handleSubmit}>
      <div className="relative w-70 border border-gray-300 shadow-sm sm:w-150">
        <span className="absolute -top-6 left-3 rounded-md bg-orange-300 px-2 py-2 text-white">
          {checked ? "Listening..." : "Tell me a story"}
        </span>

        <div className="mt-3 flex flex-col px-4 py-5">
          {checked ? (
            <input
              onChange={handleChange}
              value={input.title}
              name="title"
              type="text"
              placeholder="Title"
              className="mt-2 mb-4 border-b border-transparent bg-transparent py-1 pl-2 text-[18px] transition focus:border-gray-300 focus:ring-0 focus:outline-none"
            />
          ) : null}

          <textarea
            onClick={simpleZoom}
            name="content"
            className={`${checked ? "" : "mt-10 text-[20px]"} h-24 border border-transparent bg-transparent py-1 pl-2 transition focus:border-gray-300 focus:ring-0 focus:outline-none`}
            value={input.content}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                const detectedSentences = splitSentences(e.target.value).map(
                  (sentence) => ({
                    text: sentence,
                    emoji: moodEmojis[detectMood(sentence)],
                  }),
                );
                setSentences(detectedSentences);
              }
            }}
            onBlur={(e) => {
              const detectedSentences = splitSentences(e.target.value).map(
                (sentence) => ({
                  text: sentence,
                  emoji: moodEmojis[detectMood(sentence)],
                }),
              );
              setSentences(detectedSentences);
              setActive(false);
            }}
            placeholder="how's your day?"
            rows={checked ? 5 : 2}
            style={{ height: checked ? 200 : 80 }}
          />

          {checked ? (
            <div className="mt-3">
              {(() => {
                const displayedEmojis = new Set(); // keep track of emojis already shown
                return sentences.map((s, i) => {
                  if (s.emoji && !displayedEmojis.has(s.emoji)) {
                    displayedEmojis.add(s.emoji);
                    return (
                      <span className="fade text-2xl" key={i}>
                        {s.emoji}
                      </span>
                    );
                  }
                  return null;
                });
              })()}
            </div>
          ) : null}
        </div>
        <Zoom in={active}>
          <Fab
            type="submit"
            name="submit"
            value="submit"
            sx={{
              position: "absolute",
              bottom: "-26px",
              right: "16px",
              borderRadius: "9999px",
              backgroundColor: "#eba66d", // orange-400
              color: "#fff",
              padding: "4px",
              "&:hover": {
                backgroundColor: "#f97316", // orange-500
              },
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </div>
    </form>
  );
}

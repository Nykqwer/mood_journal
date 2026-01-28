import React, { useEffect, useState } from "react";
import NoteCard from "./notes/NoteCard";
import { deleteNote, fetchNotes } from "../services/noteServies";
import NoteList from "./notes/NoteList";

const SERVER = "http://localhost:5000";

function App() {
  const [note, setNote] = useState([]);
  const [adviceText, setAdviceText] = useState(null);

  function pinNote(updatedNote) {
    setNote((prev) => {
      const updated = prev.map((note) =>
        note.id === updatedNote.id ? updatedNote : note,
      );

      return [...updated].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned - a.is_pinned;
        }
        return b.original_order - a.original_order;
      });
    });
  }

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await fetchNotes();

        setNote(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };

    loadNotes();
  }, []);

  function handleToggle(id) {
    const selectedNote = note.find((n) => n.id === id);
    if (!selectedNote) return;

    setAdviceText(selectedNote.sentences);
  }

  const handleDeleteNote = async (id) => {
    try {
      deleteNote(id);
      // This will remove it from frontend instantly
      setNote((prevNote) => prevNote.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error deleting note: ", err);
    }
  };

  return (
    <div className=" px-4 py-5 md:px-10">
      <NoteCard
        note={note}
        onAddNote={setNote}
        onSetAdviceText={setAdviceText}
        adviceText={adviceText}
      />
      <NoteList
        note={note}
        onToggle={handleToggle}
        pinNote={pinNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default App;

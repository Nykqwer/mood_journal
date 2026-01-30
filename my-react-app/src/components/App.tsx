import React, { useEffect, useState } from "react";
import NoteCard from "./notes/NoteCard";
import { deleteNote, fetchNotes } from "../services/noteServies";
import NoteList from "./notes/NoteList";
import { Note } from "./types/note";


function App() {
  const [note, setNote] = useState< Note[] >([]);
  const [adviceText, setAdviceText] = useState<string | null>(null);

  function pinNote(updatedNote: Note) {
    setNote((prev) => {
      const updated = prev.map((note) =>
        note.id === updatedNote.id ? updatedNote : note,
      );

      return [...updated].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return Number(b.is_pinned) - Number(a.is_pinned);
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

  function handleToggle(id: string) {
    const selectedNote = note.find((n) => n.id === id);
    if (!selectedNote) return;

    setAdviceText(selectedNote.sentences);
  }

  const handleDeleteNote = async (id: string) => {
    try {
      deleteNote(id);
      // This will remove it from frontend instantly
      setNote((prevNote) => prevNote.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Error deleting note: ", err);
    }
  };

  return (
    <div className="px-4 py-5 md:px-10">
      <NoteCard
        noteData={note}
        onAddNote={setNote}
        onAdvice={setAdviceText}
        adviceText={adviceText}
      />
      <NoteList
        note={note}
        onToggle={handleToggle}
        onPinned={pinNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default App;

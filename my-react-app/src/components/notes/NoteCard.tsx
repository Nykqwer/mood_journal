import AddNoteForm from "./AddNoteForm";
import {NoteListProps } from "../types/note";
import { Note } from "../types/note";



export default function NoteCard({
  onAddNote,
  onAdvice,
  noteData,
  adviceText
}:NoteListProps ) {
  return (
    <div className="flex flex-row">
      <AddNoteForm
        onAdvice={onAdvice}
        onAddNote={onAddNote}
        noteData={noteData}
      />

      <div className="flex w-screen items-center justify-center px-2 text-4xl font-bold text-orange-300 md:px-4">
        <div>{adviceText && <h3>{adviceText}</h3>}</div>
      </div>
    </div>
  );
}

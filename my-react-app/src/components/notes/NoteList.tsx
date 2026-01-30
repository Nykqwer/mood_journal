import React from "react";
import OutlinedCard from "../Card";
import { Note } from "../types/note";

type NoteListProps = {
  note: Note[];
  onToggle: (id: string) => void;
  onPinned: (Note: Note) => void;
  onDeleteNote: (id: string) => void;

}

export default function NoteList({ note, onToggle, onPinned, onDeleteNote }: NoteListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {note.map((item) => (
        <div className="w-20" key={item.id}>
          <OutlinedCard
            note={item}
            onToggle={onToggle}
            onPinned={onPinned}
            onDelete={onDeleteNote}
       
          />
        </div>
      ))}
    </div>
  );
}

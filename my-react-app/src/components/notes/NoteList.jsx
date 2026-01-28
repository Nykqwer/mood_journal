import React from "react";
import OutlinedCard from "../Card";

export default function NoteList({ note, onToggle, pinNote, onDeleteNote }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {note.map((item) => (
        <div className="w-20" key={item.id}>
          <OutlinedCard
            id={item.id}
            title={item.title}
            content={item.content}
            emojis={item.emojis}
            date={item.created_at}
            onToggle={onToggle}
            onPin={pinNote}
            onDelete={onDeleteNote}
            pinned={item.is_pinned}
            cardColor={item.card_color}
          />
        </div>
      ))}
    </div>
  );
}

import AddNoteForm from "./AddNoteForm";

export default function NoteCard({
  onAddNote,
  adviceText,
  onSetAdviceText,
  note,
}) {
  return (
    <div className="flex flex-row">
      <AddNoteForm
        onAdvice={onSetAdviceText}
        onAddNote={onAddNote}
        noteData={note}
      />

      <div className="flex w-screen items-center justify-center px-2 text-4xl font-bold text-orange-300 md:px-4">
        <div>{adviceText && <h3>{adviceText}</h3>}</div>
      </div>
    </div>
  );
}

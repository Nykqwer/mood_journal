
export type Note = {
  id: string;
  title: string;
  content: string;
  emojis: string;
  sentences: string;
  is_pinned: boolean;
  card_color: string;
  original_order: number;
  created_at: string
};


export type NoteListProps = {
  onAdvice: (advice: string) => void;
  onAddNote: React.Dispatch<React.SetStateAction<Note[]>>; // <-- like setNote
  noteData: Note[];
  adviceText?: string | null;

}